"use strict";

const mongoose = require("mongoose");
const ScissorHeights = mongoose.model("ScissorHeights");

exports.get = async () => {
	return await ScissorHeights.find({});
};

exports.getById = async (id) => {
	return await ScissorHeights.findById(id);
};

exports.getByLabel = async (label) => {
	return await ScissorHeights.findOne({ label });
};

exports.create = async (data) => {
	const scissorHeights = new ScissorHeights(data);
	await scissorHeights.save();
	return scissorHeights;
};

exports.update = async (id, data) => {
	await ScissorHeights.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await ScissorHeights.findByIdAndDelete(id);
};
