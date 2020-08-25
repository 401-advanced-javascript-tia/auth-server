'use strict';

const express = require('express');
const router = express.Router();
const basicAuth = require('./middleware/basic.js');
const usersModel = require('./models/users-model.js');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');


// ---------------- ROUTES -------------------
router.post('/signup', handleSignup);
router.post('/signin', basicAuth, handleSignin);
// basicAuth is middleware
router.get('/users', getAllUsers);



// ---------------- ROUTE HANDLERS ------------

function handleSignup(req, res, next) {
// create new User
// save it, create new record in Mongo db
// response to send status code 200

  console.log('IM IN HANDLESIGNUP!!!');

  const newUser = new usersModel();

  console.log('REQ.BODY IN HANDLESIGNUP:', req.body);


  newUser.save(req.body)
    .then(user => {
      console.log('USER IN .THEN IN HANDLESIGNUP:', user);
      res.status(200).send('Successful save.');
    }).catch(next);

}


function handleSignin(req, res, next) {

  // the middleware does some things and its usually attached to the request (when the middleware function itself tells it to carry on)
  res.cookie('auth', req.token);
  
  res.send({
    token: req.token,
    user: req.user,
  });
  // res.send(req.token);

  // no error checking needed, you would never make it here if you didnt get past the middleware (which has an error handler on that)

}

function getAllUsers(req, res, next) {
  // WE SHOULD ADD MIDDLEWARE TO THIS TO REQUIRE AUTHENTICATION S THAT YOU CANT SEE THE USER LIST WITHOUT A VALID USERNAME AND PASSWORD

  // console.log('REQ OBJ IN GETALLUSERS:', req);

  // i think the below will find all the users in the db?
  usersModel.find({})
    .then(users => {
      res.status(200).json(users);
    }).catch(next);

}


module.exports = router;
