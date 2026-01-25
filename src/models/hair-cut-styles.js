'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    id: {
        type: String,
        required: [true, 'O ID É Necessário'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'O Nome É Necessário'],
        unique: true
    },
    icon: {
        type: String,
        required: [true, 'O Ícone É Necessário'],
        unique: false
    },
    description: {
        type: String,
        required: [true, 'A Descrição É Necessária'],
        unique: false
    }
});
module.exports = mongoose.model('HaircutStyles', schema);