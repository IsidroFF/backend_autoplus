// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../../coches-9522d-firebase-adminsdk-w10gm-7016eec444.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = db;
