"use strict";

const mongoose = require("mongoose");
const FadeTypes = mongoose.model("FadeTypes");

exports.get = async () => {
    const fadeTypes = await FadeTypes.find({}, "user id label icon description defaultImage");
    return fadeTypes;
};

exports.getByLabel = async (label) => {
    const fadeTypes = await FadeTypes.findOne({ label });
    return fadeTypes;
};

exports.create = async (data) => {
    var fadeTypes = await new FadeTypes(data);
    await fadeTypes.save();
};

exports.update = async (id, data) => {
    await FadeTypes.findByIdAndUpdate(id, {
        $set: {
            id: data.id,
            label: data.label,
            icon: data.icon,
            description: data.description,
            defaultImage: data.defaultImage
        },
    });
};

exports.delete = async (id) => {
    await FadeTypes.findByIdAndRemove(id);
};
