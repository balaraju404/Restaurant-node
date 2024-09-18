const dbQuery = require('../../db-conn/db-query');

exports.add = async (reqParams, images) => {
    try {
        const res_id = reqParams['res_id'] || 0;
        const cat_id = reqParams['cat_id'] || 0;
        const product_name = reqParams['product_name'] || '';
        const product_img = images[0]['buffer'];
        const price = reqParams['price'];
        const description = reqParams['description'];

        const insertRec = { 'res_id': res_id, 'cat_id': cat_id, 'product_name': product_name, 'product_img': product_img, 'price': price, 'description': description, 'created_date': new Date(), 'status': 1 };
        const result = await dbQuery.addRecord(TBL_RESTAURANT_PRODUCTS, insertRec);
        const productId = result['insertId'];
        if (images.length > 1) {
            await resImages(productId, res_id, cat_id, images);
        }
        return { status: true, msg: 'Product Created Successfully', insertId: productId };
    } catch (error) {
        throw error;
    }
};

async function resImages(product_id, res_id, cat_id, images) {
    try {
        const promises = images.slice(1).map(async (img) => {
            const insertRec = { 'res_id': res_id, 'cat_id': cat_id, 'product_id': product_id, 'image': img['buffer'] };
            await dbQuery.addRecord(TBL_PRODUCT_IMAGES, insertRec);
        });
        await Promise.all(promises);
    } catch (error) {
        throw error;
    }
}
exports.details = async (reqParams) => {
    try {
        const res_id = reqParams['res_id'] || 0;
        const cat_id = reqParams['cat_id'] || 0;

        let whr = '';
        const qryData = [TBL_RESTAURANT_PRODUCTS, TBL_RESTAURANTS, TBL_CATEGORIES];

        if (res_id > 0) {
            whr += ' AND rp.res_id = ?';
            qryData.push(res_id);
        }
        if (cat_id > 0) {
            whr += ' AND rp.cat_id = ?';
            qryData.push(cat_id);
        }

        const query = `SELECT rp.*, r.restaurant_name, c.cat_name 
        FROM ?? AS rp 
        INNER JOIN ?? AS r ON rp.res_id = r.res_id 
        INNER JOIN ?? AS c ON rp.cat_id = c.cat_id 
        WHERE 1=1 ${whr} `;

        const result = await dbQuery.getDetails(query, qryData);

        const imagesQry = "SELECT * FROM ?? AS pi WHERE pi.product_id IN (?)";
        const product_images = await dbQuery.getDetails(imagesQry, [TBL_PRODUCT_IMAGES, result.map(r => r.product_id)]);

        result.forEach((obj) => {
            obj['images'] = product_images.filter((img) => img['product_id'] === obj['product_id']);
        });

        result.forEach((obj) => {
            if (Buffer.isBuffer(obj['product_img'])) {
                const base64Image = obj['product_img'].toString('base64');
                obj['product_img'] = `data:image/png;base64,${base64Image}`;
            }

            if (obj['images']) {
                obj['images'] = obj['images'].map((imgObj) => {
                    if (Buffer.isBuffer(imgObj['image'])) {
                        const base64Image = imgObj['image'].toString('base64');
                        imgObj['image'] = `data:image/png;base64,${base64Image}`;
                    }
                    return imgObj;
                });
            }
        });

        return { status: true, data: result };

    } catch (error) {
        return { status: false, msg: 'Internal server error', error };
    }
};



// exports.details = async (reqParams) => {
//     try {
//         const res_id = reqParams['res_id'] || 0;
//         const cat_id = reqParams['cat_id'] || 0;

//         let whr = '';
//         const qryData = [TBL_RESTAURANT_PRODUCTS, TBL_RESTAURANTS, TBL_CATEGORIES];

//         if (res_id > 0) {
//             whr += ' AND rp.res_id = ?';
//             qryData.push(res_id);
//         }
//         if (cat_id > 0) {
//             whr += ' AND rp.cat_id = ?';
//             qryData.push(cat_id);
//         }
//         const query = ` SELECT rp.*,r.restaurant_name,c.cat_name FROM ?? AS rp 
//         INNER JOIN ?? AS r ON rp.res_id = r.res_id 
//         INNER JOIN ?? AS c ON rp.cat_id = c.cat_id 
//         WHERE 1=1 ${whr}`;
//         const result = await dbQuery.getDetails(query, qryData);

//         const imagesQry = "SELECT * FROM ?? AS pi WHERE pi.res_id = ? "
//         const product_images = await dbQuery.getDetails(imagesQry, [TBL_PRODUCT_IMAGES, res_id]);

//         result.map((obj) => {
//             obj['images'] = product_images.filter((img) => img['res_id'] == obj['res_id'] && img['cat_id'] == obj['cat_id'] && img['product_id'] == obj['product_id'])
//         })
//         if (result.length > 0) {
//             result.forEach((obj) => {
//                 if (Buffer.isBuffer(obj['product_img'])) {
//                     const base64Image = obj['product_img'].toString('base64');
//                     obj['product_img'] = `data:image/png;base64,${base64Image}`;
//                 }

//                 if (obj['images']) {
//                     let imagesArray = typeof obj['images'] === 'string' ? JSON.parse(obj['images']) : obj['images'];

//                     imagesArray = imagesArray.map((imgObj) => {
//                         if (imgObj['image'] && Buffer.isBuffer(imgObj['image'])) {
//                             const base64Image = imgObj['image'].toString('base64');
//                             imgObj['image'] = `data:image/png;base64,${base64Image}`;
//                         }
//                         return imgObj;
//                     });
//                     obj['images'] = imagesArray; // Reassign the modified array back to the object
//                 }
//             });
//         }
//         return { status: true, data: result };
//     } catch (error) {
//         throw error;
//     }
// };

async function checkRecord(product_name) {
    const query = 'SELECT COUNT(*) AS count FROM ?? WHERE cat_name = ?'
    const count = await dbQuery.getDetails(query, [TBL_RESTAURANT_PRODUCTS, product_name])
    return count[0]['count'] > 0
}