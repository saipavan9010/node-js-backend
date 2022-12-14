const mongoose = require('mongoose');
const CmsSchema = new mongoose.Schema(
  {
    page_name: {
      type: String,
      required: true,
      unique: true,
      message: 'The Name word is required !'
    },
    page_content: {
      type: String,
      unique: true,
      required: true,
      message: 'The Content is required !'
    }
  },
  { timestamps: true }
);

const Cms = mongoose.model('cms', CmsSchema);

module.exports = Cms;
