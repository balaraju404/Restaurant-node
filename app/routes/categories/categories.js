const routes = require("express").Router();
const categoriesController = require('../../controller/categories/categories')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routes.post('/add', upload.single('cat_img'), async (req, res, next) => {
    try {        
        await categoriesController.add(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/details', async (req, res, next) => {
    try {
        await categoriesController.details(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes