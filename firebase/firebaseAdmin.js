// firebase/firebaseAdmin.js
const admin = require("firebase-admin");
// const serviceAccount = require("../astrovendor-firebase-adminsdk.json");
// const serviceAccount = require("../astrologer-84809-firebase-adminsdk-h7fz2-f1f57884a0.json");

// Parse the credentials from the GOOGLE_CREDENTIALS environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
//====================================
// const admin = require("firebase-admin");

// // Load the appropriate service account file dynamically
// const loadServiceAccount = (role) => {
//   switch (role) {
//     case "customer":
//       return require("../ohmastrocustomer-firebase-adminsdk.json");
//     case "astrologer":
//       return require("../astrovendor-firebase-adminsdk.json");
//     default:
//       throw new Error("Invalid role for Firebase Admin initialization");
//   }
// };

// const initializeFirebaseAdmin = (role) => {
//   // Check if an app is already initialized
//   if (admin.apps.length === 0) {
//     const serviceAccount = loadServiceAccount(role);
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//   }
//   return admin;
// };

// module.exports = { initializeFirebaseAdmin };
//=============================================
// firebase/firebaseAdmin.js
// const admin = require('firebase-admin');

// const serviceAccounts = {
//   customer: require('../astrologer-firebase-adminsdk-com.ohmastro.json'),
//   astrologer: require('../astrologer-firebase-adminsdk-com.astroindia_astrologers.json')
// };

// const getFirebaseAdmin = (role = 'customer') => {
//   const appName = `app-${role}`;

//   // Return existing instance if already initialized
//   if (admin.apps.find(app => app.name === appName)) {
//     return admin.app(appName);
//   }

//   return admin.initializeApp({
//     credential: admin.credential.cert(serviceAccounts[role])
//   }, appName);
// };

// module.exports = { getFirebaseAdmin };

//============================================================
// const admin = require("firebase-admin");

// // Load service account files
// const userServiceAccount = require("../astrologer-firebase-adminsdk-com.ohmastro.json");
// const vendorServiceAccount = require("../astrologer-firebase-adminsdk-com.astroindia_astrologers.json");

// // Initialize Firebase Admin for Users
// const firebaseUserApp = admin.initializeApp(
//   {
//     credential: admin.credential.cert(userServiceAccount),
//   },
//   "userApp" // Custom app name for users
// );

// // Initialize Firebase Admin for Vendors
// const firebaseVendorApp = admin.initializeApp(
//   {
//     credential: admin.credential.cert(vendorServiceAccount),
//   },
//   "vendorApp" // Custom app name for vendors
// );

// Load service account files
// const userServiceAccount = require("../astrovendor-61cab-firebase-adminsdk-g3v8i-c00593c276.json");
// const vendorServiceAccount = require("../astrovendor-61cab-firebase-adminsdk-g3v8i-c00593c276.json");

// // Initialize Firebase Admin for Users
// const firebaseUserApp = admin.initializeApp({
//   credential: admin.credential.cert(userServiceAccount)
//   // projectId: userServiceAccount.project_id,
//   // databaseURL: `https://${userServiceAccount.project_id}.firebaseio.com`
// }, "userApp");

// // Initialize Firebase Admin for Vendors
// const firebaseVendorApp = admin.initializeApp({
//   credential: admin.credential.cert(vendorServiceAccount)
//   // projectId: vendorServiceAccount.project_id,
//   // databaseURL: `https://${vendorServiceAccount.project_id}.firebaseio.com`
// }, "vendorApp");

// // Export both instances for use in the server
// module.exports = {
//   firebaseUserApp,
//   firebaseVendorApp,
// };
