const express = require('express');
const Router = express.Router();

Router.get('/', (req, res, next) => {res.send('Result')});

module.exports = Router;
