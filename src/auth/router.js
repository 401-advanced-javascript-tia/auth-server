'use strict';

const express = require('express');
const router = express.Router();
const basicAuthMW = require('./middleware/basic.js');
const oauthMW = require('./middleware/oauth.js');
const bearerAuthMW = require('./middleware/bearer.js');
const usersModel = require('./models/users-model.js');


// ---------------- ROUTES -------------------
router.post('/signup', handleSignup);
router.post('/signin', basicAuthMW, handleSignin);
// basicAuthMW is middleware

router.get('/users', bearerAuthMW, getAllUsers);

// router.get('/users', getAllUsers);

// oauth is the mw that handles the handshaking, handleOAuth route that receives code from OAuth server
// the /oauth route is whats provided as the redirect to the oauth provider (github in this case)
router.get('/oauth', oauthMW, handleOAuth);



// ---------------- ROUTE HANDLERS ------------

async function handleSignup(req, res, next) {

  // console.log('BOOYAH IM IN HANDLESIGNUP!!!');

  const newUser = await usersModel.create(req.body);

  // console.log('REQ.BODY IN HANDLESIGNUP:', req.body);

  const token = newUser.generateToken();

  const responseBody = {
    token,
    newUser,
  };

  res.status(200).send(responseBody);

  // CAN PUT THE ABOVE IN A TRY CATCH BLOCK, TO ACCOUNT FOR ERROR

}


function handleSignin(req, res, next) {

  // the middleware does some things and its usually attached to the request (when the middleware function itself tells it to carry on)
  res.cookie('auth', req.token);
  res.set('token', req.token);

  
  
  res.status(200).send({
    token: req.token,
    user: req.user,
  });
 
  // no error checking needed, you would never make it here if you didnt get past the middleware (which has an error handler on that)

}

function getAllUsers(req, res, next) {
  // WE SHOULD ADD MIDDLEWARE TO THIS TO REQUIRE AUTHENTICATION SO THAT YOU CANT SEE THE USER LIST WITHOUT A VALID USERNAME AND PASSWORD

  // console.log('REQ OBJ IN GETALLUSERS:', req);

  usersModel.find({})
    .then(users => {
      res.status(200).send(users);
    }).catch(next);

}


function handleOAuth(req, res, next){
  res.status(200).send(`chyeahhhh you got that token!  ${req.token}`);
}


module.exports = router;
