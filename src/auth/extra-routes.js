'use strict';

const express = require('express');
const bearerAuthMW = require('./middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');
const router = express.Router();

// router.get('/secret', bearerAuthMW, (req,res) => {
//   res.status(200).send('access allowed');
// });

router.get('/public', routeHandler);
router.get('/private', bearerAuthMW, routeHandler);
// permissions below is where we're invoking it, and it will work only if the return value from permissions function is a middleware. we're "pre-loading" the mw, we're looking if someone has the permission to "read" and then if so they can get to the next thing, the route handler which tells them access granted
router.get('/readonly', bearerAuthMW, permissions('read'), routeHandler);
// we want a middleware that looks for if someone has the permission to create
router.post('/create', bearerAuthMW, permissions('create'), routeHandler);
router.put('/update', bearerAuthMW, permissions('update'), routeHandler);
router.delete('/delete', bearerAuthMW, permissions('delete'), routeHandler);

// the below function is simple becuase this lab is about the capability of protecting routes, not necessarily about what happens when you get there. but there may be different functions on each route above to specify what does happen when someone gets to each specific capability
function routeHandler(req, res) {
  console.log('MADE IT INTO ROUTEHANDLER!!!!');
  res.status(200).send('Access Granted');
}


module.exports = router;
  