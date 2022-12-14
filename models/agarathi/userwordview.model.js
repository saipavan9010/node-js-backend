const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

const UserWordViewSchema = new mongoose.Schema(
  {
    word_data: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "words",
    },
    user_id: { type: String, required: true, index: true },
    book_mark: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
UserWordViewSchema.plugin(aggregatePaginate);

const userWordView = mongoose.model("user_word_view", UserWordViewSchema);



module.exports = userWordView;
