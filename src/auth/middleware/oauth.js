'use strict';

// Exchange the code received on the initial request for a token from the Provider
// Use the token to retrieve the user’s account information from the Provider
// Create/Retrieve an account from our Mongo users database matching the user’s account (email or username) using the users model
// Generate a token using the users model
// Add the token and the user record to the request object

const superagent = require('superagent');
const Users = require('../models/users-model.js');
require('dotenv').config();

// ----------   https://developer.github.com/apps/building-oauth-apps/

const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';
const API_SERVER = 'http://localhost:3000/oauth';
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

module.exports = async function authorize(req, res, next) {

  try{

    let codeOnRequest = req.query.code;
    console.log('------- (1) CODE:', codeOnRequest);

    let remoteAccessToken = await exchangeCodeForToken(codeOnRequest);
    console.log('------- (2) ACCESS TOKEN:', remoteAccessToken);

    let remoteUser = await getRemoteUserInfo(remoteAccessToken);
    console.log('------- (3) GITHUB USER:', remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('------- (4) LOCAL USER:', user);

    next();
  } catch (error) {
    next(`ERROR MESSAGE IN AUTHORIZE OAUTH MW: ${error.message}`);
  }
};

async function exchangeCodeForToken(code) {

  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(token) {

  let userResponse = 
    await superagent.get(remoteAPI)
      .set('user-agent', 'express-app')
      .set('Authorization', `token ${token}`);

  let user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {

  let userRecord = {
    username: remoteUser.login,
    password: 'passwordForOAuth',
    email: remoteUser.email,
    fullname: remoteUser.name,
    role: 'writer',
  };

  console.log('USERRECORD IN GETUSER FUNCTION:', userRecord);

  let user = await Users.createFromOauth(userRecord);
  console.log('-------- USER IN GETUSER, BEFORE GENERATE TOKEN', user);
  let token = user.generateToken();

  return [user, token];
}