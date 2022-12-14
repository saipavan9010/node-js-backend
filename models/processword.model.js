const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ProcesswordSchema = new mongoose.Schema(
  {
    word_detail: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "words",
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admins",
      index: true,
    },
    user_name: { type: String, required: true },
    assigned_admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admins",
    },
    department: { type: String, required: true, index: true },
    level_status: { type: String, required: true },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Departments",
    },
    comments: { type: String },
  },
  { timestamps: true }
);
ProcesswordSchema.plugin(aggregatePaginate);

const Processword = mongoose.model("Processwords", ProcesswordSchema);

module.exports = Processword;
