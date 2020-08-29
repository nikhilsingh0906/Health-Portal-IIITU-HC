const dotEnv = require("dotenv");

dotEnv.config();

module.exports = {
  port: process.env.PORT,
  senderMail: process.env.SENDERMAIL,
  senderPass: process.env.SENDERPASS,
  service: process.env.SERVICE
};
