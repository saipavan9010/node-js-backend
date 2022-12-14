var Organisations = require("../models/organisation.model");
const mongoose = require("mongoose");

/*Create organization */
exports.createOrganisation = async function (req) {
  try {
    var Organisation = new Organisations({
      organisation_name: req.body.organisation_name.toUpperCase(),
      created_by: req.admindetails._id,
      updated_by: req.admindetails._id,
    });
    var savedOrganisation = await Organisation.save();

    return savedOrganisation;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of creating organization */



/*Edit porganization */
exports.editOrganisation = async function (req) {
  try {
    const organisation_id = req.body.organisation_id;
    const Organisationsdetails = await Organisations.findOne({
      _id: organisation_id,
    });
    if (Organisationsdetails.length != 0) {
      Organisationsdetails.organisation_name = req.body.organisation_name.toUpperCase();
      Organisationsdetails.updated_by = req.admindetails._id;
    } else {
      throw Error("Organisation Details Not Found");
    }
    const updatedOrganisations = await Organisationsdetails.save();
    return updatedOrganisations;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of edit organization */



/*Get organization details */
exports.getOrganisationDetails = async function (req) {
  try {
    const Organisationsdetails = await Organisations.find();
    return Organisationsdetails;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of getting organization details */



/*Organization details */
exports.organisationDetail = async function (req) {
  try {
    const organisation_id = await req.params.organisation_id;
    if (mongoose.Types.ObjectId.isValid(organisation_id)) {
      var Organisationdetail = await Organisations.find({
        organisation_name: "CTSG",
      });
    } else {
      throw "Organisations Details Not found";
    }

    return Organisationdetail;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of organization details */