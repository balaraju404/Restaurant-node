const dbQuery = require('../../db-conn/db-query');

exports.check = async (reqParams) => {
    try {
        const login_name = reqParams['login_name'];
        const login_password = reqParams['login_password'];
        const query = 'SELECT * FROM ?? WHERE login_name = ? '
        const qryData = ['users', login_name]
        const result = await dbQuery.getDetails(query, qryData)

        if (result.length > 0) {
            if (login_password == result[0]['password']) {
                if (result[0]['status'] == 0) {
                    return { status: false, msg: 'User is inactive', data: {} }
                }
                delete result[0]['password']
                return { status: true, msg: 'Login Successfull', data: result[0] }
            } else {
                return { status: false, msg: 'Invalid Password', data: {} }
            }
        } else {
            return { status: false, msg: 'Invalid Login Name', data: {} }
        }
    } catch (error) {
        throw error
    }
}