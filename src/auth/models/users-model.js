'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const SINGLE_USE_TOKENS = false;// !!process.env.SINGLE_USE_TOKENS;
// const TOKEN_EXPIRE = process.env.TOKEN_EXPIRE || '60m';
// const SECRET = process.env.SECRET || 'supersecret';

// const usedTokens = new Set();

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  fullname: {type: String},
  email: {type: String, unique: true},
  role: {type: String, required: true, default: 'user', enum: ['admin', 'editor', 'writer', 'user']},
  capabilities: { type: Array, required: true, default: [] },
});

// THE BELOW MODIFIES THE INSTANCE BEFORE IT'S SAVED
// PASSWORD, WHEN IT MAKES IT INTO DATABASE, IS IN SAFE FORM. NO RAW PASSWORDS INTO DB.
// below is also called hashPassword sometimes (this.hashPassword)

users.pre('save', async function() {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }

  let role = this.role; // tthis is where we would adjust if we want to test this out

  // REMOVE THIS FROM LIVE SYSTEM ONCE IVE TESTED!
  // role = 'admin';



  if(this.isModified('role')) {

    switch(role) {
    case 'admin':
      this.capabilities = ['create', 'read', 'update', 'delete'];
      break;
    case 'editor':
      this.capabilities = ['create', 'read', 'update'];
      break;
    case 'writer':
      this.capabilities = ['create', 'read'];
      break;
    case 'user':
      this.capabilities = ['read'];
      break;
    }
  }

});

// STATIC ATTACHMENT
// the definiton of the function is below, and its being called in basic.js in middleware
users.statics.authenticateBasic = async function (username, password) {

  // is the same as = {username:username}
  // hey collection, do you even have anyone by this username??
  // go look for this user query and then user coming back will either be the one they found, and if user doesnt exist then it will come back as null
  
  // let query = { username };
  // return this.findOne(query)
  //   .then(user => {
  //     return user && user.comparePassword(password);
  //   }).catch(error => {
  //     throw new Error('Error in authenticateBasic static method');
  //   })


  let query = { username };
  const user = await this.findOne(query);
  try {
    return user && await user.comparePassword(password);
  } catch (err){
    throw new Error('Error in authenticateBasic static method:', err);
  }

};

// its a .method becuase were talking about something tied to a particular user
users.methods.comparePassword = async function(plainPassword) {

  console.log('PLAIN PASSWORD IN COMPAREPASSWORD FUNCTION IN USERS-MODEL.JS:', plainPassword);

  const passwordMatch = await bcrypt.compare(plainPassword, this.password);
  return passwordMatch ? this : null;

};


users.methods.generateToken = function() {

  const payload = {
    id: this._id,
    role: this.role,
    capabilities: this.capabilities,
    // username: this.username,
    // id: this._id,
    // role: this.role,
  };

  
  // if we're using "TYPE" below we need to pass type into the function as a parameter
  // Additional security measures
  // let options = {};
  // if(type !== 'key' && !!TOKEN_EXPIRE) {
  //   options = { expiresIn: TOKEN_EXPIRE};
  // }
  
  const token = jwt.sign(payload, process.env.SECRET);
  // const token = jwt.sign(payload, process.env.SECRET, options);

  console.log('TOKEN IN GENERATETOKEN METHOD:', token);

  return token;
  // we're testing this by using the verify (jwt.verify) method 

};



users.statics.authenticateToken = async function(token) {

  // /* Additional Security Measure */
  // if (usedTokens.has(token)) {
  //   console.log('unique fail');
  //   return Promise.reject('Invalid Token');
  // }

  let parsedToken = jwt.verify(token, process.env.SECRET);

  //  /* Additional Security Measure */
  //  (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);

  console.log('TOKEN OBJ IN AUTHENTICATE TOKEN:', parsedToken);

  const foundUser = await this.findById(parsedToken.id);
  // return this.findById(parsedToken.id);

  console.log('FOUNDUSER IN AUTHENTICATE TOKEN:', foundUser);

  if(foundUser){
    return foundUser;
  } else {
    throw new Error('User not found');
  }
  
};



users.statics.createFromOauth = async function(userRecordObj) {

  if(!userRecordObj){
    return Promise.reject('Validation Error');
  }

  // you should be querying by something that is definitely unique (this is put in your schema as unique: true)
  const query = {username: userRecordObj.username};
  const user = await this.findOne(query);

  // NEED TO ALSO SAY IF(!USER){THROW NER ERROR('USER NOT FOUND)}

  try {
    if(!user) {
      throw new Error('User Not Found');
    } else {
      console.log('Welcome Back ', user.username);
      return user;
    }
  } catch (e) {
    console.log('Creating new user');
    let username = userRecordObj.username;
    let password = 'none';
    let role = 'user';
    return this.create({username, password, role});
  }
};

users.methods.generateKey = function () {
  return this.generateToken('key');
};



module.exports = mongoose.model('users', users);