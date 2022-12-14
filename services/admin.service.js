var User = require("../models/admin.model");
var siteSettings = require("../models/sitesettings.model");
var processword = require("../models/processword.model");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const nodemailer = require("nodemailer");
const SiteSettings = require("../models/sitesettings.model");
//const { Model } = require("mongoose");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//var ObjectId = require("mongodb").ObjectID;

exports.createUser = async function (user) {
  // Creating a new Mongoose Object by using the new keyword
  var hashedPassword = bcrypt.hashSync(user.password, 8);
  var newUser = new User({
    name: user.name.toString().toLowerCase(),
    email: user.email.toString().toLowerCase(),
    date: new Date(),
    role: user.role.toString().toUpperCase(),
    password: hashedPassword,
    username: user.username.toString().toLowerCase(),
    department: user.department.toString().toUpperCase(),
    organisation: user.organisation.toString().toUpperCase(),
    status: user.status,
  });

  try {
    // Saving the User

    var existsUser = User.find({
      username: user.username.toString().toLowerCase(),
    });
    var existsMail = User.find({
      email: user.email.toString().toLowerCase(),
    });

    if ((await existsUser) != "") {
      throw Error("Username already exists");
    }

    if ((await existsMail) != "") {
      throw Error("Email already exists");
    }

    if (
      user.department.toString().toUpperCase() == "ENGLISH" &&
      user.role == "APPROVER"
    ) {
      var existsEnglishApprover = User.find({
        department: "ENGLISH",
        role: "APPROVER",
        status: "Active",
      });
      if ((await existsEnglishApprover) != "") {
        throw Error("English Approver already exists");
      }
    }

    if (user.department.toString().toUpperCase() == "AUDIOMALE") {
      var existsAudioMale = User.find({
        department: "AUDIOMALE",
        role: "USER",
        status: "Active",
      });
      if ((await existsAudioMale) != "") {
        throw Error("Audio Male already exists");
      }
    }

    if (user.department.toString().toUpperCase() == "AUDIOFEMALE") {
      var existsAudioFeMale = User.find({
        department: "AUDIOFEMALE",
        role: "USER",
        status: "Active",
      });
      if ((await existsAudioFeMale) != "") {
        throw Error("Audio Female already exists");
      }
    }

    var savedUser = await newUser.save();
    var token = jwt.sign({ admin: savedUser }, process.env.SECRET, {
      expiresIn: 86400, // expires in 24 hours
    });
    return token;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};

exports.loginUser = async function (user) {
  // Creating a new Mongoose Object by using the new keyword
  try {
    // Find the User
    var _details = await User.findOne({ username: user.username });
    var settings = await SiteSettings.find();

    if (!_details) throw Error("Invalid username or pasword");
    var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
    if (!passwordIsValid) throw Error("Invalid username/password");
    if (_details.status != "Active") {
      throw Error("This account has been deactivated");
    }
    var token = jwt.sign({ admin: _details }, process.env.SECRET, {
      expiresIn: 8640000,
    });
    _details.toJSON({ hide: "password" });

    return { token: token, admindetails: _details, settings: settings };
  } catch (e) {
    console.log(e);
    // return a Error message describing the reason
    throw Error(e);
  }
};

exports.getUsers = async function (query, page, limit) {
  // Options setup for the mongoose paginate
  var options = {
    page,
    limit,
  };
  // Try Catch the awaited promise to handle the error
  try {
    var Users = await User.find({});
    // Return the Userd list that was retured by the mongoose promise
    return Users;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};

/* Department User List */

exports.departmentUserList = async function (req) {
  try {
    var department = req.admindetails.department;

    if (department == "AUDIO") {
      var condition = {
        department: { $in: ["AUDIOMALE", "AUDIOFEMALE"] },
        status: "Active",
      };
    } else {
      var condition = {
        department: req.admindetails.department,
        role: "USER",
        status: "Active",
      };
    }
    var users = await User.find(condition);

    var userData = await User.aggregate([
      {
        $match: condition,
      },
      {
        $lookup: {
          from: "processwords",
          localField: "_id",
          foreignField: "user_id", // field in the items collection
          as: "processwords",
        },
      },

      { $unwind: "$processwords" },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          wordCount: { $sum: 1 },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                _id: "$_id",
                name: "$doc.name",
                username: "$doc.username",
                department: "$doc.department",
                wordCount: "$wordCount",
                status: "$status",
              },
            ],
          },
        },
      },
    ]);
    var data = [];
    if (userData.length != users.length) {
      users.forEach(function (val) {
        var user_exist = userData.find(function (user) {
          return user.username == val.username;
        });
        if (user_exist) {
          data.push(user_exist);
        } else {
          var obj = {
            _id: val._id,
            name: val.name,
            username: val.username,
            department: val.department,
            wordCount: 0,
          };
          data.push(obj);
        }
      });
      return data;
    } else {
      return userData;
    }
  } catch (e) {
    throw Error(e);
  }
};

