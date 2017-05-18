const functions = require('firebase-functions');
const admin = require('firebase-admin');
const APIService = require('./api-service');

admin.initializeApp(functions.config().firebase);

exports.signUp = functions.https.onRequest((req, res) => {
  if (req.method.toUpperCase() === 'POST') {
    APIService.signUp(req, res);
    return;
  }
  res.status(405).send('Method not allowed');
});