const mongoose = require("mongoose");
const SitesettingSchema = new mongoose.Schema(
  {
    site_info: { type: [] },
    site_logo: { type: String },
    title_logo: { type: String },
  },

  { timestamps: true }
);
const SiteSettings = mongoose.model("sitesettings", SitesettingSchema);

module.exports = SiteSettings;
