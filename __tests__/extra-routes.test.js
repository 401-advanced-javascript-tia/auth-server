'use strict';

require('dotenv').config();

const { server } = require('../src/server.js');

const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

// DO WE HAVE TO RUN A SIGNIN/SIGNUP TEST FIRST FOR THE BELOW TO WORK? SINCE THERE IS NOTHING IN THE DB AT THE MOMENT TO FIND
it('should allow entry with good token', async () => {
  const response = await mockRequest.get('/secret').auth(process.env.TEST_TOKEN, {type: 'bearer'});
  expect(response.status).toBe(200);
});


it.skip('should NOT allow entry with bad token', async () => {

  const response = await mockRequest.get('/secret').auth('bad token', {type:'bearer'});
  
  // STRETCH: respond with more appropriate status
  expect(response.status).toBe(500);
});