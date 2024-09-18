const routes = require("express").Router();
const orderController = require('../../controller/order/order')

routes.post('/add', async (req, res, next) => {
    try {        
        await orderController.add(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.put('/update', async (req, res, next) => {
    try {        
        await orderController.update(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.delete('/delete/:trans_id', async (req, res, next) => {
    try {        
        await orderController.del(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/details', async (req, res, next) => {
    try {
        await orderController.details(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes