const mongoose = require("mongoose");
const OrganisationSchema = new mongoose.Schema(
  {
    organisation_name: { type: String, required: true, unique: true },
    created_by: { type: String },
    updated_by: { type: String },
  },

  { timestamps: true }
);
const Organisations = mongoose.model("Organisations", OrganisationSchema);

module.exports = Organisations;
