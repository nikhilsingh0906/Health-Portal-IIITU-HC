"use strict";

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  salt: {
    type: String,
    required: true
  },

  passwordResetToken: {
    type: String,
    required: false
  },

  tokenExpiry: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model("user", userSchema);
