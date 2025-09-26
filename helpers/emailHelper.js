// emailHelper.js
const nodemailer = require("nodemailer");
const config = require("../config/config");

exports.sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.NODEMAILER_EMAIL,
      pass: config.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: config.NODEMAILER_EMAIL,
    to,
    subject,
    html,
  });
};
