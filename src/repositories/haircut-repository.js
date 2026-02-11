"use strict";

const mongoose = require("mongoose");
const HaircutStyle = mongoose.model("HaircutStyle");

exports.get = async () => {
    const haircut = await HaircutStyle.find({}, "user id name icon description defaultImage");
    return haircut;
};

exports.getByName = async (name) => {
    const haircut = await HaircutStyle.findOne({ name });
    return haircut;
};

exports.create = async (data) => {
    var haircut = await new HaircutStyle(data);
    await haircut.save();
};

exports.update = async (id, data) => {
    await HaircutStyle.findByIdAndUpdate(id, {
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
    await HaircutStyle.findByIdAndRemove(id);
};
