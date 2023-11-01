/* eslint-disable prettier/prettier */
// const validator = require("validator");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"],
  },
  email: {
    type: String,
      required: [true, "Must have an email"],
    unique: true
    // validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "Must have at least 8 characters"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password"],
  },
  photo: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
