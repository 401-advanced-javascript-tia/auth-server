'use strict';

// const SECRET = 'boomdiggy';

const jwt = require('jsonwebtoken');

const {server} = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
// const { describe } = require('yargs');
// const { italic } = require('chalk');
require('dotenv').config();

const mockRequest = supergoose(server);


describe('user signup/signin', () => {


  it('can signup', async () => {

    const userData = { username: 'admin', password: 'password', email: 'admin@admin.com', fullname: 'susan mcsuserson', role: 'admin' };

    const results = await mockRequest.post('/signup').send(userData);

    expect(results.statusCode).toBe(200);

  });

  it('can signin with basic', async () => {

    const userData = { username: 'joey', password: 'password', email: 'admin@admin.com', role: 'admin' };

    await mockRequest.post('/signup').send(userData);

    const results = await mockRequest.post('/signin').auth('joey', 'password');

    const parsedToken = JSON.parse(results.text).token;

    const token = jwt.verify(parsedToken, process.env.SECRET);

    expect(token).toBeDefined();

  });


  
  it('can fail signin with bad password', async () => {

    const userData = { username: 'joey', password: 'password', role: 'admin', email: 'admin@admin.com' };

    await mockRequest.post('/signup').send(userData);

    const results = await mockRequest.post('/signin').auth('joey', 'badpassword');

    expect(results.statusCode).toBe(500);

  });

  //passing
  it('can fail signin with unknown user', async () => {

    const userData = { username: 'joey', password: 'password', role: 'admin', email: 'admin@admin.com' };

    await mockRequest.post('/signup').send(userData);

    const results = await mockRequest.post('/signin').auth('nobody', 'password');

    expect(results.statusCode).toBe(500);

  });




});


