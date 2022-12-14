var Roles = require("../models/roles.model");
const mongoose = require("mongoose");


/*Create Roles */
exports.createRole = async function (req) {
  try {
    var Role = new Roles({
      role_name: req.body.role_name.toUpperCase(),
      created_by: req.admindetails._id,
      updated_by: req.admindetails._id,
    });
    var savedRole = await Role.save();

    return savedRole;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of create role */


/*Edit role */
exports.editRoles = async function (req) {
  try {
    const role_id = req.body.role_id;
    const Rolesdetails = await Roles.findOne({ _id: role_id });
    if (Rolesdetails.length != 0) {
      Rolesdetails.role_name = req.body.role_name.toUpperCase();
      Rolesdetails.updated_by = req.admindetails._id;
    } else {
      throw Error("Role Details Not Found");
    }
    const updatedRoles = await Rolesdetails.save();
    return updatedRoles;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of edit role */



/*To get role details */
exports.getRoleDetails = async function (req) {
  try {
    const Rolesdetails = await Roles.find();
    return Rolesdetails;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of getting role details */



/*Role details */
exports.roleDetail = async function (req) {
  try {
    console.log(req.params);
    const role_id = await req.params.role_id;
    if (mongoose.Types.ObjectId.isValid(role_id)) {
      var Roledetails = await Roles.find({ _id: role_id });
    } else {
      throw "Roles Details Not found";
    }

    return Roledetails;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of role detail */