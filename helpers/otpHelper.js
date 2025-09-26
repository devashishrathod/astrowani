const crypto = require("node:crypto");

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

module.exports = { generateOTP };
