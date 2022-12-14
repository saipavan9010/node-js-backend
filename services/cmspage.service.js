var Cmspage = require("../models/cmspage.model");

/*Creating cms page */
exports.createCmspage = async function (req) {
  try {
    if (req.body.id == "") {
      var Cmspages = new Cmspage({
        page_name: req.body.page_name,
        page_content: req.body.page_content,
      });
      var savedCmspage = await Cmspages.save();
    } else {
      const cmspagedetails = await Cmspage.findOne({ _id: req.body.id });
      console.log(cmspagedetails);
      if (cmspagedetails) {
        cmspagedetails.page_name = req.body.page_name;
        cmspagedetails.page_content = req.body.page_content;
      } else {
        throw Error("Page Details Not Found");
      }
      var savedCmspage = await cmspagedetails.save();
    }

    return savedCmspage;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of creating cms page */

/*edit cms page  */
exports.editCmspage = async function (req) {
  try {
    const page_name = req.page_name;
    console.log(page_name);
    const cmspagedetails = await Cmspage.findOne({ page_name: page_name });
    if (cmspagedetails.length != 0) {
      cmspagedetails.page_name = req.body.page_name;
      cmspagedetails.page_content = req.body.page_content;
    } else {
      throw Error("Page Details Not Found");
    }
    const updatedCmspage = await cmspagedetails.save();
    return updatedCmspage;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of cmd page */

/*Getting cms page details */
exports.getCmspageDetails = async function (req) {
  try {
    const page_name = req.params.page_name;
    console.log(page_name);
    const cmspagedetails = await Cmspage.findOne({ page_name: page_name });
    if (cmspagedetails.length == 0) {
      throw Error("Page Details Not Found");
    }
    return cmspagedetails;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of edit cms page */

/*Getting cms page url */
exports.getCmspageUrls = async function (req) {
  try {
    const page_url = await req.query.page_url;

    var page_Urls = ["about-us", "privacy-policy"];
    if (page_Urls.find((element) => element == page_url)) {
      return { url: process.env.CMS_PAGE_URL + "/" + page_url };
    } else {
      throw Error("Page Details Not Found");
    }

    return cmspagedetails;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of cms page url */