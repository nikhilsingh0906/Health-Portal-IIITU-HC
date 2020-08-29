"use strict";

const mongoose = require("mongoose");

const contactUsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  
});

module.exports = mongoose.model("contactUs", contactUsSchema);
