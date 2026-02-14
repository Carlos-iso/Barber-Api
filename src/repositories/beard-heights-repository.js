"use strict";

const mongoose = require("mongoose");
const BeardHeights = mongoose.model("BeardHeights");

exports.get = async () => {
	return await BeardHeights.find({});
};

exports.getById = async (id) => {
	return await BeardHeights.findById(id);
};

exports.getByLabel = async (label) => {
	return await BeardHeights.findOne({ label });
};

exports.create = async (data) => {
	const beardHeights = new BeardHeights(data);
	await beardHeights.save();
	return beardHeights;
};

exports.update = async (id, data) => {
	await BeardHeights.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await BeardHeights.findByIdAndDelete(id);
};
