const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      message: "The email is required !",
    },
    mobile_no: {
      type: Number,
    },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      default: "MALE",
    },
    language: {
      type: String,
      enum: ["ENGLISH", "TAMIL"],
      default: "ENGLISH",
    },

    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
