const { Seeder } = require("mongoose-data-seed");
const departments = require("../models/Department.model");

var data = [
  {
    organisation_name: "COSMIC",
    role_name: "SUPERADMIN",
    department_name: "OVERALLADMIN",
  },
  {
    organisation_name: "CTSG",
    role_name: "SUPERADMIN",
    department_name: "OVERALLADMIN",
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "ENGLISH",
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "IMAGE",
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "MEANING",
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "AUDIO",
  },
  {
    organisation_name: "CTSG",
    role_name: "USER",
    department_name: "AUDIOMALE",
  },
  {
    organisation_name: "CTSG",
    role_name: "USER",
    department_name: "AUDIOFEMALE",
  },
  { organisation_name: "CTSG", role_name: "USER", department_name: "ENGLISH" },
  { organisation_name: "CTSG", role_name: "USER", department_name: "IMAGE" },
  { organisation_name: "CTSG", role_name: "USER", department_name: "MEANING" },
];

class DepartmentSeeder extends Seeder {
  async shouldRun() {
    return departments
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return departments.create(data);
  }
}

module.exports = DepartmentSeeder;
