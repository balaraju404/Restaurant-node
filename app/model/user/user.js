const dbQuery = require('../../db-conn/db-query');

exports.create = async (reqParams) => {
    try {
        const login_name = reqParams['login_name'];
        const user_name = reqParams['user_name'];
        const password = reqParams['password'];
        const role_id = reqParams['role_id'];
        const userExists = await checkUser(login_name);
        if (userExists) {
            return { status: false, msg: 'User already exists' };
        }
        const insertRec = { 'user_name': user_name, 'login_name': login_name, 'password': password, 'role_id': role_id, 'created_date': new Date() }
        const result = await dbQuery.addRecord('users', insertRec)
        return { status: true, msg: 'User Created Successfull', inertId: result['inertId'] }
    } catch (error) {
        throw error
    }
}
exports.details = async (reqParams) => {
    try {
        const login_name = reqParams['login_name'] || '';
        const user_name = reqParams['user_name'] || '';
        const role_id = reqParams['role_id'] || 0;
        let where = '';
        let qryData = ['users']
        if (login_name.length > 0) {
            where += ' AND login_name = ? '
            qryData.push(login_name)
        }
        const query = 'SELECT * FROM ?? WHERE 1=1 ' + where + 'ORDER BY login_name'
        const result = await dbQuery.getDetails(query, qryData)
        return { status: true, data: result }
    } catch (error) {
        throw error
    }
}
async function checkUser(login_name) {
    const query = 'SELECT COUNT(*) AS count FROM ?? WHERE login_name = ?'
    const count = await dbQuery.getDetails(query, ['users', login_name])
    return count[0]['count'] > 0
}