'use strict';

function errorHandler404 (req,res,next) {
  
  console.log('Unknown Route - 404 Error');
  res.status(404);
  res.send('Unknown Route - 404 Error');
  res.end();
  //do not call next because we want it to be the last thing that happens if all else goes wrong on routes

}

module.exports = errorHandler404;