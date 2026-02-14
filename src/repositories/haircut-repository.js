"use strict";

const mongoose = require("mongoose");
const HaircutStyle = mongoose.model("HaircutStyle");

exports.get = async () => {
	return await HaircutStyle.find({});
};

exports.getById = async (id) => {
	return await HaircutStyle.findById(id);
};

exports.getByName = async (name) => {
	return await HaircutStyle.findOne({ name });
};

exports.create = async (data) => {
	const haircut = new HaircutStyle(data);
	await haircut.save();
	return haircut;
};

exports.update = async (id, data) => {
	await HaircutStyle.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	return await HaircutStyle.findByIdAndDelete(id);
};
