const { Seeder } = require("mongoose-data-seed");
const Organisation = require("../models/organisation.model");

const data = [
  {
    organisation_name: "COSMIC",
  },
  {
    organisation_name: "CTSG",
  },
];

class OrganisationsSeeder extends Seeder {
  async shouldRun() {
    return Organisation.countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return Organisation.create(data);
  }
}

module.exports = OrganisationsSeeder;
