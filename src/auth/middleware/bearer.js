'use strict';

const Users = require('../models/users-model.js');

module.exports = async (req, res, next) => {


  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
    return;
  }

  let token = req.headers.authorization.split(' ').pop();

  try {

    const validUser = await Users.authenticateToken(token);

    console.log('VALIDUSER IN BEARER.JS:', validUser);

    req.user = validUser;

    next();
  
  } catch (err) {

    next('Invalid Login');
    
  }

};
