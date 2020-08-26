'use strict';

function errorHandler500 (req,res,next) {
  
  console.log('Server Error - 500');
  res.status(500);
  res.send('Server Error - 500');
  res.end();
  //do not call next because we want it to be the last thing that happens if all else goes wrong 

}

module.exports = errorHandler500;