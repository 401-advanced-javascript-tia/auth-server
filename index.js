'use strict';

const server = require('./src/server.js');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGOOSE = process.env.MONGODB_URI;

const mongooseOptions ={
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGOOSE, mongooseOptions);

server.start(process.env.PORT);
