'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const router = require('./auth/router.js');
const extraRouter = require('./auth/extra-routes.js');
const error404 = require('./middleware/404.js');
const error500 = require('./middleware/500.js');

app.use(cors());
app.use(morgan('dev'));

app.use(express.static('./public'));
// the below steps in front of all requests, inspects it for body, parses as needed and includes it on the request. turns fragmented body into json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use(extraRouter);

app.use(error404);
app.use(error500);

module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  },
};
