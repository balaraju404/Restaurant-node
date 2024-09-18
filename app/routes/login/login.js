const routes = require("express").Router();
const loginController = require('../../controller/login/login')

routes.post('/check', async (req, res, next) => {
    try {
        await loginController.check(req, res, next);
    } catch (error) {
        console.error(error);
    }
})

module.exports = routes