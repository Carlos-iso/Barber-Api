'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BaseOptionSchema = new Schema({
  id: {
    type: String,
    required: [true, 'O ID é necessário'],
  },
  name: {
    type: String,
  },
  label: {
    type: String,
  },
  icon: {
    type: String,
    required: [true, 'O ícone é necessário'],
  },
  description: {
    type: String,
  },
  defaultImage: {
    type: String,
  },
  backgroundImage: {
    type: String,
  }
}, { _id: false });

module.exports = BaseOptionSchema;