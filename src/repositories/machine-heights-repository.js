"use strict";

const mongoose = require("mongoose");
const MachineHeights = mongoose.model("MachineHeights");

exports.get = async () => {
	return await MachineHeights.find({});
};

exports.getById = async (id) => {
	return await MachineHeights.findById(id);
};

exports.getByLabel = async (label) => {
	return await MachineHeights.findOne({ label });
};

exports.create = async (data) => {
	const machineHeights = new MachineHeights(data);
	await machineHeights.save();
	return machineHeights;
};

exports.update = async (id, data) => {
	await MachineHeights.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await MachineHeights.findByIdAndDelete(id);
};
