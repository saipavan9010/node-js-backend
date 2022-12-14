const { Seeder } = require("mongoose-data-seed");
const rolepermissions = require("../models/Rolepermission.model");

var data = [
  {
    organisation_name: "COSMIC",
    role_name: "SUPERADMIN",
    department_name: "OVERALLADMIN",
    permissions: [
      "meanings-word",
      "word-upload",
      "word-list",
      "cms-list",
      "cms-edit",
      "add-role",
      "edit-role",
      "role-list",
      "role-list",
      "organisation-list",
      "add-organisation",
      "edit-organisation",
      "list-department",
      "add-department",
      "edit-department",
    ],
  },
  {
    organisation_name: "CTSG",
    role_name: "SUPERADMIN",
    department_name: "OVERALLADMIN",
    permissions: [
      "english-word",
      "word-audio-male",
      "word-audio-female",
      "word-image",
      "word-list",
    ],
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "ENGLISH",
    permissions: ["english-word", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "MEANING",
    permissions: ["meanings-word", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "IMAGE",
    permissions: ["word-image", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "APPROVER",
    department_name: "AUDIO",
    permissions: ["word-audio-male", "word-audio-female", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "USER",
    department_name: "AUDIOMALE",
    permissions: ["word-audio-male", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "USER",
    department_name: "AUDIOFEMALE",
    permissions: ["word-audio-female", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "USER",
    department_name: "ENGLISH",
    permissions: ["english-word", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "USER",
    department_name: "IMAGE",
    permissions: ["word-image", "word-list"],
  },
  {
    organisation_name: "CTSG",
    role_name: "USER",
    department_name: "MEANING",
    permissions: ["meanings-word", "word-list"],
  },
];

class RolepermissionsSeeder extends Seeder {
  async shouldRun() {
    return rolepermissions
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return rolepermissions.create(data);
  }
}

module.exports = RolepermissionsSeeder;
