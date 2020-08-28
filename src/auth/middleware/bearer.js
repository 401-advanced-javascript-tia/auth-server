'use strict';

const Users = require('../models/users-model.js');

module.exports = async (req, res, next) => {


  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
    return;
  }

  let token = req.headers.authorization.split(' ').pop();

  // NOW WE HAVE A TOKEN

  // here we are catching errors from the user model
  // Users.authenticateToken(token)
  //   .then(validUser => {
  //     req.user = validUser;
  //     next();
  //   }).catch(err => next('Invalid Login'));

  try {

    const validUser = await Users.authenticateToken(token);

    req.user = validUser;

    next();
  
  } catch (err) {

    next('Invalid Login');
    
  }

};



