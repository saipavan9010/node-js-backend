const mongoose = require("mongoose");
const RolepermissionSchema = new mongoose.Schema(
  {
    organisation_name: { type: String, required: true },
    role_name: { type: String, required: true },
    department_name: { type: String, required: true },
    permissions: [],
  },

  { timestamps: true }
);
const Rolepermissions = mongoose.model("Rolepermissions", RolepermissionSchema);

module.exports = Rolepermissions;
