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
users.statics.authenticateBasic = function (username, password) {

  let query = { username };
  // is the same as = {username:username}
  // hey collection, do you even have anyone by this username??
  // go look for this user query and then user coming back will either be the one they found, and if user doesnt exist then it will come back as null
  return this.findOne(query)
    .then(user => user && user.comparePassword(password))
  // the above, if user comes back truthy then compare the password
    .catch(console.error);

};

// its a .method becuase were talking about something tied to a particular user
users.methods.comparePassword = function(plainPassword) {

  console.log('PLAIN PASSWORD IN COMPAREPASSWORD FUNCTION IN USERS-MODEL', plainPassword);
  
  return bcrypt.compare(plainPassword, this.password)
    .then(validBoolean => validBoolean? this : null)
    .catch(console.error);
};

// STATIC METHOD, BUT IT TAKES IN THE ARGUMENT FOR ONE USER 
users.statics.generateToken = function(user) {

  let token = jwt.sign({ username: user.username }, process.env.SECRET);
  return token;

};


module.exports = mongoose.model('users', users);