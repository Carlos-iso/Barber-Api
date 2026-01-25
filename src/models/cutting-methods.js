'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    id: {
        type: String,
        required: [true, 'O ID É Necessário'],
        unique: true
    },
    label: {
        type: String,
        required: [true, 'O Label É Necessário'],
        unique: true
    },
    icon: {
        type: String,
        required: [true, 'O Ícone É Necessário'],
        unique: false
    },
    backgroundImage: {
        type: String,
        required: false,
        unique: false
    }
});
module.exports = mongoose.model('HaircutStyles', schema);