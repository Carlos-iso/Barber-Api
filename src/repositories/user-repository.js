"use strict";

const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.get = async () => {
  const res = await User.find({}, "name email");
  return res;
};

exports.getById = async (id) => {
  const res = await User.findById(id);
  return res;
};

exports.getByEmailExist = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

exports.create = async (data) => {
  var user = await new User(data);
  await user.save();
};

exports.authenticate = async (data) => {
  const res = await User.findOne({
    email: data.email,
    password: data.password,
  });
  return res;
};

exports.update = async (id, data) => {
  await User.findByIdAndUpdate(id, {
    $set: {
      name: data.name,
      email: data.email,
      password: data.password
    },
  });
};

exports.delete = async (id) => {
  await User.findByIdAndRemove(id);
};
