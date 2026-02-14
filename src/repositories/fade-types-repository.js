"use strict";

const mongoose = require("mongoose");
const FadeTypes = mongoose.model("FadeTypes");

exports.get = async () => {
	return await FadeTypes.find({});
};

exports.getById = async (id) => {
	return await FadeTypes.findById(id);
};

exports.getByLabel = async (label) => {
	return await FadeTypes.findOne({ label });
};

exports.create = async (data) => {
	const fadeTypes = new FadeTypes(data);
	await fadeTypes.save();
	return fadeTypes;
};

exports.update = async (id, data) => {
	await FadeTypes.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await FadeTypes.findByIdAndDelete(id);
};
