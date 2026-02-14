"use strict";

const mongoose = require("mongoose");
const FinishStyles = mongoose.model("FinishStyles");

exports.get = async () => {
	return await FinishStyles.find({});
};

exports.getById = async (id) => {
	return await FinishStyles.findById(id);
};

exports.getByLabel = async (label) => {
	return await FinishStyles.findOne({ label });
};

exports.create = async (data) => {
	const finishStyles = new FinishStyles(data);
	await finishStyles.save();
	return finishStyles;
};

exports.update = async (id, data) => {
	await FinishStyles.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await FinishStyles.findByIdAndDelete(id);
};
