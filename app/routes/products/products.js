const routes = require("express").Router();
const productsController = require('../../controller/products/products')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routes.post('/add',upload.array('images'), async (req, res, next) => {
    try {        
        await productsController.add(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/details', async (req, res, next) => {
    try {
        await productsController.details(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes