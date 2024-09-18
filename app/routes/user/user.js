const routes = require("express").Router();
const userController = require('../../controller/user/user')

routes.post('/create', async (req, res, next) => {
    try {
        await userController.create(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/getUsers', async (req, res, next) => {
    try {
        await userController.details(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes