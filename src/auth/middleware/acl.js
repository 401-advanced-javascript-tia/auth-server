'use strict';

// this is middleware to protect the routes based on capabilities, make sure it's used where needed

// curried middleware- we take the desired the desired capability of the route and return the middleware function thats aware of it