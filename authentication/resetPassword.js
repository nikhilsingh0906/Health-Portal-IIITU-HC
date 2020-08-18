"use strict";

async function resetPassword(user, req) {
  const nodemailer = require("nodemailer");
  const crypto = require("crypto");
  const users = require("../models");
  const envVar = require("../config");

  let transporter = nodemailer.createTransport({
    service: envVar.service,
    auth: {
      user: envVar.senderMail,
      pass: envVar.senderPass
    }
  });

  let token = crypto.randomBytes(20).toString("hex");

  let hash = crypto.pbkdf2Sync(token, "", 1000, 64, "sha512").toString("hex");

  users
    .updateOne(
      { email: req.body.username },
      { $set: { passwordResetToken: hash, tokenExpiry: Date.now() + 3600000 } }
    )
    .then(info => {
      console.log(info);
    })
    .catch(err => {
      console.log(err);
    });

  const mailOptions = {
    from: `"Login app" <${envVar.senderMail}>`,
    to: req.body.username,
    subject: "Reset password link",
    text: "",
    html: `<p>Here is your password reset token </p><br><b>${token}</b>`
  };

  let info = await transporter.sendMail(mailOptions);

  return info;
}

module.exports = resetPassword;
