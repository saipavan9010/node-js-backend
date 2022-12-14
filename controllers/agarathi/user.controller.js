var UserService = require("../../services/agarathi/user.service");
var WordService = require("../../services/word.service");
var enlan = require("../../language/en");
var tnlan = require("../../language/tn");

const { body, validationResult, Result } = require("express-validator");

/*User registration */
exports.createUser = async function (req, res, next) {
  // Req.Body contains the form submit values.
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }

    var User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      mobile_no: req.body.mobile_no,
      gender: req.body.gender,
      password: req.body.password,
      language: req.body.language.toUpperCase(),
    };

    // Calling the Service function with the new object from the Request Body
    var createdUser = await UserService.createUser(User);

    if (User.language.toUpperCase() == "ENGLISH") {
      var message = enlan.languagedata.createuser;
    } else {
      var message = tnlan.languagedata.createuser;
    }

    return res.status(200).json({ data: createdUser, message: message });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of user registration */

/*User login */
exports.loginUser = async function (req, res, next) {
  // Req.Body contains the form submit values.
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var User = {
      email: req.body.email,
      password: req.body.password,
      language: req.body.language.toUpperCase(),
    };

    // Calling the Service function with the new object from the Request Body

    //console.log(JSON.stringify(User));

    var loginUser = await UserService.loginUser(User);
    if (User.language.toUpperCase() == "ENGLISH") {
      var message = enlan.languagedata.createuser;
    } else {
      var message = tnlan.languagedata.createuser;
    }
    return res
      .status(200)
      .json({ data: loginUser, message: message, status: 1 });
  } catch (e) {
    //console.log(JSON.stringify(e));
    //Return an Error Response Message with Code and the Error Message.
    return res.status(500).json({
      error: e,
      message: e.message,
      status: 0,
    });
  }
};
/*End of User login */

