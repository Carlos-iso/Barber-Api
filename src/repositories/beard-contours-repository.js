"use strict";

const mongoose = require("mongoose");
const BeardContours = mongoose.model("BeardContours");

exports.get = async () => {
	// Retorna todos os campos necessários
	return await BeardContours.find({});
};

exports.getById = async (id) => {
	return await BeardContours.findById(id);
};

// Mantido para compatibilidade, mas getById é preferível
exports.getByLabel = async (label) => {
	return await BeardContours.findOne({ label });
};

exports.create = async (data) => {
	const beardContours = new BeardContours(data);
	await beardContours.save();
	return beardContours;
};

exports.update = async (id, data) => {
	// Atualização parcial respeitando os campos enviados
	await BeardContours.findByIdAndUpdate(id, {
		$set: data,
	});
};

exports.delete = async (id) => {
	// Retorna o documento deletado para que o controller possa limpar a imagem
	return await BeardContours.findByIdAndDelete(id);
};
