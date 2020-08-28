'use strict';

require('@code-fellows/supergoose');
// require('./supergoose.test.js');
const auth = require('../src/auth/middleware/basic.js');
const Users = require('../src/auth/models/users-model.js');
process.env.SECRET = 'superSecretStuff';

beforeAll(async () => {
  const adminUserData = { username: 'admin', password: 'password', email: 'admin@admin.com', fullname: 'susan mcsuserson', role: 'admin' };

  await Users(adminUserData).save();
});

describe('user authentication', () => {

  let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};

  it('fails a login for a user (admin) with the incorrect basic credentials', async () => {

    // admin:foo: YWRtaW46Zm9v

    let req = {
      headers: {
        authorization: 'Basic YWRtaW46Zm9v',
      },
    };

    let res = {};

    let next = jest.fn();

    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith(errorObject);

  });

  it('logs in an admin user with the right credentials', async () => {

    // admin:password: YWRtaW46cGFzc3dvcmQ=

    let req = {
      headers: {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      },
    };

    let res = {};

    let next = jest.fn();

    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith();

  });

});



// describe('Auth Middleware', () => {

//   // let errorObject = {'message': 'Invalid User ID/Password', 'status': 401, 'statusMessage': 'Unauthorized'};

//   describe('user authentication', () => {

//     // -----------------------------------------------------------------
//     //  THESE TESTS PASS ONLY WHEN THEY'RE BEING RUN INDIVIDUALLY
//     // -----------------------------------------------------------------


//     it('fails a login for a user (admin) with the incorrect basic credentials', async () => {

//       let req = {
//         headers: {
//           authorization: 'Basic YWRtaW46Zm9v',
//         },
//       };

//       let res = {};
//       let next = jest.fn();

//       await auth(req, res, next);

//       expect(next).toHaveBeenCalledWith('Invalid Login');

//     });

    
//     it('logs in an admin user with the right credentials', async () => {

//       let req = {
//         headers: {
//           authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
//         },
//       };
//       let res = {};
//       let next = jest.fn();

//       await auth(req,res,next);

//       expect(next).toHaveBeenCalledWith();

//     });

//   });

// });
