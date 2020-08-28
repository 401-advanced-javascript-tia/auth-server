'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./auth/router.js');
const error404 = require('./middleware/404.js');
const error500 = require('./middleware/500.js');


//DO WE WANT THIS IN PUBLIC FOLDER? INDEX.HTML IN PUBLIC FOLDER 
app.use(express.static('./public'));


// the below steps in front of all requests, inspects it for body, parses as needed and includes it on the request. turns fragmented body into json format
app.use(express.json());


// DO WE NEED '/' IN HERE?
app.use(routes);


app.use('*', error404);
app.use(error500);




module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  },
};
