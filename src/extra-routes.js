'use strict';

const express = require('express');
const bearerAuthMW = require('../src/auth/middleware/bearer.js');
const router = express.Router();

router.get('/secret', bearerAuthMW, (req,res) => {
  res.status(200).send('access allowed');
});

module.exports = router;