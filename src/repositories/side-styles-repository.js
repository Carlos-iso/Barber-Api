"use strict";

const mongoose = require("mongoose");
const SideStyles = mongoose.model("SideStyles");

exports.get = async () => {
    const sideStyles = await SideStyles.find({}, "user id label icon defaultImage");
    return sideStyles;
};

exports.getByLabel = async (label) => {
    const sideStyles = await SideStyles.findOne({ label });
    return sideStyles;
};

exports.create = async (data) => {
    const sideStyles = await new SideStyles(data);
    await sideStyles.save();
};

exports.update = async (id, data) => {
    await SideStyles.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.name,
            icon: data.icon,
            defaultImage: data.backgroundImage
        },
    });
};

exports.delete = async (id) => {
    await SideStyles.findByIdAndRemove(id);
};
