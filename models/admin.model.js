const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    //message: "The email address is already taken!",
  },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  organisation: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  status:{type:String,default:'Active'},
  
  date: Date,
});
AdminSchema.plugin(aggregatePaginate);

const Admin = mongoose.model("Admins", AdminSchema);

module.exports = Admin;
