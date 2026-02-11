"use strict";

const mongoose = require("mongoose");
const FinishStyles = mongoose.model("FinishStyles");

exports.get = async () => {
    const finishStyles = await FinishStyles.find({}, "user id label icon defaultImage");
    return finishStyles;
};

exports.getByLabel = async (label) => {
    const finishStyles = await FinishStyles.findOne({ label });
    return finishStyles;
};

exports.create = async (data) => {
    const finishStyles = await new FinishStyles(data);
    await finishStyles.save();
};

exports.update = async (id, data) => {
    await FinishStyles.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.name,
            icon: data.icon,
            defaultImage: data.backgroundImage
        },
    });
};

exports.delete = async (id) => {
    await FinishStyles.findByIdAndRemove(id);
};
