/// ////////////////////////////////////////////////////
//
// This file contans utility functions to initiate RestAPI Calls
//
/// //////////////////////////////////////////////////

const btoa = require("btoa");
const https = require("https");
require("dotenv").config();
const log = require("../utils/logger/logger").logger;

const logger = log.getLogger("AppApi");
const vcxutil = {};
// console.log(" ===================================== vxutil ========================================");

// Function: To create basic authentication header using APP ID and APP KEY
vcxutil.getBasicAuthToken = () => btoa(`${process.env.ENABLEX_APP_ID}:${process.env.ENABLEX_APP_KEY}`);


vcxutil.connectServer = (options, data, callback) => {
  // console.log(" ============================= connect server =============================");

  logger.info(`REQ URI:- ${options.method} ${options.host}:${options.port}${options.path}`);
  logger.info(`REQ PARAM:- ${data}`);

  const request = https.request(options, (res) => {
    let responseData = '';

    res.on("data", (chunk) => {
      responseData += chunk; // Accumulate data
    });

    res.on("end", () => {
      logger.info(`HTTP STATUS: ${res.statusCode}`);
      logger.info(`RESPONSE DATA:- ${responseData}`);
      // console.log("res: ", res);

      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Only parse JSON if status is 200-299
        try {
          const jsonResponse = JSON.parse(responseData);
          if (jsonResponse?.result === 0) {
            callback("success", jsonResponse);
          } else {
            callback("error", jsonResponse);
          }
        } catch (error) {
          console.error("JSON parsing error: ", error);
          console.error("Raw response: ", responseData); // Log raw response for debugging
          callback("error", { message: "Invalid JSON response", raw: responseData });
        }
      } else {
        console.error("API Error: enableX ", responseData);
        callback("error", { message: `HTTP Error ${res.statusCode}`, raw: responseData });
      }
    });
  });

  request.on("error", (err) => {
    console.error("Request error: ", err);
    logger.info(`RESPONSE ERROR:- ${JSON.stringify(err)}`);
    callback("error", { message: "Request failed", error: err });
  });

  if (data == null) {
    request.end();
  } else {
    request.end(data);
  }
};



module.exports = vcxutil;
