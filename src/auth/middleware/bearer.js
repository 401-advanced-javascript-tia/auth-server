'use strict';

const Users = require('../models/users-model.js');

module.exports = async (req, res, next) => {


  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
    return;
  }

  // here we're pulling out the encoded part by splitting the header into an array on the space, and then popping off the second element
  let token = req.headers.authorization.split(' ').pop();

  try {

    const validUser = await Users.authenticateToken(token);

    console.log('VALIDUSER IN BEARER.JS:', validUser);

    req.user = validUser;

    // adding key value of capabilities, so bearer auth now has a notion of capabilities
    req.user = {
      username: validUser.username,
      fullname: validUser.fullname,
      email: validUser.email,
      capabilities: validUser.capabilities,
    };

    next();
  
  } catch (err) {

    next('Invalid Login');
    
  }

};
