const { Seeder } = require("mongoose-data-seed");
const Role = require("../models/roles.model");

const data = [
  {
    role_name: "SUPERADMIN",
  },
  {
    role_name: "APPROVER",
  },
  {
    role_name: "USER",
  },
];

class RolesSeeder extends Seeder {
  async shouldRun() {
    return Role.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Role.create(data);
  }
}

module.exports = RolesSeeder;
