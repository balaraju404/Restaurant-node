const routes = require("express").Router();
const resCategoriesController = require('../../controller/res_categories/res_categories')
const multer = require('multer');

routes.post('/add', async (req, res, next) => {
    try {        
        await resCategoriesController.add(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/details', async (req, res, next) => {
    try {
        await resCategoriesController.details(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes