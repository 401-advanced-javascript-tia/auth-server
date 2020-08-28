'use strict';

const base64 = require('base-64');

const Users = require('../models/users-model.js');

module.exports = async (req, res, next) => {

  // req.headers.authorization should be : "Basic sdkjdsljd="

  const errorObj = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};

  if (!req.headers.authorization) { 
    next(errorObj); 
    return; 
  }


  // Pull out just the encoded part by splitting the header into an array on the space and popping off the 2nd element
  // basic authentication, but is part of the authorization header
  // always comes back as Basic with a space, so we have to split it and then pop the end off which is the base64 part, what we end up with is basic encoded string
  let encodedPair = req.headers.authorization.split(' ').pop();

  // decodes to user:pass and splits it to an array
  // below is array destructuring (we've seen object destructuring)
  let [user, pass] = base64.decode(encodedPair).split(':');

  console.log('USER IN BASIC.JS:', user);
  console.log('PASS IN BASIC.JS:', pass);

  try{
    const validUser = await Users.authenticateBasic(user, pass);

    console.log('VALIDUSER IN BASIC.JS:', validUser);
    
    req.token = validUser.generateToken();
    // req.token = Users.generateToken(validUser);
    req.user = user;
    next();
  } catch(err) {
    next(errorObj);
  }


};
