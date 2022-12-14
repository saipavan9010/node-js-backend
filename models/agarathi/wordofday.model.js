const mongoose = require("mongoose");
const WordofDaySchema = new mongoose.Schema(
  {
    word_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "words",
    },
    date: { type: Date },
  },
  { timestamps: true }
);

WordofDaySchema.virtual("book_mark", {
  ref: "user_word_view", // the model to use
  localField: "word_id", // find children where 'localField'
  foreignField: "word_data", // is equal to foreignField
  justOne: true,
});

const WordofDay = mongoose.model("word_of_day", WordofDaySchema);

module.exports = WordofDay;
