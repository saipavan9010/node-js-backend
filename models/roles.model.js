const mongoose = require("mongoose");
const RoleSchema = new mongoose.Schema(
  {
    role_name: { type: String, required: true, unique: true },
    created_by: { type: String },
    updated_by: { type: String },
  },

  { timestamps: true }
);
const Roles = mongoose.model("Roles", RoleSchema);

module.exports = Roles;
