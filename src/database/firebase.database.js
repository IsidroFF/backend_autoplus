// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("../../coches-9522d-firebase-adminsdk-w10gm-7016eec444.json");
require('dotenv').config()

const BUCKET = process.env.BUCKET

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
  db, auth, storage
};
