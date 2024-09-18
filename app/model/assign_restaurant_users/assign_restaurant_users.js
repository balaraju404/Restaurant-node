const dbQuery = require('../../db-conn/db-query');

exports.add = async (reqParams) => {
    try {
        const res_id = reqParams['res_id'] || 0;
        const user_id = reqParams['user_id'] || 0;
        const role_id = reqParams['role_id'] || 0
        const recordExists = await checkRecord(reqParams);
        if (recordExists) {
            return { status: false, msg: 'Record already exists' };
        }
        const insertRec = { 'res_id': res_id, 'user_id': user_id, 'role_id': role_id, 'created_date': new Date(), 'status': 1 }
        const result = await dbQuery.addRecord('restaurant_users', insertRec)
        return { status: true, msg: 'User Assigned To Restaurant', inertId: result['inertId'] }
    } catch (error) {
        throw error
    }
}
exports.details = async (reqParams) => {
    try {
        let whr = ''
        let qryData = ['restaurant_users', 'restaurants', 'login_roles']
        if (reqParams['user_id']) {
            whr += ' AND ru.user_id = ? ';
            qryData.push(reqParams['user_id']);
        }
        const query = 'SELECT ru.id, ru.user_id, ru.res_id, r.restaurant_name, r.res_logo, ru.role_id, lr.login_role_name as role_name \
            FROM ?? AS ru \
            INNER JOIN ?? AS r ON ru.res_id=r.res_id \
            INNER JOIN ?? AS lr ON ru.role_id=lr.login_role_id \
            WHERE 1=1 '+ whr
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
async function checkRecord(reqParams) {
    const res_id = reqParams['res_id'];
    const user_id = reqParams['user_id'];
    const role_id = reqParams['role_id'];
    const query = 'SELECT COUNT(*) AS count FROM ?? WHERE res_id = ? AND user_id = ? AND role_id = ?'
    const count = await dbQuery.getDetails(query, ['restaurant_users', res_id, user_id, role_id])
    return count[0]['count'] > 0
}