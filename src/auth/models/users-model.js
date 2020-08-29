'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, unique: true},
  fullname: {type: String},
  role: {type: String, required: true, default: 'user', enum: ['admin', 'editor', 'writer', 'user']},
});

// username="tlow" password="PaSSwOr$" email="lowtia@gmail.com" fullname="tia low" role="writer"

// THE BELOW MODIFIES THE INSTANCE BEFORE IT'S SAVED
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


  // THE BELOW IS HOW WE WOULD PUT EXTRA SECURITY MEASURES IN!!!!
  // let options = {};
  // return jwt.sign(payload, process.env.SECRET, options);
  //       |
  // if(SINGLE_USE_TOKENS){
  //   usedTokens.add(token);
  // }


  console.log('TOKEN IN GENERATETOKEN METHOD:', token);
  return token;
  // we're testing this by using the verify (jwt.verify) method 

};



users.statics.authenticateToken = async function(token) {

  let parsedToken = jwt.verify(token, process.env.SECRET);

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
  if (user) {
    return user;
  } else {
    return this.create({username: userRecordObj.username, password: 'none', email: userRecordObj.email});
    // .create method does a save under the hood so it hits the save hook above on the way
  }
};


module.exports = mongoose.model('users', users);