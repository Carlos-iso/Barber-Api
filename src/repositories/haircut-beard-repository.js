"use strict";

const mongoose = require("mongoose");
const HaircutBeardStyle = mongoose.model("HaircutBeardStyle");

exports.get = async () => {
    const haircutBeard = await HaircutBeardStyle.find({}, "id name icon description defaultImage");
    return haircutBeard;
};

exports.getByName = async (name) => {
    const haircutBeard = await HaircutBeardStyle.findOne({ name });
    return haircutBeard;
};

exports.create = async (data) => {
    var haircutBeard = await new HaircutBeardStyle(data);
    await haircutBeard.save();
};

exports.update = async (id, data) => {
    await HaircutBeardStyle.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            name: data.name,
            icon: data.icon,
            description: data.description,
            defaultImage: data.defaultImage
        },
    });
};

exports.delete = async (id) => {
    await HaircutBeardStyle.findByIdAndRemove(id);
};
