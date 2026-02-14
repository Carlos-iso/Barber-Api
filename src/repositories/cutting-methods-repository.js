"use strict";
const mongoose = require("mongoose");
const CuttingMethods = mongoose.model("CuttingMethods");

exports.get = async () => {
	return await CuttingMethods.find({});
};

exports.getById = async (id) => {
	return await CuttingMethods.findById(id);
};

exports.getByLabel = async (label) => {
	return await CuttingMethods.findOne({ label });
};

exports.create = async (data) => {
	const cuttingMethods = new CuttingMethods(data);
	await cuttingMethods.save();
	return cuttingMethods;
};

exports.update = async (id, data) => {
	await CuttingMethods.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await CuttingMethods.findByIdAndDelete(id);
};
