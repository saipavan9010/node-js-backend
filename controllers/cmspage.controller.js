var CmspageService = require("../services/cmspage.service");
const { body, validationResult } = require("express-validator");

/*Create cms page */
exports.createCmspage = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var createCmspage = await CmspageService.createCmspage(req);
    return res
      .status(200)
      .json({ data: createCmspage, message: "Saved Successfully" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of creating cms page */

/*Edit cms page */
exports.editCmspage = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var editCmspage = await CmspageService.editCmspage(req);
    return res
      .status(200)
      .json({ data: editCmspage, message: "Updated Successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of cms page edit */

/*To get cmspage details */
exports.getCmspageDetails = async function (req, res, next) {
  try {
    var cmspageDetails = await CmspageService.getCmspageDetails(req);
    return res.status(200).json({ status: 200, data: cmspageDetails });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of cms page details */

/*To get cms page url */
exports.getCmspageUrl = async function (req, res, next) {
  try {
    var cmspageUrl = await CmspageService.getCmspageUrls(req);
    return res.status(200).json({ status: 200, data: cmspageUrl });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of cms page url */

exports.validate = (method) => {
  switch (method) {
    case "add-page": {
      return [
        body("page_name", "Page name is required").exists(),
        body("page_content", "Page Content is required").exists(),
      ];
    }
    case "edit-page": {
      return [
        body("page_name", "Page name is required").exists(),
        body("page_content", "Page Content is required").exists(),
      ];
    }
  }
};