/* END */

/*reset password */

exports.resetPassword = async function (req) {
  try {
    var passwordIsValid = bcrypt.compareSync(
      req.body.old_password,
      req.admindetails.password
    );
    if (!passwordIsValid) throw Error("Password is incorrect");
    var hashedPassword = bcrypt.hashSync(req.body.new_password, 8);
    var Users = await User.updateOne(
      { _id: req.admindetails._id },
      { password: hashedPassword }
    );
    req.admindetails.password = hashedPassword;
    var decode = jwt.decode(req.admindetails, process.env.SECRET);
    return Users;

    // Return the Userd list that was retured by the mongoose promise
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};

/* End */

/*Logout */
exports.logout = async function (req) {
  try {
    const token = req.header("authorization");
    if (!req.session.admintoken) {
      req.session.admintoken = {};
    }
    req.session.admintoken[token] = token;

    return req.session.admintoken;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End */

/*Admin user list */
exports.userList = async function (req) {
  try {
    var department = req.admindetails.department;
    var condition;

    if (req.admindetails.department == "AUDIO") {
      condition = { department: { $in: ["AUDIOMALE", "AUDIOFEMALE"] } };
    } else if (req.admindetails.department == "OVERALLADMIN") {
      condition = {};
    } else {
      condition = { department: req.admindetails.department, role: "USER" };
    }

    var myAggregate = User.aggregate([
      { $match: condition },
      // { $match: searchvalue },
    ]);

    // var results = User.find({"username": {$regex:req.querysearch}});
    //var results = User.aggregatePaginate(myAggregate);
    return myAggregate;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};

/*End of admin lists */

/*Profile update */
exports.updateProfile = async function (req) {
  try {
    var email_exit = await User.aggregate([
      {
        $match: { _id: { $ne: mongoose.Types.ObjectId(req.body.id) } },
      },
      { $match: { email: req.body.email } },
    ]);
    if (email_exit.length > 0) {
      throw Error("Email is Already Exist");
    }
    var username_exit = await User.aggregate([
      {
        $match: { _id: { $ne: mongoose.Types.ObjectId(req.body.id) } },
      },
      { $match: { username: req.body.username } },
    ]);
    if (username_exit.length > 0) {
      throw Error("Username is Already Exist");
    }
    const user = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.id),
    });
    
    if (req.body.password && req.body.password == "")
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    else var hashedPassword = "";
    //return user;
      (user.username = req.body.username),
      (user.name = req.body.name),
      (user.email = req.body.email),
      (user.role = req.body.role.toString().toUpperCase()),
      (user.password = hashedPassword == "" ? user.password : hashedPassword),
      (user.organisation = req.body.organisation.toString().toUpperCase()),
      (user.department = req.body.department.toString().toUpperCase());
      (user.status = req.body.status);
    var UpdatedUser = await user.save();
    
    return UpdatedUser;

  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of profile update */

// /*Getting of user details */
// exports.getUserDetails = async function (req) {
//   Try Catch the awaited promise to handle the error
//   try {
//     const Users = await User.findOne({ _id: req.body.id }).lean();
//     delete Users.password;
//     Return the Userd list that was retured by the mongoose promise
//     return Users;
//   } catch (e) {
//     return a Error message describing the reason
//     throw Error(e);
//   }
// };
// /*End of getting user details */

/*Getting of user details */
exports.getUserDetails = async function (req) {
  // Try Catch the awaited promise to handle the error
  try {
    var user = new mongoose.Types.ObjectId(req.query.id[0]);

    var obj = [];

    req.query.id.forEach((element) => {
      obj.push(mongoose.Types.ObjectId(element));
    });

    const Users = await User.aggregate([{ $match: { _id: { $in: obj } } }]);

    console.log(Users);
    delete Users.password;
    // Return the Userd list that was retured by the mongoose promise
    return Users;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};
/*End of getting user details */

// /*Getting of user details */
// exports.getUserDetails = async function (req) {
//   // Try Catch the awaited promise to handle the error
//   try {

//     const Users = await User.aggregate({

//     })
//     delete Users.password;
//     // Return the Userd list that was retured by the mongoose promise
//     return Users;
//   } catch (e) {
//     // return a Error message describing the reason
//     throw Error(e);
//   }
// };
// /*End of getting user details */

/* User active update status */
exports.getInactiveUser = async function (req) {
  try {
    var status =
      req.body.status.charAt(0).toUpperCase() +
      req.body.status.slice(1).toLowerCase();

    if (!(status == "Active" || status == "Inactive")) {
      throw Error("Account should be active or inactive");
    }

    const Users = await User.update(
      { _id: req.body.id },
      { $set: { status: status } }
    );

    return Users;
  } catch (e) {
    throw Error(e);
  }
};

/* End of User active update status */

/*Send email */

exports.sendemailstatus = async function (req) {
  try {
    /*Transport service is used by node mailer to send emails, it takes service and auth object as parameters.
here we are using gmail as our service
In Auth object , we specify our email and password
*/
    
    var settingdata = await siteSettings.findOne({"site_info":Array});
    console.log(settingdata);
    //console.log(settingdata.siteinfo.email);
//     if (settingdata) {
//       console.log(1);
//       var siteinfo = null;
//       if(settingdata.siteinfo[0]){
//         settingdata.siteinfo[0];
//       }
    
// console.log(siteinfo);

      var email = siteinfo.email ? siteinfo.email : "jeganpal1995@gmail.com";
      var password = siteinfo.password ? siteinfo.password : "jeganjoo@95"; 
      
    //}
   
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email, //replace with your email
        pass: password, //replace with your password
      },
    });

    /*
In mailOptions we specify from and to address, subject and HTML content.
In our case , we use our personal email as from and to address,
Subject is Contact name and
html is our form details which we parsed using bodyParser.
*/

    var strMailCC = "";
    var strMailBCC = "";
    var Ccs = req.body.Cc;
    var BCcs = req.body.BCc;

    if (Ccs != undefined) {
      strMailCC = Ccs.join(";");
    }

    if (BCcs != undefined) {
      strMailBCC = BCcs.join(";");
    }

    var mailOptions = {
      from: email, //replace with your email
      to: req.body.To, //replace with your email
      cc: strMailCC,
      bcc: strMailBCC,
      subject: req.body.Subject,
      html: `
  <p>${req.body.Message} </p><br>`,
    };
 console.log(mailOptions)
    /*
 Here comes the important part, sendMail is the method which actually sends email, it takes mail options and
call back as parameter
*/
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return error; // if error occurs send error as response to client
      } else {
        console.log("Email sent: " + info.response);
        return "Sent Successfully"; //if mail is sent successfully send Sent successfully as response
      }
    });
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e);
  }
};

