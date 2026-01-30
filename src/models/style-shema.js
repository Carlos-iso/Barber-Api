'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseOptionSchema = require('./');

const StyleSchema = new Schema({
	type: {
		type: String,
		enum: ['haircut', 'beard'],
		required: [true, 'O tipo é obrigatório'],
	},
	styles: {
		type: [BaseOptionSchema],
		required: true,
	}
});

module.exports = mongoose.model('Styles', StyleSchema);