'use strict';

// const SECRET = 'boomdiggy';

const jwt = require('jsonwebtoken');

const {server} = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');

require('dotenv').config();

const mockRequest = supergoose(server);

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} users`, () => {

      let id;

      it('can create one', async () => {

        const results = await mockRequest.post('/signup').send(users[userType]);

        // console.log('RESULTS IN CAN CREATE ONE TEST:', results.body);

        expect(results.body.newUser).toBeDefined();
        expect(results.body.token).toBeDefined();

        const token = jwt.verify(results.body.token, process.env.SECRET);

        // console.log('TOKEN IN CREAT ONE TEST:', token);

        id = token.id;

        expect(id).toBeDefined();

        expect(token.role).toBe(userType);

      });

      it('can signin with basic', async () => {

        const { username } = users[userType];
        const { password } = users[userType];

        const results = await mockRequest
          .post('/signin').auth(username, password);

        const token = jwt.verify(results.body.token, process.env.SECRET);

        expect(token.id).toEqual(id);

        expect(token.role).toBe(userType);

      });
    });
  });
});

