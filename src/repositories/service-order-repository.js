"use strict";

const mongoose = require("mongoose");
const ServiceOrder = mongoose.model("ServiceOrder");

exports.create = async (data) => {
	const order = new ServiceOrder(data);
	await order.save();
	return order;
};

exports.get = async (barberId) => {
	// Retorna O.S. apenas do barbeiro específico
	return await ServiceOrder.find({
		barberId: barberId,
	}).sort({ date: -1 }); // Mais recentes primeiro
};

exports.getById = async (id) => {
	return await ServiceOrder.findById(id);
};

exports.update = async (id, data) => {
	await ServiceOrder.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	await ServiceOrder.findByIdAndRemove(id);
};
