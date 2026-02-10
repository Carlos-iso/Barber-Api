"use strict";

const mongoose = require("mongoose");
const CuttingMethods = mongoose.model("CuttingMethods");

exports.get = async () => {
    const cuttingMethods = await CuttingMethods.find({}, "id label icon backgroundImage");
    return cuttingMethods;
};

exports.getByLabel = async (label) => {
    const cuttingMethods = await CuttingMethods.findOne({ label });
    return cuttingMethods;
};

exports.create = async (data) => {
    const cuttingMethods = await new CuttingMethods(data);
    await cuttingMethods.save();
};

exports.update = async (id, data) => {
    await CuttingMethods.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.name,
            icon: data.icon,
            backgroundImage: data.backgroundImage
        },
    });
};

exports.delete = async (id) => {
    await CuttingMethods.findByIdAndRemove(id);
};
