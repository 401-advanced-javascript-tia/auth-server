'use strict';

// this is middleware to protect the routes based on capabilities, make sure it's used where needed

// curried middleware- we take the desired the desired capability of the route and return the middleware function thats aware of it
// currying- when you get things kind of halfway setup. lets you do the wrk upfront when you can, and defer the remainder of the work when you need to

module.exports = (capability) => {

  // the fact that its returning something means its a higher order function
  // its currying (holding on to some of the information)
  return (req, res, next) => {

    console.log('REQ.USER IN ACL.JS-------', req.user);

    // We're expecting that previous middleware has put the user object on the request object
    // Given that, we can just inspect their capabilities.
    // Using a try/catch to avoid having to deeply check this object
    try {
      // req.user is coming from bearerauth, the MW that ran before and added it to the req object
      if (req.user.capabilities.includes(capability)) {
        next();
      }
      else {
        next('Access Denied');
      }
    } catch (e) {
      next('Invalid Login');
    }

  };

};
