const mongoose = require("mongoose");
const UserSearchDataSchema = new mongoose.Schema(
  {
    search_data: { type: [], required: true },
    user_id: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const userSearchData = mongoose.model("user_search_data", UserSearchDataSchema);

module.exports = userSearchData;
