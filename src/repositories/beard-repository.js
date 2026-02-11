"use strict";

const mongoose = require("mongoose");
const BeardStyle = mongoose.model("BeardStyle");

exports.get = async () => {
    const beard = await BeardStyle.find({}, "user id name icon description defaultImage");
    return beard;
};

exports.getByName = async (name) => {
    const beard = await BeardStyle.findOne({ name });
    return beard;
};

exports.create = async (data) => {
    var beard = await new BeardStyle(data);
    await beard.save();
};

exports.update = async (id, data) => {
    await BeardStyle.findByIdAndUpdate(id, {
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
    await BeardStyle.findByIdAndRemove(id);
};
