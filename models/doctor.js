"use strict";

const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
 specialist: {
    type: String,
    required: true
  },

  mobile: {
    type: Number,
    required: true
  },

  Timings: {
    type: String,
    required: false
  },

  

});

module.exports = mongoose.model("doctor", doctorSchema);
