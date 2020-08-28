'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const auth = require('../src/auth/middleware/bearer.js');

// to mock a file, require it in and mock it out
const Users = require('../src/auth/models/users-model.js');
jest.mock('../src/auth/models/users-model.js');

beforeEach(() => {
  Users.authenticateToken.mockReset();
});

it('should fail with missing headers', async () => {
  let req = {
    headers: {
      authorization: '',
    },
  };

  let res = {};

  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith('Invalid Login: Missing Headers');
});



// this one now fails because we've mocked out the function, overrode the actual behavior
// how to mock one function for one test, but want the actual stuff for the other ones??

it.skip('should fail with bad token', async () => {
  let req = {
    headers: {
      authorization: 'Bearer bad.token.surely',
    },
  };

  let res = {};

  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith('Invalid Login');
});


// do signup first so you get a token
// get route to the /secret route, provide the token
// dont need to access the test token, can use the one that comes back on req.body
// this is kind of an integration test becuase its testing router for /secret AND middleware


it('should carry on with good token', async () => {
 
  // what we're doing below is telling jest that where this function is called, we want to do this instead
  Users.authenticateToken.mockImplementation(() => {
    return {};
  });

  let req = {
    headers: {
      authorization: `Bearer ${process.env.TEST_TOKEN}`,
    },
  };

  let res = {};

  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith();
  expect(req.user).toBeDefined();
  expect(req.user).toEqual({});

});

// another approach - mock out the users.authenticate function 
// "stub it out"

it('should hit catch block', async () => {
 
  Users.authenticateToken.mockImplementation(() => {
    throw new Error('gotcha!');
  });


  let req = {
    headers: {
      authorization: `Bearer ${process.env.TEST_TOKEN}`,
    },
  };

  let res = {};

  let next = jest.fn();

  await auth(req, res, next);

  expect(next).toHaveBeenCalledWith('Invalid Login');


});
