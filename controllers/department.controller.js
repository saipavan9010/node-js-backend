var DepartmentService = require("../services/department.service");
const { body, validationResult } = require("express-validator");


/*Create department */
exports.createDepartment = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var createDepartment = await DepartmentService.createDepartment(req);
    return res
      .status(200)
      .json({ data: createDepartment, message: "Saved Successfully" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End */

/*editDepartment */
exports.editDepartment = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var editDepartment = await DepartmentService.editDepartment(req);
    return res
      .status(200)
      .json({ data: editDepartment, message: "Updated Successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End */

/*getDepartmentDetails */
exports.getDepartmentDetails = async function (req, res, next) {
  try {
    var departmentDetails = await DepartmentService.getDepartmentDetails(req);
    return res.status(200).json({ status: 200, data: departmentDetails });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End */

/*department Details */
exports.departmentDetail = async function (req, res, next) {
  try {
    var departmentDetail = await DepartmentService.departmentDetail(req);
    return res.status(200).json({ status: 200, data: departmentDetail });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End */

/*permission Details */
exports.permissionDetails = async function (req, res, next) {
  try {
    var permissionDetail = await DepartmentService.permissionDetails(req);
    return res.status(200).json({ status: 200, data: permissionDetail });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End */

/*Validations*/
exports.validate = (method) => {
  switch (method) {
    case "add-departments": {
      return [
        body("organisation_name", "Organisation Name is required").exists(),
        body(
          "organisation_name",
          "Organisation Name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("role_name", "Roles Name is required").exists(),
        body(
          "role_name",
          "Roles Name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("department_name", "Deparment Name is required").exists(),
        body(
          "department_name",
          "Deparment Name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("permissions", "Permissions  is required").exists(),
      ];
    }
    case "edit-department": {
      return [
        body("organisation_name", "Organisation Name is required").exists(),
        body(
          "organisation_name",
          "Organisation Name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("role_name", "Roles Name is required").exists(),
        body(
          "role_name",
          "Roles Name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("department_name", "Deparment Name is required").exists(),
        body(
          "department_name",
          "Deparment Name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("department_id", "Deparment ID is required").exists(),
        body(
          "department_id",
          "Deparment ID should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
      ];
    }
  }
};
