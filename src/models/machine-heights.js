'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Necessário Vinculo Ao Admin"],
	},
	id: {
		type: String,
		required: [true, 'O ID é necessário'],
	},
	label: {
		type: String,
		required: [true, 'O Label é necessário'],
	},
	icon: {
		type: String,
		required: [true, 'O ícone é necessário'],
	},
	// Alamo: Remover? ou deixa para trocar também o ícone por imagem
	defaultImage: {
		url: {
			type: String,
			required: [true, "Necessário Uma URL Váida!"],
			match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "URL inválida"],
		},
		type: {
			type: String,
			required: [true, "Necessário Especificar O Tipo!"],
		},
		key: {
			type: String,
			required: [true, "Necessário uma chave de local de arquivo"]
		},
	},
});
module.exports = mongoose.model("MachineHeights", schema);