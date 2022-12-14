const mongoose = require("mongoose");
const PermissionSchema = new mongoose.Schema(
  {
    display_name: { type: String, required: true },
    group_name: { type: String, required: true },
    name: { type: String, unique: true, required: true },
  },

  { timestamps: true }
);
const Permissions = mongoose.model("Permissions", PermissionSchema);

module.exports = Permissions;