/*Retrieve Users */
exports.getUsers = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  try {
    var Users = await UserService.getUsers(req);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Users,
      message: "Succesfully Users Recieved",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of retrieve users */

/*User details */
exports.getUserDetails = async function (req, res, next) {
  try {
    var userDetails = await UserService.getUserDetails(req);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: userDetails,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of user details */

/*Profile update */
exports.updateProfile = async function (req, res, next) {
  // Req.Body contains the form submit values.
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    // Calling the Service function with the new object from the Request Body
    var updateProfile = await UserService.updateProfile(req);
    if (updateProfile == "ENGLISH") {
      var message = enlan.languagedata.createuser;
    } else {
      var message = tnlan.languagedata.createuser;
    }

    return res.status(200).json({ data: updateProfile, message: message });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of profile update */

/*Reset password */
exports.resetPassword = async function (req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var Users = await UserService.resetPassword(req);
    const language = Users.language;
    if (language.toUpperCase() == "ENGLISH") {
      var message = enlan.languagedata.password_updated;
    } else {
      var message = tnlan.languagedata.password_updated;
    }
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Users,
      message: message,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of reset password */

/*Forgot password */
exports.forgotPassword = async function (req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var Users = await UserService.forgotPassword(req);
    var mail = req.body.email.substr(0, 3);
    var com = req.body.email.split("@");
    var language = req.body.language;

    if (language.toUpperCase() == "ENGLISH") {
      var message = enlan.languagedata.otpsent;
    } else {
      var message = tnlan.languagedata.otpsent;
    }

    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Users,
      message: message + " (" + mail + "*****" + com[1] + ")",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of forgot password */

/*OTP Checking */
exports.checkotp = async function (req, res, next) {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var data = await UserService.checkotp(req);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of OTP checking */

/*Change password */
exports.changepassword = async function (req, res, next) {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var data = await UserService.changepassword(req);
    const language = req.body.language;
    if (language.toUpperCase() == "ENGLISH") {
      var message = enlan.languagedata.password_updated;
    } else {
      var message = tnlan.languagedata.password_updated;
    }
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: data,
      message: message,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of Change password */

/*User Logout */
exports.logout = async function (req, res, next) {
  try {
    var User = await UserService.logout(req);
    if (User.language == "ENGLISH") {
      var message = enlan.languagedata.logout;
    } else {
      var message = tnlan.languagedata.logout;
    }
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      message: message,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of user logout */

/*Word search */
exports.wordSearch = async function (req, res, next) {
  try {
    var Words = await WordService.wordSearch(req);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Words,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word search */

/*Word details */
exports.worddetail = async function (req, res, next) {
  try {
    var Word_detail = await WordService.wordDetail(req);

    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      data: Word_detail,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word details */

/*Word of the day */
exports.wordOfDay = async function (req, res, next) {
  try {
    var Word_of_day = await WordService.wordOfDay(req);

    return res.status(200).json({
      data: Word_of_day,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word of the day */

/*Word of the day details */
exports.wordofdaydetails = async function (req, res, next) {
  try {
    var wordofdaydetails = await WordService.wordofdaydetails(req);

    return res.status(200).json({
      data: wordofdaydetails,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word of the day details */

/*Word details for unauthorization */
exports.unauthworddetail = async function (req, res, next) {
  try {
    var wordofdaydetails = await WordService.unauthworddetail(req);

    return res.status(200).json({
      data: wordofdaydetails,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of unauth word details */

/*word of trhe day for unauth */
exports.unauthWordofdaydetails = async function (req, res, next) {
  try {
    var wordofdaydetails = await WordService.unauthWordofdaydetails(req);

    return res.status(200).json({
      data: wordofdaydetails,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of unauth word of the day */

/*User recent view */
exports.userrecentview = async function (req, res, next) {
  try {
    var userrecentview = await WordService.userrecentview(req);

    return res.status(200).json({
      data: userrecentview,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of user recent view */

/*featured data */
exports.featuredata = async function (req, res, next) {
  try {
    var featuredata = await WordService.featuredata(req);
    return res.status(200).json({
      data: featuredata,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of featured data */

/*Featured data for unauth */
exports.unauthfeaturedata = async function (req, res, next) {
  try {
    var featuredata = await WordService.unauthfeaturedata(req);
    return res.status(200).json({
      data: featuredata,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of unauth featured data */

/*Bookmark */
exports.bookmark = async function (req, res, next) {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var bookmark = await WordService.bookmark(req);

    return res.status(200).json({
      data: bookmark,
      message: "BookMark is Updated",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of bookmark */

/*Bookmark details */
exports.bookmarkDetail = async function (req, res, next) {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var bookmark = await WordService.bookmarkDetail(req);

    return res.status(200).json({
      data: bookmark,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of bookmark details */

/*total Bookmark details */
exports.bookmarkDetails = async function (req, res, next) {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var bookmarks = await WordService.bookmarkDetails(req);

    return res.status(200).json({
      data: bookmarks,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of total bookmark details */

/*Serach word */
exports.searchword = async function (req, res, next) {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var searchwordData = await UserService.searchword(req);

    return res.status(200).json({
      data: searchwordData,
      message: "Saved sucessfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of search words */

/*Serach word details */
exports.searchworddetail = async function (req, res, next) {
  try {
    var searchwordData = await UserService.searchworddetail(req);

    return res.status(200).json({
      data: searchwordData,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of search word details */

/*Remove search words */
exports.removesearchword = async function (req, res, next) {
  try {
    var removeSearchwordData = await UserService.removesearchword(req);

    return res.status(200).json({
      message: removeSearchwordData,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of search words remove */

exports.getRating = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = errors.array();
    throw Error(error[0].msg);
  }

  try {
    var createRate = await UserService.createRating(req);
    return res
      .status(200)
      .json({ data: createRate, message: "Thanks for your feedback" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e });
  }
};

exports.createVersion = async function (req, res, next) {
  try {
    var createversion = await UserService.createVersion(req);
    return res
      .status(200)
      .json({ data: createversion, message: "Version Saved Successfully" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getVersion = async function (req, res, next) {
  try {
    var getversion = await UserService.updateVersion(req);

    return res.status(200).json({ data: getversion });
  } catch (e) {
    return res.status(400).json({ status: e.message });
  }
};

exports.getAppVersion = async function (req, res, next) {
  try {
    var getappversion = await UserService.getAppVersion(req);

    return res.status(200).json({ data: getappversion });
  } catch (e) {
    return res.status(400).json({ status: e.message });
  }
};

/*  Update langauge */
exports.updateLanguage = async function (req, res) {
  try {
    var data = await UserService.updateLanguage(req);
    var language = req.query.language;
    return res.status(200).json({
      message:
        "Language file is switched to " +
        language.charAt(0).toUpperCase() +
        language.slice(1),
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*validation*/
exports.validate = (method) => {
  switch (method) {
    case "createUser": {
      return [
        body("email", "email is required").exists(),
        body("email", "Please enter a Valid Mail").isEmail(),
        body("password", "password is required").exists(),
        body("language", "langauge is required").exists(),
        body("password", "password should conatins 8 letters").isLength({
          min: 8,
        }),
        body(
          "password",
          "password should not be greater than 15 letters"
        ).isLength({ max: 15 }),
        body(
          "password",
          " Password must contain at least one upper case"
        ).matches("(?=.*?[A-Z])"),
        body("password", " Password must contain at least one digit").matches(
          "(?=.*?[0-9])"
        ),
        body(
          "password",
          " Password must contain at least one special character"
        ).matches("(?=.*?[#?!@$%^&*-])"),
        body("conform_password", "Conform password is required").exists(),
        body("password", "Password didn't match")
          .exists()
          .custom((value, { req }) => value == req.body.conform_password),
      ];
    }
    case "Userlogin": {
      return [
        body("email", "Please enter your email").exists(),
        body("password", "Please enter your password").exists(),
        body("language", "language is required").exists(),
        //body("password", "Wrong password. Try again or click Forgot password to reset it").exists(),
      ];
    }
    case "updateProfile": {
      return [body("email", "email is required").exists()];
    }
    case "forgot-password": {
      return [
        body("email", "email is required").exists(),
        body("language", "langauge is required").exists(),
      ];
    }
    case "reset-password": {
      return [
        body("old_password", "Old Password is required").exists(),
        body("new_password", "New Password is required").exists(),
        body(
          "new_password",
          "New password should conatins 8 letters"
        ).isLength({ min: 8 }),
        body(
          "new_password",
          "New password should not be greater than 15 letters"
        ).isLength({ max: 15 }),
        body(
          "new_password",
          " New Password must contain at least one upper case"
        ).matches("(?=.*?[A-Z])"),
        body(
          "new_password",
          " New Password must contain at least one digit"
        ).matches("(?=.*?[0-9])"),
        body(
          "new_password",
          " New Password must contain at least one special character"
        ).matches("(?=.*?[#?!@$%^&*-])"),
        body(
          "new_password",
          "Old password  and New Password should not be same"
        )
          .exists()
          .custom((value, { req }) => value != req.body.old_password),
      ];
    }
    case "word-search": {
      return [body("word_name", "word name is required").exists()];
    }
    case "book-mark": {
      return [
        body("word_id", "word Id is required").exists(),
        body("bookmark", "Bookmark Field is required").exists(),
      ];
    }
    case "change-password": {
      return [
        body("email", "email is required").exists(),
        body("language", "language is required").exists(),
        body("password", "password is required").exists(),
        body("password", "password should conatins 8 letters").isLength({
          min: 8,
        }),
        body(
          "password",
          "password should not be greater than 15 letters"
        ).isLength({ max: 15 }),
        body(
          "password",
          " Password must contain at least one upper case"
        ).matches("(?=.*?[A-Z])"),
        body("password", " Password must contain at least one digit").matches(
          "(?=.*?[0-9])"
        ),
        body(
          "password",
          " Password must contain at least one special character"
        ).matches("(?=.*?[#?!@$%^&*-])"),
        body("conform_password", "Conform password is required").exists(),
        body("password", "Password is not match")
          .matches()
          .custom((value, { req }) => value == req.body.conform_password),
      ];
    }
    case "check-otp": {
      return [
        body("email", "email is required").exists(),
        body("email", "Please enter a Valid Mail").matches(),
        body("otp", "Otp is required").exists(),
        body("language", "language is required").exists(),
      ];
    }
    case "search-word": {
      return [
        body("tamil_word", "Tamil Word is required").exists(),
        body(
          "tamil_word",
          "Tamil word should contain mininum length 1"
        ).isLength({ min: 1 }),
        body("word_id", "Word Id is required").exists(),
        body("word_id", " Word id should contain mininum length 1").isLength({
          min: 1,
        }),
      ];
    }
  }
};
/*End of validation*/
