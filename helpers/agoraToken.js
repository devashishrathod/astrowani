// const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

// // Your Agora App credentials
// const appId = process.env.AGORAAPPID;
// const appCertificate = process.env.AGORAAPPcertificate;

// const generateAgoraToken = (channelName, uid) => {
//   const role = RtcRole.PUBLISHER; 
//   const expirationTimeInSeconds = 3600; 
//   const currentTimestamp = Math.floor(Date.now() / 1000);
//   const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

//   const token = RtcTokenBuilder.buildTokenWithUid(
//     appId,
//     appCertificate,
//     channelName,
//     uid,
//     role,
//     privilegeExpireTime
//   );

//   return token;
// };

// module.exports = generateAgoraToken;

//================================================
// const { RtcTokenBuilder, RtcRole } = require("agora-token");


// const generateAgoraToken = (channelName, uid) => {
//   try {

//     // Your Agora App credentials
// const appId = process.env.AGORAAPPID;
// const appCertificate = process.env.AGORAAPPCERTIFICATE;
// console.log("appId",appId);
// console.log("appCertificate",appCertificate);

//     // Ensure required environment variables are present
//     if (!appId || !appCertificate) {
//       throw new Error("Agora App ID or Certificate is missing in environment variables.");
//     }

//      // Convert string uid to number if needed
//      const numericUid = typeof uid === 'string' ? parseInt(uid.replace(/\D/g, '')) : uid;
//      if (isNaN(numericUid)) {
//        throw new Error("Invalid UID format. Must be convertible to a number.");
//      }

//     const role = RtcRole.PUBLISHER; 
//     const expirationTimeInSeconds = 600; //
//     const currentTimestamp = Math.floor(Date.now() / 1000); 
//     const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;
// console.log("Role",role);
// console.log("expirationTimeInSeconds",expirationTimeInSeconds);
// console.log("currentTimestamp",currentTimestamp);
// console.log("privilegeExpireTime",privilegeExpireTime);

//     // Generate token
//     const token = RtcTokenBuilder.buildTokenWithUid(
//       appId,
//       appCertificate,
//       channelName,
//       numericUid,
//       role,
//       privilegeExpireTime
//     );
// console.log("Token",token);
//     return token;
//   } catch (error) {
//     console.error("Error generating Agora token:", error.message);
//     throw new Error("Failed to generate Agora token. Please check your configurations.");
//   }
// };

// module.exports = generateAgoraToken;
//==============================================
// const { RtcTokenBuilder, RtcRole } = require('agora-token');

// const generateAgoraToken = (channelName, uid) => {
//   try {
//     console.log(RtcRole);
    
//     const appId = process.env.AGORAAPPID?.trim();
//     const appCertificate = process.env.AGORAAPPCERTIFICATE?.trim();
    
//     if (!appId || !appCertificate) {
//       throw new Error("Agora App ID or Certificate is missing");
//     }

//     // const channelName = `channel${Date.now()}`;
//     // const uid = Math.floor(Math.random() * 899999) + 100000; // Between 100000-999999
    
//     // Token expires in 1 hour
//     const expirationTimeInSeconds = 600;
//     const currentTimestamp = Math.floor(Date.now() / 1000);
//     const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

//     // Build token with uid
//     const token = RtcTokenBuilder.buildTokenWithUid(
//       appId,
//       appCertificate,
//       channelName,
//       uid,
//       RtcRole.PUBLISHER,
//       privilegeExpiredTs
//     );

//     return token;
//   } catch (error) {
//     console.error("Token Generation Error:", error);
//     throw error;
//   }
// };

// module.exports = generateAgoraToken;

//==============================================
const RtcTokenBuilder2 = require('agora-token').RtcTokenBuilder;
const RtcRole = require('agora-token').RtcRole;

const generateAgoraToken = (channelName, uid) => {
  try {
    const appId = process.env.AGORAAPPID?.trim();
    const appCertificate = process.env.AGORAAPPCERTIFICATE?.trim();
    
    if (!appId || !appCertificate) {
      throw new Error("Agora App ID or Certificate is missing");
    }

    // Convert string uid to number if needed
    const numericUid = typeof uid === 'string' ? parseInt(uid) : uid;
    
    // Token configuration
    const tokenExpirationInSeconds = 3600; // 1 hour
    const joinChannelPrivilegeExpireInSeconds = 3600;
    const pubAudioPrivilegeExpireInSeconds = 3600;
    const pubVideoPrivilegeExpireInSeconds = 3600;
    const pubDataStreamPrivilegeExpireInSeconds = 3600;

    // Build token with uid and privileges
    const token = RtcTokenBuilder2.buildTokenWithUidAndPrivilege(
      appId,
      appCertificate,
      channelName,
      numericUid,
      tokenExpirationInSeconds,
      joinChannelPrivilegeExpireInSeconds,
      pubAudioPrivilegeExpireInSeconds,
      pubVideoPrivilegeExpireInSeconds,
      pubDataStreamPrivilegeExpireInSeconds
    );

    console.log('Token Generation Debug:', {
      channelName,
      uid: numericUid,
      tokenLength: token.length
    });

    return token;
  } catch (error) {
    console.error("Token Generation Error:", error);
    throw error;
  }
};

module.exports = generateAgoraToken;