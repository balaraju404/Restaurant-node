const loginModel = require('../../model/login/login')

exports.check = async (req, res, next) => {
    try {
        const reqParams = req['body'] || {}
        const result = await loginModel.check(reqParams);
        res.status(200).json({ status: result['status'], msg: result['msg'], data: result['data'] })
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}