var Departments = require("../models/Department.model");
var Permissions = require("../models/Permission.model");
var Rolepermissions = require("../models/Rolepermission.model");
const mongoose = require("mongoose");

/* Create department */

exports.createDepartment = async function (req) {
  try {
    var Department = new Departments({
      organisation_name: req.body.organisation_name,
      role_name: req.body.role_name,
      department_name: req.body.department_name.toUpperCase(),
      created_by: req.admindetails._id,
      updated_by: req.admindetails._id,
    });
    var Rolespermission = new Rolepermissions({
      organisation_name: req.body.organisation_name,
      role_name: req.body.role_name,
      department_name: req.body.department_name.toUpperCase(),
      permissions: req.body.permissions,
    });
    var savedDepartment = await Department.save();
    var savedrolespermission = await Rolespermission.save();
    return {
      department: savedDepartment,
      rolepermission: savedrolespermission,
    };
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};

/*End*/

/*Edit department*/

exports.editDepartment = async function (req) {
  try {
    const department_id = req.body.department_id;
    const Departmentdetails = await Departments.findOne({
      _id: department_id,
    });
    if (Departmentdetails.length != 0) {
      Departmentdetails.organisation_name = req.body.organisation_name;
      Departmentdetails.role_name = req.body.role_name;
      Departmentdetails.department_name = req.body.department_name.toUpperCase();
      Departmentdetails.updated_by = req.admindetails._id;

      var Rolespermission = new Rolepermissions({
        organisation_name: req.body.organisation_name,
        role_name: req.body.role_name,
        department_name: req.body.department_name.toUpperCase(),
        permissions: req.body.permissions,
      });
    } else {
      throw Error("Department Details Not Found");
    }
    await Rolepermissions.remove({
      organisation_name: Departmentdetails.organisation_name,
      role_name: Departmentdetails.role_name,
      department_name: Departmentdetails.department_name,
    });
    const rolepermissions = await Rolespermission.save();
    const updatedDepartments = await Departmentdetails.save();
    return {
      department: updatedDepartments,
      rolepermission: rolepermissions,
    };
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};

/*End */

/*Get department details */
exports.getDepartmentDetails = async function (req) {
  try {
    const Departmentsdetails = await Departments.find();
    return Departmentsdetails;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End */

/*Permission details */
exports.permissionDetails = async function (req) {
  try {
    const Permissiondetails = await Permissions.find();
    return Permissiondetails;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End */

/*Department details */
exports.departmentDetail = async function (req) {
  try {
    const department_id = await req.params.department_id;
    if (mongoose.Types.ObjectId.isValid(department_id)) {
      var Departmentdetail = await Departments.findOne({
        _id: department_id,
      });
      console.log(Departmentdetail.organisation_name);
      var permissions = await Permissions.find();
      console.log("pavan");
      var rolepermissions = await Rolepermissions.findOne({
        organisation_name: Departmentdetail.organisation_name,
        role_name: Departmentdetail.role_name,
        department_name: Departmentdetail.department_name,
      });
    } else {
      throw "Department Details Not found";
    }

    return {
      Department: Departmentdetail,
      permission: permissions,
      rolepermission: rolepermissions,
    };
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End */