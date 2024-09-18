const dbQuery = require('../../db-conn/db-query');

exports.add = async (reqParams) => {
    try {
        const res_id = reqParams['res_id'];
        const cat_id = reqParams['cat_id'];
        const recordExists = await checkRecord(res_id, cat_id);
        if (recordExists) {
            return { status: false, msg: 'Category already exists' };
        }
        const insertRec = { 'res_id': res_id, 'cat_id': cat_id, 'created_date': new Date(), 'status': 1 }
        const result = await dbQuery.addRecord(TBL_RESTAURANT_CATEGORIES, insertRec)
        return { status: true, msg: 'Category Created Successful', inertId: result['inertId'] }
    } catch (error) {
        throw error
    }
}
exports.details = async (reqParams) => {
    try {
        const res_id = reqParams['res_id'] || 0;
        if (res_id == 0) {
            return { status: false, msg: 'Invalid restaurant id' };
        }
        const query = 'SELECT rc.*,c.cat_name,c.cat_img,c.description FROM ?? AS rc INNER JOIN ?? AS c ON rc.cat_id=c.cat_id WHERE res_id = ?'
        let qryData = [TBL_RESTAURANT_CATEGORIES, TBL_CATEGORIES, res_id]
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
async function checkRecord(res_id, cat_id) {
    const query = 'SELECT COUNT(*) AS count FROM ?? WHERE res_id = ? AND cat_id = ?'
    const count = await dbQuery.getDetails(query, [TBL_RESTAURANT_CATEGORIES, res_id, cat_id])
    return count[0]['count'] > 0
}