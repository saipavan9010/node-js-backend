const mongoose = require('mongoose');
const TrackwordSchema = new mongoose.Schema(
  {
    word_detail: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'words'
    },

    department:{
      type:String,
      required:true
    },

    word_track: { type: [] },

  },
  { timestamps: true }
);

const Trackword = mongoose.model('Trackwords', TrackwordSchema);

module.exports = Trackword;
