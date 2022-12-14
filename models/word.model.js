const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const WordSchema = new mongoose.Schema(
  {
    tamil_word: {
      type: String,
      required: true,
      message: "The Tamil word is required !",
    },
    english_word: {
      type: String,
    },
    tamil_unique_word: { type: String, index: true },

    grammer: { type: String },
    core_sense: { type: String },
    sub_sense: { type: String },
    synonym: { type: String },
    example: { type: String },
    homophones: { type: String },
    idioms_phrases: { type: String },
    etymology: { type: String },
    image: { type: String },
    audiomale: { type: String },
    audiofemale: { type: String },
    wordofday_status: { type: Number, default: 0 },
    viewers_count: { type: Number, default: 0 },
    level1_status: {
      type: String,
      enum: ["NEW", "APPROVED"],
      default: "NEW",
    },
    level2_status: {
      type: String,
      enum: ["NEW", "APPROVED"],
    },
    level3_status: {
      type: String,
      enum: ["NEW", "APPROVED"],
    },
    remarks: { type: String },
    english_assign_status: { type: String, index: true },
    image_assign_status: { type: String, index: true },
    audiomale_assign_status: { type: String },
    audiofemale_assign_status: { type: String },
    meaning_assign_status: { type: String, index: true },

    created_by: { type: String },
    updated_by: { type: String },
  },
  { timestamps: true },
  
  { toObject: { virtuals: true } },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

WordSchema.virtual("book_mark", {
  ref: "user_word_view", // the model to use
  localField: "_id", // find children where 'localField'
  foreignField: "word_data", // is equal to foreignField
  justOne: true,
});

WordSchema.plugin(aggregatePaginate);

const Word = mongoose.model("words", WordSchema);

module.exports = Word;
