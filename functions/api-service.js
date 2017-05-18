const admin = require('firebase-admin');
const createUser = require('./models/user');
const APIError = require('./util/api-error');

const APIService = {
  signUp: function (req, res) {
    var user;
    try {   // create user
      user = new createUser(
        req.body.userName ? req.body.userName : null,
        req.body.email ? req.body.email : null,
        req.body.firstName ? req.body.firstName : null,
        req.body.lastName ? req.body.lastName : null,
        req.body.profileUrl);
    } catch (err) {
      res.status(400).send(err.message);
      return;
    }

    // store user into database
    new Promise ((resolve, reject) =>
      admin.database()
        .ref('/emails/' + user.email)
        .transaction(exist => {
          if (exist) return;
          return admin.database().ref() + 'users/' + user.userName;
        }, (err, committed) => {
          if (err) reject(new APIError('[Error] Fail to store email'));
          else if (!committed) reject(new APIError('Email address already exists', 400));
          else resolve();
        }))
      .then(() => new Promise((resolve, reject) =>
        admin.database()
        .ref('/users/' + user.userName)
        .transaction(exist => {
          if (exist) return;
          return user;
        }, (err, committed) => {
          if (err) {
            admin.database().ref('/emails/' + user.email).remove(); // revert
            reject(new APIError('[Error] Fail to store user'));
          }
          else if (!committed) {
            admin.database().ref('/emails/' + user.email).remove(); // revert
            reject(new APIError('Username already exists', 400));
          }
          else resolve(user);
        })))
      .then(user => res.status(200).send(user))
      .catch(err => {
        const statusCode = err.statusCode ? err.statusCode : 500;
        res.status(statusCode).send(err.message);
      });
  }
};

module.exports = APIService;
