var OrganisationService = require("../services/organisation.service");
const { body, validationResult } = require("express-validator");

/*Create organization */
exports.createOrganisation = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var createRole = await OrganisationService.createOrganisation(req);
    return res
      .status(200)
      .json({ data: createRole, message: "Saved Successfully" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "Organization name already exits" });
  }
};
/*End of creating organization */

/*Edit organization */
exports.editOrganisation = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var editOrganisation = await OrganisationService.editOrganisation(req);
    return res
      .status(200)
      .json({ data: editOrganisation, message: "Updated Successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of editting organization */

/*To get organization details */
exports.getOrganisationDetails = async function (req, res, next) {
  try {
    var organisationDetails = await OrganisationService.getOrganisationDetails(
      req
    );
    return res.status(200).json({ status: 200, data: organisationDetails });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of getting organization details */

/*Organization details */
exports.organisationDetail = async function (req, res, next) {
  try {
    var organisationDetail = await OrganisationService.organisationDetail(req);
    return res.status(200).json({ status: 200, data: organisationDetail });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of organization details */


/*Validations */
exports.validate = (method) => {
  switch (method) {
    case "add-organisation": {
      return [
        body("organisation_name", "Organisation name is required").exists(),
        body(
          "organisation_name",
          "Organisation name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
      ];
    }
    case "edit-organisation": {
      return [
        body("organisation_name", "Organisation name is required").exists(),
        body(
          "organisation_name",
          "Organisation name should contain mininum 3 Letters"
        ).isLength({
          min: 3,
        }),
        body("organisation_id", "Role ID is required").exists(),
        body(
          "organisation_id",
          "Role Id should contain mininum Length 3"
        ).isLength({
          min: 3,
        }),
      ];
    }
  }
};
