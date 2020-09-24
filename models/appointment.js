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
<<<<<<< HEAD
    type: String,
=======
    type: Number,
>>>>>>> 8faabe5ef5fe79d0b3989f2c2fbac80f6c0a0529
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
