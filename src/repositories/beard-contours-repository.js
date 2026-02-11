"use strict";

const mongoose = require("mongoose");
const BeardContours = mongoose.model("BeardContours");

exports.get = async () => {
    const beardContours = await BeardContours.find({}, "user id label icon defaultImage");
    return beardContours;
};

exports.getByLabel = async (label) => {
    const beardContours = await BeardContours.findOne({ label });
    return beardContours;
};

exports.create = async (data) => {
    const beardContours = await new BeardContours(data);
    await beardContours.save();
};

exports.update = async (id, data) => {
    await BeardContours.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.name,
            icon: data.icon,
            defaultImage: data.backgroundImage
        },
    });
};

exports.delete = async (id) => {
    await BeardContours.findByIdAndRemove(id);
};
