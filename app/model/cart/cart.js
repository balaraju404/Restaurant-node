const dbQuery = require('../../db-conn/db-query');

exports.add = async (reqParams) => {
    try {
        const user_id = reqParams['user_id'] || 0;
        const res_id = reqParams['res_id'] || 0;
        const cat_id = reqParams['cat_id'] || 0;
        const product_id = reqParams['product_id'] || 0;
        const product_qty = reqParams['product_qty'] || 0;
        const status = reqParams['status'] || 0;

        const record = await checkRecord(reqParams);
        if (record.length > 0) {
            reqParams['cart_id'] = record[0]['cart_id'];
            await this.update(reqParams);
            return { status: true, msg: 'Record Updated Successfully' };
        }

        const insertRec = { user_id, res_id, cat_id, product_id, product_qty, status };
        const result = await dbQuery.addRecord(TBL_USER_CART, insertRec);
        const productId = result['insertId'];
        return { status: true, msg: 'Record Created Successfully', insertId: productId };
    } catch (error) {
        throw error;
    }
};

exports.update = async (reqParams) => {
    try {
        const user_id = reqParams['user_id'] || 0;
        const res_id = reqParams['res_id'] || 0;
        const cat_id = reqParams['cat_id'] || 0;
        const product_id = reqParams['product_id'] || 0;
        const product_qty = reqParams['product_qty'] || 0;
        const status = reqParams['status'] || 0;

        const updateRec = { user_id, res_id, cat_id, product_id, product_qty, status };
        const whr = { cart_id: reqParams['cart_id'] };
        await dbQuery.updateRecord(TBL_USER_CART, updateRec, whr);
        return { status: true, msg: 'Record Updated Successfully' };
    } catch (error) {
        throw error;
    }
};
exports.del = async (reqParams) => {
    try {
        const whr = { cart_id: reqParams['cart_id'] };
        await dbQuery.delRecord(TBL_USER_CART, whr);
        return { status: true, msg: 'Record Deleted Successfully' };
    } catch (error) {
        throw error;
    }
};

async function checkRecord(reqParams) {
    const user_id = reqParams['user_id'] || 0;
    const res_id = reqParams['res_id'] || 0;
    const cat_id = reqParams['cat_id'] || 0;
    const product_id = reqParams['product_id'] || 0;

    const query = 'SELECT cart_id FROM ?? WHERE user_id = ? AND res_id = ? AND cat_id = ? AND product_id = ?';
    const queryData = [TBL_USER_CART, user_id, res_id, cat_id, product_id];
    const result = await dbQuery.getDetails(query, queryData);
    return result;
}

exports.details = async (reqParams) => {
    try {
        const user_id = reqParams['user_id'] || 0;
        const res_id = reqParams['res_id'] || 0;
        const cat_id = reqParams['cat_id'] || 0;
        const status = reqParams['status'] || 0;

        let whr = '';
        const qryData = [TBL_USER_CART, TBL_RESTAURANT_PRODUCTS, TBL_RESTAURANTS, TBL_CATEGORIES];

        if (user_id > 0) {
            whr += ' AND uc.user_id = ?';
            qryData.push(user_id);
        }
        if (res_id > 0) {
            whr += ' AND uc.res_id = ?';
            qryData.push(res_id);
        }
        if (cat_id > 0) {
            whr += ' AND uc.cat_id = ?';
            qryData.push(cat_id);
        }
        if (status > 0) {
            whr += ' AND uc.status = ?';
            qryData.push(status);
        }

        const query = `SELECT uc.*, rp.product_name, rp.product_img, rp.price, r.restaurant_name, c.cat_name 
        FROM ?? AS uc
        INNER JOIN ?? AS rp ON uc.product_id = rp.product_id
        INNER JOIN ?? AS r ON uc.res_id = r.res_id 
        INNER JOIN ?? AS c ON uc.cat_id = c.cat_id 
        WHERE 1=1 ${whr} `;

        const result = await dbQuery.getDetails(query, qryData);
        if (result.length > 0) {
            result.forEach((obj) => {
                if (Buffer.isBuffer(obj['product_img'])) {
                    const base64Image = obj['product_img'].toString('base64');
                    obj['product_img'] = `data:image/png;base64,${base64Image}`;
                }
            });
        }
        return { status: true, data: result };

    } catch (error) {
        return { status: false, msg: 'Internal server error', error };
    }
};
