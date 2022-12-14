const mongoose = require("mongoose");
const AuthotpSchema = new mongoose.Schema(
  {
    otp: { type: String, required: true },
    email_id: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const Authotp = mongoose.model("authotp", AuthotpSchema);

module.exports = Authotp;
