const dbQuery = require('../../db-conn/db-query');

exports.add = async (reqParams, image) => {
    try {
        const cat_name = reqParams['cat_name'];
        const cat_img = image['buffer'];
        const recordExists = await checkRecord(cat_name);
        if (recordExists) {
            return { status: false, msg: 'Category name already exists' };
        }
        const insertRec = { 'cat_name': cat_name, 'cat_img': cat_img, 'created_date': new Date(), 'status': 1 }
        const result = await dbQuery.addRecord(TBL_CATEGORIES, insertRec)
        return { status: true, msg: 'Category Created Successful', inertId: result['inertId'] }
    } catch (error) {
        throw error
    }
}
exports.details = async (reqParams) => {
    try {
        const query = 'SELECT * FROM ??'
        let qryData = [TBL_CATEGORIES]
        const result = await dbQuery.getDetails(query, qryData)
        if (result.length > 0) {
            result.forEach((obj) => {
                const imageData = obj['cat_img'];
                const base64Image = imageData.toString('base64');
                obj['cat_img'] = `data:image/png;base64,${base64Image}`;
            });
        }
        return { status: true, data: result }
    } catch (error) {
        throw error
    }
}
async function checkRecord(cat_name) {
    const query = 'SELECT COUNT(*) AS count FROM ?? WHERE cat_name = ?'
    const count = await dbQuery.getDetails(query, [TBL_CATEGORIES, cat_name])
    return count[0]['count'] > 0
}