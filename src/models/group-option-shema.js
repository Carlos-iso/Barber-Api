'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseOptionSchema = require('./schemas/BaseOptionSchema');

const OptionGroupSchema = new Schema({
	group: {
		type: String,
		required: [true, 'O grupo é obrigatório'],
		unique: true
	},
	options: {
		type: [BaseOptionSchema],
		required: true
	}
});

module.exports = mongoose.model('OptionGroups', OptionGroupSchema);