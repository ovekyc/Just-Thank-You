const assert = require('assert');

function createUser(userName, email, firstName, lastName, profileUrl) {
  assert(userName, 'userName should be provided');
  assert(email, 'email should be provided');
  assert(firstName, 'firstName should be provided');
  assert(lastName, 'lastName should be provided');
  return {
    userName,
    email,
    firstName,
    lastName,
    profileUrl
  };
}

module.exports = createUser;