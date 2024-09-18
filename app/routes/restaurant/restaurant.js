const routes = require("express").Router();
const restaurantController = require('../../controller/restaurant/restaurant')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routes.post('/create',upload.single('res_logo'), async (req, res, next) => {
    try {        
        await restaurantController.create(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/getAll', async (req, res, next) => {
    try {
        await restaurantController.details(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/:res_id', async (req, res, next) => {
    try {
        await restaurantController.get(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes