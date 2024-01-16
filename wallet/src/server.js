require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userController = require('./controllers/user.controller');
const {
  authenticateIpWhitelist,
} = require('./middlewares/ip-whitelist.middleware');


const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.post('/api/v1/user', authenticateIpWhitelist, userController.create);

app.get('/api/v1/user/:uid_auth0', userController.show);

module.exports = app;
