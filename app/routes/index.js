const routes = require('express').Router();
const login = require('./login/login')
const user = require('./user/user')
const restaurant = require('./restaurant/restaurant')
const assign_restaurant_users = require('./assign_restaurant_users/assign_restaurant_users')
const categories = require('./categories/categories')
const res_categories = require('./res_categories/res_categories')
const products = require('./products/products')
const cart = require('./cart/cart')
const order = require('./order/order')

routes.use('/login', login)
routes.use('/user', user)
routes.use('/restaurant', restaurant)
routes.use('/assign_restaurant_users', assign_restaurant_users)
routes.use('/categories', categories)
routes.use('/res_categories', res_categories)
routes.use('/products', products)
routes.use('/cart', cart)
routes.use('/order', order)

module.exports = routes;
