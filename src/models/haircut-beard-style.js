'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    id: {
        type: String,
        required: [true, 'O ID é necessário'],
    },
    name: {
        type: String,
        required: [true, 'O Nome é necessário'],
    },
    icon: {
        type: String,
        required: [true, 'O ícone é necessário'],
    },
    description: {
        type: String,
        required: [true, 'O descrição é necessário'],
    },
    defaultImage: {
        type: String,
        required: [true, 'Uma Imagem é necessário'],
        match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, "URL inválida"],
    },
});
module.exports = mongoose.model("HaircutBeardStyle", schema);