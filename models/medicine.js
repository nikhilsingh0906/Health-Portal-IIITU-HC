"use strict";

const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  manufactureDate: {
    type: Date,
    required: true
  },

  expiryDate: {
    type: Date,
    required: true
  },

  avalaible: {
    type: Number,
    required: true
  },

  total: {
    type: Number,
    required: false
  },

  price: {
    type: Number,
    required: false
  },
 

});

module.exports = mongoose.model("medicine", medicineSchema);
