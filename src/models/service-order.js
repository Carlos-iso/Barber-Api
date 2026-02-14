"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
	customerName: {
		type: String,
		required: [true, "O nome do cliente é obrigatório"],
		trim: true,
	},
	date: {
		type: Date,
		required: [true, "A data do serviço é obrigatória"],
		default: Date.now,
	},
	status: {
		type: String,
		required: true,
		enum: ["pending", "completed", "canceled"],
		default: "pending",
	},
	totalPrice: {
		type: Number,
		required: [true, "O preço total é obrigatório"],
	},
	barberId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "O barbeiro é obrigatório"],
	},
	services: [
		{
			name: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("ServiceOrder", schema);
