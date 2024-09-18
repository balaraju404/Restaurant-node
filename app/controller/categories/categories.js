const categoriesModel = require('../../model/categories/categories')
exports.add = async (req, res, next) => {
    try {
        const reqParams = req['body'] || {}
        const image = req['file'] || {}        
        const result = await categoriesModel.add(reqParams, image);
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
        const result = await categoriesModel.details(reqParams);
        if (result['data']) {
            res.status(200).json({ status: result['status'], data: result['data'] })
        } else {
            res.status(200).json({ status: result['status'], msg: result['msg'] })
        }
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}