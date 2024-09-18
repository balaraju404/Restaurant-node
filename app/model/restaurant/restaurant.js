const dbQuery = require('../../db-conn/db-query');

exports.create = async (reqParams, file) => {
    try {
        const restaurant_name = reqParams['restaurant_name'];
        const res_logo = file['buffer'];
        const restaurantExists = await checkRestaurant(restaurant_name);
        if (restaurantExists) {
            return { status: false, msg: 'Restaurant name already exists' };
        }
        const insertRec = { 'restaurant_name': restaurant_name, 'res_logo': res_logo, 'created_date': new Date(), 'status': 1 }
        const result = await dbQuery.addRecord('restaurants', insertRec)
        return { status: true, msg: 'Restaurant Created Successfull', inertId: result['inertId'] }
    } catch (error) {
        throw error
    }
}
exports.get = async (reqParams) => {
    try {
        const res_id = reqParams['res_id']
        const query = 'SELECT * FROM ?? WHERE res_id = ?'
        let qryData = ['restaurants',res_id]
        const result = await dbQuery.getDetails(query, qryData)
        if (result.length > 0) {
            result.forEach((obj) => {
                const imageData = obj['res_logo'];
                const base64Image = imageData.toString('base64');
                obj['res_logo'] = `data:image/png;base64,${base64Image}`;
            });
        }
        return { status: true, data: result[0] }
    } catch (error) {
        throw error
    }
}
exports.details = async (reqParams) => {
    try {
        const query = 'SELECT * FROM ??'
        let qryData = ['restaurants']
        const result = await dbQuery.getDetails(query, qryData)
        if (result.length > 0) {
            result.forEach((obj) => {
                const imageData = obj['res_logo'];
                const base64Image = imageData.toString('base64');
                obj['res_logo'] = `data:image/png;base64,${base64Image}`;
            });
        }
        return { status: true, data: result }
    } catch (error) {
        throw error
    }
}
async function checkRestaurant(restaurant_name) {
    const query = 'SELECT COUNT(*) AS count FROM ?? WHERE restaurant_name = ?'
    const count = await dbQuery.getDetails(query, ['restaurants', restaurant_name])
    return count[0]['count'] > 0
}