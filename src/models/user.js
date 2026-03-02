"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
	name: {
		type: String,
		required: [true, "O nome é necessário"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "O e-mail é necessário"],
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: [true, "A senha é necessária"],
	},
	role: {
		type: String,
		enum: ["user", "barber", "admin"],
		default: "user",
	},
	avatar: {
		url: { type: String },
		key: { type: String },
	},
	bio: {
		type: String,
		trim: true,
	},
	phone: {
		type: String,
		trim: true,
	},
	address: {
		type: String,
		trim: true,
	},
	socialMedia: {
		instagram: { type: String },
		facebook: { type: String },
		linkedin: { type: String },
	},
	active: {
		type: Boolean,
		default: true,
	},
	attendanceCount: {
		type: Number,
		default: 0,
		min: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("User", schema);