/*End of email send */

/* Add Site Setting */
exports.sitesetting = async function (req) {
  try {
    var data = [];
    data.push(req.body);
    if (req.body.id == "undefined") {
      var Settings = new siteSettings({
        site_info: data,
        site_logo:
          req.files.site_logo && req.files
            ? "settings/" + req.files.site_logo[0].filename
            : "",
        title_logo:
          req.files.title_logo && req.files
            ? "settings/" + req.files.title_logo[0].filename
            : "",
      });
      var settingdata = await Settings.save();
    } else {
      //console.log("pavan");
      var settinglist = await siteSettings.findOne({ _id: req.body.id });

      // return settinglist;
      settinglist.site_info = data;
      if (req.files.site_logo && req.files) {
        settinglist.site_logo = "settings/" + req.files.site_logo[0].filename;
      }
      if (req.files.title_logo && req.files) {
        settinglist.title_logo = "settings/" + req.files.title_logo[0].filename;
      }

      var settingdata = await settinglist.save();
    }

    return settingdata;
  } catch (e) {
    throw Error(e);
  }
};

/* End */

/* Get Site Setting */
exports.sitesettinglist = async function (req) {
  try {
    var settingdata = await siteSettings.findOne();
    return settingdata;
  } catch (e) {
    throw Error(e);
  }
};

/* End */
