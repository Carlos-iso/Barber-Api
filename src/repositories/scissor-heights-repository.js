"use strict";

const mongoose = require("mongoose");
const ScissorHeights = mongoose.model("ScissorHeights");

exports.get = async () => {
    const scissorHeights = await ScissorHeights.find({}, "user id label icon defaultImage");
    return scissorHeights;
};

exports.getByLabel = async (label) => {
    const scissorHeights = await ScissorHeights.findOne({ label });
    return scissorHeights;
};

exports.create = async (data) => {
    const scissorHeights = await new ScissorHeights(data);
    await scissorHeights.save();
};

exports.update = async (id, data) => {
    await ScissorHeights.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.name,
            icon: data.icon,
            defaultImage: data.backgroundImage
        },
    });
};

exports.delete = async (id) => {
    await ScissorHeights.findByIdAndRemove(id);
};
