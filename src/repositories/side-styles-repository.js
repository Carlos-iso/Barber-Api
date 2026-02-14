"use strict";

const mongoose = require("mongoose");
const SideStyles = mongoose.model("SideStyles");

exports.get = async () => {
	return await SideStyles.find({});
};

exports.getById = async (id) => {
	return await SideStyles.findById(id);
};

exports.getByLabel = async (label) => {
	return await SideStyles.findOne({ label });
};

exports.create = async (data) => {
	const sideStyles = new SideStyles(data);
	await sideStyles.save();
	return sideStyles;
};

exports.update = async (id, data) => {
	await SideStyles.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await SideStyles.findByIdAndDelete(id);
};
