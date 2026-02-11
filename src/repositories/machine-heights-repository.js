"use strict";

const mongoose = require("mongoose");
const MachineHeights = mongoose.model("MachineHeights");

exports.get = async () => {
    const machineHeights = await MachineHeights.find({}, "user id label icon defaultImage");
    return machineHeights;
};

exports.getByLabel = async (label) => {
    const machineHeights = await MachineHeights.findOne({ label });
    return machineHeights;
};

exports.create = async (data) => {
    const machineHeights = await new MachineHeights(data);
    await machineHeights.save();
};

exports.update = async (id, data) => {
    await MachineHeights.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.name,
            icon: data.icon,
            defaultImage: data.backgroundImage
        },
    });
};

exports.delete = async (id) => {
    await MachineHeights.findByIdAndRemove(id);
};
