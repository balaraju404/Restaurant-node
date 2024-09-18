const routes = require("express").Router();
const resUsersController = require('../../controller/assign_restaurant_users/assign_restaurant_users')

routes.post('/add', async (req, res, next) => {
    try {
        await resUsersController.add(req, res, next);
    } catch (error) {
        console.error(error);
    }
})
routes.post('/details', async (req, res, next) => {
    try {
        await resUsersController.details(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes