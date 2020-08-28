'use strict';

const express = require('express');
const bearerTokenMW = require('./middleware/bearer.js');
const router = express.Router();

router.get('/secret', bearerTokenMW, (req,res) => {
  res.status(200).send('access allowed');
});

module.exports = router;