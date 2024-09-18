const dbQuery = require('../../db-conn/db-query');

exports.add = async (reqParams) => {
    try {
        const user_id = reqParams['user_id'] || 0;
        const res_id = reqParams['res_id'] || 0;
        const total_price = reqParams['total_price'] || 0;
        const products_data = reqParams['products_data'] || [];
        const status = reqParams['status'] || 0;

        const insertRec = { 'user_id': user_id, 'res_id': res_id, 'total_price': total_price, 'transaction_date': new Date(), 'status': status };
        const result = await dbQuery.addRecord(TBL_ORDER_TRANSACTIONS, insertRec);
        const trans_id = result['insertId'];

        await addSubTransactions(trans_id, products_data);
        return { status: 200, msg: 'Order transaction added successfully', insertId: trans_id };
    } catch (error) {
        throw error;
    }
};

async function addSubTransactions(trans_id, products_data) {
    try {
        // Use Promise.all to handle all asynchronous operations
        await Promise.all(products_data.map(async (item) => {
            const insertId = { 'trans_id': trans_id, 'product_id': item['product_id'], 'product_qty': item['product_qty'] };
            await dbQuery.addRecord(TBL_SUB_TRANSACTIONS, insertId);
            await deleteUserCartData(item['cart_id'])
        }));
    } catch (error) {
        throw error;
    }
}
async function deleteUserCartData(cart_id) {
    try {
        const whr = { cart_id: cart_id };
        await dbQuery.delRecord(TBL_USER_CART, whr);
        return { status: true, msg: 'Record Deleted Successfully' };
    } catch (error) {
        throw error;
    }
};

exports.update = async (reqParams) => {
    try {
        const trans_id = reqParams['trans_id'] || 0;
        const user_id = reqParams['user_id'] || 0;
        const res_id = reqParams['res_id'] || 0;
        const total_price = reqParams['total_price'] || 0;
        const transaction_date = reqParams['transaction_date'] || 0;
        const status = reqParams['status'] || 0;

        const updateRec = { user_id: user_id, res_id: res_id, total_price: total_price, transaction_date: transaction_date, status: status };
        const whr = { trans_id: trans_id };
        await dbQuery.updateRecord(TBL_ORDER_TRANSACTIONS, updateRec, whr);
        let msg = 'Record Updated Successfully'
        if (status == 2) {
            msg = 'Order Accepeted Successfull'
        } else if (status == 3) {
            msg = 'Order Rejection Successfull'
        }
        return { status: true, msg: msg };
    } catch (error) {
        throw error;
    }
};
exports.del = async (reqParams) => {
    try {
        await deleteSubTrans(reqParams['trans_id'])
        const whr = { trans_id: reqParams['trans_id'] || 0 };
        await dbQuery.delRecord(TBL_ORDER_TRANSACTIONS, whr);
        return { status: true, msg: 'Record Deleted Successfully' };
    } catch (error) {
        throw error;
    }
};
async function deleteSubTrans(trans_id) {
    try {
        const whr = { trans_id: trans_id || 0 };
        await dbQuery.delRecord(TBL_SUB_TRANSACTIONS, whr);
        return { status: true, msg: 'Record Deleted Successfully' };
    } catch (error) {
        throw error;
    }
}

exports.details = async (reqParams) => {
    try {
        const res_id = reqParams['res_id'] || 0;
        const user_id = reqParams['user_id'] || 0;
        const status = reqParams['status'] || 0;

        let whr = '';
        const qryData = [TBL_ORDER_TRANSACTIONS, TBL_USERS, TBL_RESTAURANTS];

        if (user_id > 0) {
            whr += ' AND ot.user_id = ?';
            qryData.push(user_id);
        }
        if (res_id > 0) {
            whr += ' AND ot.res_id = ?';
            qryData.push(res_id);
        }
        if (status > 0) {
            whr += ' AND ot.status = ?';
            qryData.push(status);
        }

        const query = 'SELECT ot.*, u.user_name, u.email, r.restaurant_name FROM ?? AS ot \
        INNER JOIN ?? as u ON ot.user_id=u.user_id \
        INNER JOIN ?? as r ON ot.res_id=r.res_id WHERE 1=1 '+ whr
        const result = await dbQuery.getDetails(query, qryData);

        let transArray = [];
        result.forEach((item) => {
            item['products_data'] = []
            transArray.push(item['trans_id']);
        })

        const productsQryData = [TBL_SUB_TRANSACTIONS, TBL_RESTAURANT_PRODUCTS, transArray];
        const productsQuery = 'SELECT st.sub_trans_id, st.trans_id, st.product_id, st.product_qty, rp.product_name, rp.product_img, rp.price, rp.description \
        FROM ?? AS st INNER JOIN ?? AS rp ON st.product_id=rp.product_id \
        WHERE st.trans_id IN (?)';
        const productsData = await dbQuery.getDetails(productsQuery, productsQryData);

        if (productsData.length > 0) {
            productsData.forEach((obj) => {
                if (Buffer.isBuffer(obj['product_img'])) {
                    const base64Image = obj['product_img'].toString('base64');
                    obj['product_img'] = `data:image/png;base64,${base64Image}`;
                }
                const index = result.findIndex(ele => ele['trans_id'] == obj['trans_id'])
                if (index != -1) {
                    result[index]['products_data'].push(obj);
                }
            });
        }
        return { status: true, data: result };

    } catch (error) {
        return { status: false, msg: 'Internal server error', error };
    }
};
