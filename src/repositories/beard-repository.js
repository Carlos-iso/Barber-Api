"use strict";

const mongoose = require("mongoose");
const BeardStyle = mongoose.model("BeardStyle");

exports.get = async () => {
	return await BeardStyle.find({});
};

exports.getById = async (id) => {
	return await BeardStyle.findById(id);
};

exports.getByName = async (name) => {
	return await BeardStyle.findOne({ name });
};

exports.create = async (data) => {
	const beard = new BeardStyle(data);
	await beard.save();
	return beard;
};

exports.update = async (id, data) => {
	await BeardStyle.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await BeardStyle.findByIdAndDelete(id);
};
