"use strict";

const mongoose = require("mongoose");

const assignDoctorSchema = mongoose.Schema({
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

  mobile: {
    type: Number,
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
  date: {
    type: Date,
    required: true
  },

assignDoctor: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("assignDoctor", assignDoctorSchema);
