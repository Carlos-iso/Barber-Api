'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
	name: {
		type: String,
		required: [true, 'O nome é necessário'],
		trim: true
	},
	email: {
		type: String,
		required: [true, 'O e-mail é necessário'],
		unique: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: [true, 'A senha é necessária'],
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	},
	active: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});
module.exports = mongoose.model('User', schema);