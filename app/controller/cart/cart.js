const cartModel = require('../../model/cart/cart')
exports.add = async (req, res, next) => {
    try {
        const reqParams = req['body'] || {}
        const result = await cartModel.add(reqParams);
        if (result['inertId']) {
            res.status(200).json({ status: result['status'], msg: result['msg'], inertId: result['insertId'] })
        } else {
            res.status(200).json({ status: result['status'], msg: result['msg'] })
        }
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}
exports.update = async (req, res, next) => {
    try {
        const reqParams = req['body'] || {}
        const result = await cartModel.update(reqParams);
        res.status(200).json({ status: result['status'], msg: result['msg'] });
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}
exports.del = async (req, res, next) => {
    try {
        const reqParams = req['params'] || {}
        const result = await cartModel.del(reqParams);
        res.status(200).json({ status: result['status'], msg: result['msg'] });
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}
exports.details = async (req, res, next) => {
    try {
        const reqParams = req['body'] || {}
        const result = await cartModel.details(reqParams);
        if (result['data']) {
            res.status(200).json({ status: result['status'], data: result['data'] })
        } else {
            res.status(200).json({ status: result['status'], msg: result['msg'] })
        }
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Internal server error', error: error })
    }
}