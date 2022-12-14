var rolespermissions = require("../models/Rolepermission.model");

var roles_permissions = function (options) {
  return async function (req, res, next) {
    var department_name = req.admindetails.department;
    var organisation_name = req.admindetails.organisation;
    var role_name = req.admindetails.role;

    if (options) {
      try {
        var roles_permissions = await rolespermissions
          .findOne({
            department_name: department_name,
            organisation_name: organisation_name,
            role_name: role_name,
          })
          .select("permissions");
        if (!roles_permissions) {
          res.status(500).send({ message: "Your Not access for this page" });
        }
        if (
          !roles_permissions.permissions.includes(options) ||
          roles_permissions.permissions.length == 0
        ) {
          res.status(500).send({ message: "Your Not access for this page" });
        }
        next();
      } catch (e) {
        res.status(500).send({ message: "Your Not access for this page" });
      }
    }
  };
};

module.exports = { roles_permissions };
