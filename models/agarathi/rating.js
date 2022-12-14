const mongoose = require("mongoose");
const { stream } = require("winston");

const RatingSchema = new mongoose.Schema(
  {
      user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
        unique:true
      },
      comment:{
          type:String,
          required:true
      },
      rating:{
          type:String,
          enum:["1","2","3","4","5"]
      },
      suggestion:{
        type:String,
        required:true
      },
      source_type:{
        type:String
      }

  }
);
const Rating = mongoose.model("ratings", RatingSchema);
module.exports = Rating;
