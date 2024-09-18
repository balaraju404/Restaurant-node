const path = require('path');
require("dotenv").config();

global.PORT = process.env.PORT;
global.HOST = process.env.HOST;
global.USER = process.env.USER;
global.DB_NAME = process.env.DB_NAME;