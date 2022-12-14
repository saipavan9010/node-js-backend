const mongoose = require("mongoose");
const DepartmentSchema = new mongoose.Schema(
  {
    organisation_name: { type: String, required: true },
    role_name: { type: String, required: true },
    department_name: { type: String, required: true },
    created_by: { type: String },
    updated_by: { type: String },
  },

  { timestamps: true }
);
const Departments = mongoose.model("Departments", DepartmentSchema);

module.exports = Departments;
