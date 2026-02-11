"use strict";

const mongoose = require("mongoose");
const BeardHeights = mongoose.model("BeardHeights");

exports.get = async () => {
    const beardHeights = await BeardHeights.find({}, "user id label icon defaultImage");
    return beardHeights;
};

exports.getByLabel = async (label) => {
    const beardHeights = await BeardHeights.findOne({ label });
    return beardHeights;
};

exports.create = async (data) => {
    const beardHeights = await new BeardHeights(data);
    await beardHeights.save();
};

exports.update = async (id, data) => {
    await BeardHeights.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.name,
            icon: data.icon,
            defaultImage: data.backgroundImage
        },
    });
};

exports.delete = async (id) => {
    await BeardHeights.findByIdAndRemove(id);
};
