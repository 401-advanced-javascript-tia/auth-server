'use strict';

// THIS WILL GET HOOKED UP THE WAY OUR OTHER MODELS GOT HOOKED UP

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  fullname: {type: String},
  role: {type: String, required: true, default: 'user', enum: ['admin', 'editor', 'writer', 'user']},
});

// username="tlow" password="PaSSwOr$" email="lowtia@gmail.com" fullname="tia low" role="writer"

// HOW TO MODIFY USER INSTANCE BEFORE SAVING??
// PASSWORD, WHEN IT MAKES IT INTO DATABASE, IS IN SAFE FORM. NO RAW PASSWORDS INTO DB.
// below is also called hashPassword sometimes (this.hashPassword)

users.pre('save', async function() {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// STATIC ATTACHMENT
// the definiton of the function is below, and its being called in basic.js in middleware
users.statics.authenticateBasic = async function (username, password) {

  let query = { username };
  // is the same as = {username:username}
  // hey collection, do you even have anyone by this username??
  // go look for this user query and then user coming back will either be the one they found, and if user doesnt exist then it will come back as null
  // return this.findOne(query)
  //   .then(user => user && user.comparePassword(password))
  // // the above, if user comes back truthy then compare the password
  //   .catch(console.error);


  const user = await this.findOne(query);
  return user && await user.comparePassword(password);

};

// its a .method becuase were talking about something tied to a particular user
users.methods.comparePassword = async function(plainPassword) {

  console.log('PLAIN PASSWORD IN COMPAREPASSWORD FUNCTION IN USERS-MODEL.JS:', plainPassword);

  const passwordMatch = await bcrypt.compare(plainPassword, this.password);
  return passwordMatch ? this : null;

};


users.methods.generateToken = function() {

  const payload = {
    username: this.username,
    id: this._id,
    role: this.role,
  };

  const token = jwt.sign(payload, process.env.SECRET);
  console.log('TOKEN IN GENERATETOKEN METHOD:', token);
  return token;
  // we're testing this by using the verify (jwt.verify) method 

};

users.statics.createFromOauth = async function(email) {

  if(!email){
    // throw new Error('Validation Error');
    return Promise.reject('Validation Error');
  }

  const query = {email};
  const user = await this.findOne(query);
  // return user ? user : null;

  if (user) {
    return user;
  } else {
    return this.create({username: email, password: 'none', email: email});
    // .create method does a save under the hood so it hits the save hook above on the way
  }
};


module.exports = mongoose.model('users', users);