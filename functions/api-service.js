const admin = require('firebase-admin');
const createUser = require('./models/user');
const APIError = require('./util/api-error');
const config = require('./config/google-cloud.json');
const gcs = require('@google-cloud/storage')(config);
const stream = require('stream');

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

    admin.auth().createUser({
      email: user.email,
      emailVerified: false,
      password: "secretPassword",
      displayName: user.firstName + ' ' + user.lastName,
      photoURL: user.profileUrl,
      disabled: false,
    })
      .then(userRecord => new Promise((resolve, reject) =>
        admin.database()
          .ref('/users/' + user.userName)
          .transaction(exist => {
            if (exist) return;
            return user;
          }, (err, committed) => {
            if (err) {
              admin.auth().deleteUser(userRecord.uid);
              reject(new APIError('[Error] Fail to store user'));
              return;
            } else if (!committed) {
              admin.auth().deleteUser(userRecord.uid);
              reject(new APIError('Username already exists', 400));
              return;
            }
            resolve();
          })))
      .then(() => res.status(200).send(user))
      .catch(err => {
        const statusCode = err.statusCode ? err.statusCode : 500;
        res.status(statusCode).send(err.message)
      });
  },

  uploadProfile(req, res) {
    const bucket = gcs.bucket(config.bucket);
    const username = req.body.username;
    const base64Image = req.body.image;

    var buf = new stream.PassThrough();
    buf.end(Buffer.from(base64Image, 'base64'));

    const file = bucket.file('/photos/profile/' + username + '.jpg');
    buf
      .pipe(file.createWriteStream())
      .on('error', err => {
        res.status(500).send(err.message);
      })
      .on('finish', () => {
        res.status(200).send('Profile image was uploaded');
      });
  }
};

module.exports = APIService;
