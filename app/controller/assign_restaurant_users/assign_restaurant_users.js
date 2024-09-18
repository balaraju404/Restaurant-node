const resUsersModel = require('../../model/assign_restaurant_users/assign_restaurant_users')
exports.add = async (req, res, next) => {
    try {
        const reqParams = req['body'] || {}
        if (!reqParams['res_id']) {
            return res.status(400).json({ status: false, msg: 'Restaurant id is required.' })
        }
        if (!reqParams['user_id']) {
            return res.status(400).json({ status: false, msg: 'User id is required.' })
        }
        if (!reqParams['role_id']) {
            return res.status(400).json({ status: false, msg: 'Role id is required.' })
        }
        const result = await resUsersModel.add(reqParams);
        if (result['inertId']) {
            res.status(200).json({ status: result['status'], msg: result['msg'], inertId: result['insertId'] })
        } else {
            res.status(200).json({ status: result['status'], msg: result['msg'] })
        }
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}
exports.details = async (req, res, next) => {
    try {
        const reqParams = req['body'] || {}
        if (!reqParams['user_id']) {
            return res.status(400).json({ status: false, msg: 'User id is required.' })
        }
        const result = await resUsersModel.details(reqParams);
        if (result['data']) {
            res.status(200).json({ status: result['status'], data: result['data'] })
        } else {
            res.status(200).json({ status: result['status'], msg: result['msg'] })
        }
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}