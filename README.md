# Auth-Server
Code 401 Lab 11-14 Project

**Description**
Four-day build out of an authentication server. Utilizes basic authentication, bearer, oauth 2.0, and Access Control List. 

## Author
Tia Low

### About
Full-stack JavaScript developer with a diverse background of personal and professional experience.

## Collaborations and Resources
- Joshua Beasley : [GitHub](https://github.com/beasleyDOTcom)
- Alex Whan: [GitHub](https://github.com/alex-whan)
- Joe Zabaleta: [GitHub](https://github.com/joseph-zabaleta)

## Version
1.5.1

## ENV SAMPLES
- PORT=
- MONGODB_URI=
- SECRET=
- GITHUB_CLIENT_ID=
- GITHUB_CLIENT_SECRET=
- TEST_TOKEN= (for testing purposes)

## Domain Modeling
- MongoDB name: users
- Phase 4 MongoDB: auth-server

## Daily Log
Monday : 8-24-20 : **Phase 1** : **Basic Authentication**
- Create a basic server with the following features:
  - Users Model (Mongoose Schema)
  - /signup route that creates a user
  - /signin route that attempts to log a user in
  - BasicAuth middleware that validates the user as part of the /signin process
  - Return a JSON Web Token on valid sign in attempts

Tuesday : 8-25-20 : **Phase 2** : **OAuth**
- Complete the full OAuth handshaking process
- Create or validate a local user account matching the remote user id
- Return a JSON Web Token on valid sign in attempts

Wednesday : 8-26-20 : **Phase 2 cont.**

Thursday : 8-27-20 : **Phase 3** : **Bearer Authentication**
- Re-Authenticate Users
- Accepts a TOKEN in the **Authorization: Bearer** header
- Validates the user
- Allows or Denies access to the route handler

Friday : 8-28-20 : **Phase 4** : **Authorization**
- CHANGED MONGODB_URI TO /AUTH-SERVER (FROM USERS)
- Implement a Role Based Authorization System
- Combine the Bearer Token with User roles to give fine grained access control

<!-- ### Swagger Hub Documentation
https://app.swaggerhub.com/apis/TiaLow/online-store/0.1#/info -->

### UML Diagram
**Phase 1**![UML Diagram](./img/UML3.png)
**Phase 2**![OAuth UML Diagram](./img/OAuth-UML.jpg)
**Phase 3 / 4**![Bearer Token & ACL UML Diagram](./img/BT-ACL-UML.jpg)

