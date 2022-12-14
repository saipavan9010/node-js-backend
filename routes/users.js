var express = require("express");
var router = express.Router();
var UserController = require("../controllers/agarathi/user.controller");
var { userAuthorization } = require("../auth/authorization");
var CmspageController = require("../controllers/cmspage.controller");

/*User registration */
router.post(
  "/registration",
  UserController.validate("createUser"),
  UserController.createUser
);
/*End of User registration */

/*Uer Login */
router.post(
  "/login",
  UserController.validate("Userlogin"),
  UserController.loginUser
);
/*End of user login */

/*Get User list */
router.get("/list", userAuthorization(), UserController.getUsers);
/*End of user list */

/*Create Rate */
router.post("/rate_us", userAuthorization(), UserController.getRating);
/*End of Rate */

/*User details */
router.get("/details", userAuthorization(), UserController.getUserDetails);
/*End of user details */

/*User profile update */
router.put(
  "/update/profile",
  userAuthorization(),
  UserController.updateProfile
);
/*End of User profile update */

/*User Reset password */
router.put(
  "/reset-password",
  userAuthorization(),
  UserController.validate("reset-password"),
  UserController.resetPassword
);
/*End of reset password */

/*User forgot password */
router.post(
  "/forgot-password",
  UserController.validate("forgot-password"),
  UserController.forgotPassword
);
/*End of user forgot password */

/*Word search */
router.post(
  "/word/search",
  userAuthorization(),
  UserController.validate("word-search"),
  UserController.wordSearch
);
/*End of word search */

/*To get word detail by Id */
router.get(
  "/word/detail/:wordId",
  userAuthorization(),
  UserController.worddetail
);
/*End of word detail */

/*User Logout */
router.get(
  "/logout",
  userAuthorization(),
  UserController.validate("updateProfile"),
  UserController.logout
);
/*End of user logout */

/*Word of the day */
router.get("/wordofday", userAuthorization(), UserController.wordOfDay);
/*End of word of the day */

/*word of day detail */
router.get(
  "/wordofdaydetails",
  userAuthorization(),
  UserController.wordofdaydetails
);
/*End of word of the day detail */

/*User recent view for words */
router.get(
  "/userrecentview",
  userAuthorization(),
  UserController.userrecentview
);
/*End of recent view */

/*Featured data */
router.get("/featuredata", userAuthorization(), UserController.featuredata);
/*End of featured data */

/*Bookmark */
router.put(
  "/bookmark",
  userAuthorization(),
  UserController.validate("book-mark"),
  UserController.bookmark
);
/*End of bookmark */

/*Bookmark detail */
router.get(
  "/bookmark/details",
  userAuthorization(),
  UserController.bookmarkDetail
);
/*End of bookmark detail */

/*get total Bookmark detail */
router.get(
  "/totalbookmark/details",
  userAuthorization(),
  UserController.bookmarkDetails
);
/*End of total bookmark detail */

/*To post words in search */
router.post(
  "/search/words",
  userAuthorization(),
  UserController.validate("search-word"),
  UserController.searchword
);
/*End of serach words */

/*To get search word details */
router.get(
  "/search/words/detail",
  userAuthorization(),
  UserController.searchworddetail
);
/*End of search word details */

/*To remove word from search */
router.delete(
  "/remove/search/word",
  userAuthorization(),
  UserController.removesearchword
);
/*End of remobve words from search */

/* UnAuthorized Url before login */

router.get("/cmspage/url", CmspageController.getCmspageUrl);
router.get("/wordofday/details", UserController.unauthWordofdaydetails);
router.get("/unauth/word/detail/:wordId", UserController.unauthworddetail);
router.get("/feature/data", UserController.unauthfeaturedata);

/*OTP checking */
router.post(
  "/check/otp",
  UserController.validate("check-otp"),
  UserController.checkotp
);
/*End of otp checking */

/*Change password */
router.post(
  "/change/password",
  UserController.validate("change-password"),
  UserController.changepassword
);
/* End of chnage password */

/*App Version */
router.post("/addAppVersion", UserController.createVersion);
/*End*/

/* Updated Version */
router.put("/updateVersion", UserController.getVersion);
/* End */

/* Check Version */
router.get("/checkVersion", UserController.getAppVersion);
/* End */

/* Check Version */
router.get(
  "/update/language",
  userAuthorization(),
  UserController.updateLanguage
);
/* End */

module.exports = router;
