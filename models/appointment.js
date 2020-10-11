"use strict";

const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  branch: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  symptoms: {
    type: String,
    required: true
  },

  allergies: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  rollnumber: {
    type: Number,
    required: false
  },
  date: {
    type: Date,
    required: true
  }

});

module.exports = mongoose.model("appointment", appointmentSchema);
