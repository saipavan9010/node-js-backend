var RoleService = require("../services/roles.service");
const { body, validationResult } = require("express-validator");

/*Creating a role */
exports.createRole = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var createRole = await RoleService.createRole(req);
    return res
      .status(200)
      .json({ data: createRole, message: "Saved Successfully" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "Role name already exits" });
  }
};
/*End of creating roles */

/*Edit role */
exports.editRoles = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var editRoles = await RoleService.editRoles(req);
    return res
      .status(200)
      .json({ data: editRoles, message: "Updated Successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of edit role */

/*To get role details */
exports.getRoleDetails = async function (req, res, next) {
  try {
    var rolesDetails = await RoleService.getRoleDetails(req);
    return res.status(200).json({ status: 200, data: rolesDetails });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of getting role details */

/*Role details */
exports.roleDetail = async function (req, res, next) {
  try {
    var roleDetail = await RoleService.roleDetail(req);
    return res.status(200).json({ status: 200, data: roleDetail });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of role details */

exports.validate = (method) => {
  switch (method) {
    case "add-roles": {
      return [
        body("role_name", "Role name is required").exists(),
        body(
          "role_name",
          "Role name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
      ];
    }
    case "edit-roles": {
      return [
        body("role_name", "Role name is required").exists(),
        body(
          "role_name",
          "Role name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("role_id", "Role ID is required").exists(),
        body("role_id", "Role Id should contain mininum Length 3").isLength({
          min: 3,
        }),
      ];
    }
  }
};
