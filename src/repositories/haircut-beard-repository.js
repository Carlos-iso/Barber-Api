"use strict";

const mongoose = require("mongoose");
const HaircutBeardStyle = mongoose.model("HaircutBeardStyle");

exports.get = async () => {
    const style = await HaircutBeardStyle.find({}, "id name icon description defaultImage");
    return style;
};

exports.getByName = async (name) => {
    const style = await HaircutBeardStyle.findOne({ name });
    return style;
};

exports.create = async (data) => {
    var style = await new HaircutBeardStyle(data);
    await style.save();
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
