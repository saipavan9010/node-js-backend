var express = require("express");
var router = express.Router();
var AdminController = require("../controllers/admin.controller");
var RolesController = require("../controllers/roles.controller");
var DepartmentController = require("../controllers/department.controller");
var OrganisationController = require("../controllers/organisation.controller");
var WordController = require("../controllers/words.controller");
var CmspageController = require("../controllers/cmspage.controller");
var { roles_permissions } = require("../app/roles");
var { Authorization } = require("../auth/authorization");
var multer = require("multer");
var path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/words"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var audiostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/words"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var settingstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/settings"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });
var audio = multer({ storage: audiostorage });
var setting = multer({ storage: settingstorage });
var cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

var SettingUpload = setting.fields([
  { name: "site_logo", maxCount: 1 },
  { name: "title_logo", maxCount: 1 },
]);
var ImageUpload = upload.fields([{ name: "image", maxCount: 1 }]);
var audioUpload = audio.fields([{ name: "audio", maxCount: 1 }]);

var wordFileUpload = upload.fields([{ name: "word_file", maxCount: 1 }]);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("landing", { title: "Express" });
});

router.get("/language", function (req, res, next) {
  res.render("language", { name: "Express" });
});

// router.get("/email", function (req, res, next) {
//   res.render("email", { name: "Express" });
// });

/* Create Roles */
router.post(
  "/add/role",
  Authorization(),
  roles_permissions("add-role"),
  RolesController.validate("add-roles"),
  RolesController.createRole
);

/* End */

/* Roles Details */

router.get(
  "/roles/details",
  Authorization(),
  roles_permissions("role-list"),
  RolesController.getRoleDetails
);

/* End */

/*Edit Roles */

router.put(
  "/edit/roles",
  Authorization(),
  roles_permissions("edit-role"),
  RolesController.validate("edit-roles"),
  RolesController.editRoles
);

/* End  */

/*Get Particular Roles Detail*/

router.get(
  "/roles/detail/:role_id",
  Authorization(),
  roles_permissions("edit-role"),
  RolesController.roleDetail
);

/* End */

/* Create Organisation */
router.post(
  "/add/organisation",
  Authorization("add-organisation"),
  roles_permissions("add-organisation"),
  OrganisationController.validate("add-organisation"),

  OrganisationController.createOrganisation
);

/* End */

/* Organisation Details */

router.get(
  "/organisation/details",
  Authorization(),
  roles_permissions("organisation-list"),
  OrganisationController.getOrganisationDetails
);

/* End */

/*Edit Organisation */

router.put(
  "/edit/organisation",
  Authorization(),
  roles_permissions("edit-organisation"),
  OrganisationController.validate("edit-organisation"),
  OrganisationController.editOrganisation
);

/* End  */

/*Get Particular Roles Detail*/

router.get(
  "/organisation/detail/:organisation_id",
  Authorization(),
  roles_permissions("edit-organisation"),
  OrganisationController.organisationDetail
);

/* End  */
/* Create Departments */
router.post(
  "/add/department",
  Authorization(),
  roles_permissions("add-department"),
  DepartmentController.validate("add-departments"),

  DepartmentController.createDepartment
);

/* End */

/* Departments  Details */

router.get(
  "/department/details",
  Authorization(),
  roles_permissions("list-department"),
  DepartmentController.getDepartmentDetails
);

/* End  */

/*Edit Department */

router.put(
  "/edit/department",
  Authorization(),
  DepartmentController.validate("edit-department"),
  DepartmentController.editDepartment
);

/* End  */

/*Get Particular Department Detail*/

router.get(
  "/department/detail/:department_id",
  Authorization(),
  roles_permissions("edit-department"),
  DepartmentController.departmentDetail
);

/* End  */

/*Get Permission Details*/

router.get(
  "/permission/details",
  Authorization(),
  roles_permissions("add-departments"),
  DepartmentController.permissionDetails
);

/* End  */

/* Create Departments */
router.post(
  "/add/department",
  DepartmentController.validate("add-departments"),
  Authorization(),
  DepartmentController.createDepartment
);

/* End */

/* Departments  Details */

router.get(
  "/department/details",
  Authorization(),
  roles_permissions("list-department"),
  DepartmentController.getDepartmentDetails
);

/* End  */

/*Edit Department */

router.put(
  "/edit/department",
  Authorization(),
  roles_permissions("edit-department"),
  DepartmentController.validate("edit-department"),
  DepartmentController.editDepartment
);

/* End  */

/*Get Particular Department Detail*/

router.get(
  "/department/detail/:department_id",
  Authorization(),
  roles_permissions("edit-department"),
  DepartmentController.departmentDetail
);

/* End  */

/*Get Permission Details*/

router.get(
  "/permission/details",
  Authorization(),
  roles_permissions("add-departments"),
  DepartmentController.permissionDetails
);

/* End  */

/* Create registration for Admin */
router.post(
  "/registration",
  AdminController.validate("createUser"),
  AdminController.createUser
);
/*End of Regitration */

/*Admin Login */
router.post(
  "/login",
  AdminController.validate("Userlogin"),
  AdminController.loginUser
);
/* End of admin login*/

/*Admin List */
router.get("/list", Authorization(), AdminController.getUsers);
/*End of List */

/*Admin Logout */
router.get("/logout", Authorization(), AdminController.logout);
/*End of Logout */

/* Create Reset-Password */
router.post(
  "/reset-password",
  AdminController.validate("reset-forgot"),
  Authorization(),
  AdminController.resetPassword
);
/*Enfd of Reset-Password */

/*Reset-Password */
router.put(
  "/reset-password",
  AdminController.validate("reset-forgot"),
  Authorization(),
  AdminController.resetPassword
);
/*End of Reset-Password */

/*Create Words */
router.post(
  "/words/create",
  WordController.validate("add-word"),
  Authorization("tamil-word"),
  WordController.createWord
);
/*End of creating words */

/*Word-edit */
router.put(
  "/words/edit",
  cpUpload,
  WordController.validate("edit-word"),
  Authorization(),
  WordController.UpdateWord
);
/*End of word edit */

/*Individual word-edit */
router.put(
  "/words/individual/edit",
  Authorization(),
  cpUpload,
  WordController.validate("edit-word"),
  WordController.editWord
);
/*End of individual edit word */

/*Cms page adding */
router.post(
  "/cmspage/add",
  Authorization(),
  CmspageController.validate("add-page"),
  CmspageController.createCmspage
);
/*End of cms page adding */

/*cms page edit */
router.put(
  "/cmspage/edit/:id",
  Authorization(),
  CmspageController.validate("edit-page"),
  CmspageController.editCmspage
);
/*End of cms page edit */

/*cms page detail */
router.get("/cmspage/details/:page_name", CmspageController.getCmspageDetails);
/*End of cms page detail */

/*Getting list of words */
router.get("/words/list", Authorization(), WordController.getwordslist);
/*End of getting list of words */

/*Tracking of words */
router.get(
  "/word/track/:id",
  Authorization(),
  WordController.getwordtrackdetail
);
/*End of word tracking */

/*Word status */
router.post(
  "/word/status",
  Authorization(),
  WordController.validate("word-status"),
  WordController.Wordupdatestatus
);
/*End of word status */

/*File upload */
router.post(
  "/fileupload",
  wordFileUpload,
  Authorization(),
  WordController.fileupload
);
/*End of file upload */

/*File upload */
router.post(
  "/meaningupload",
  wordFileUpload,
  Authorization(),
  WordController.meaningupload
);
/*End of file upload */

/*Assign Words */
router.post(
  "/words/assign",
  Authorization(),
  WordController.validate("assign-words"),
  WordController.assignWords
);
/*End */

/*update English status */
router.put(
  "/englishword/update",
  Authorization(),
  roles_permissions("english-word"),
  WordController.validate("english-word"),
  WordController.englishWord
);
/*End */

/*update Meaning status */
router.put(
  "/meaning/update",
  Authorization(),
  roles_permissions("meanings-word"),
  // WordController.validate("meanings-word"),
  WordController.wordMeanings
);
/*End */

/*update Word Image status */
router.put(
  "/image/update",
  ImageUpload,
  Authorization(),
  roles_permissions("word-image"),
  WordController.validate("word-image"),
  WordController.wordImage
);
/*End */

/*update Word Audio Male status */
router.put(
  "/audio/male/update",
  audioUpload,
  Authorization(),
  roles_permissions("word-audio-male"),
  WordController.validate("word-audio-male"),
  WordController.wordAudiomale
);
/*End */

/*update Word Audio FeMale status */
router.put(
  "/audio/female/update",
  audioUpload,
  Authorization(),
  roles_permissions("word-audio-female"),
  WordController.validate("word-audio-female"),
  WordController.wordAudiofemale
);
/*End */

/*English Approval */
router.put(
  "/englishword/status",
  Authorization(),
  WordController.validate("word-status"),
  WordController.wordStatus
);
/*End */

/*Image Approval */
router.put(
  "/image/status",
  Authorization(),
  WordController.validate("word-status"),
  WordController.wordStatus
);
/*End */

/*Meaning Approval */
router.put(
  "/meaning/status",
  Authorization(),
  WordController.validate("word-status"),
  WordController.wordStatus
);
/*End */

/*Audio Male Approval */
router.put(
  "/audiomale/status",
  Authorization(),
  WordController.validate("word-status"),
  WordController.wordStatus
);
/*End */

/*Audio FeMale Approval */
router.put(
  "/audiofemale/status",
  Authorization(),
  WordController.validate("word-status"),
  WordController.wordStatus
);
/*End */

/*Overall Approval */
router.put(
  "/overall/level/status",
  Authorization(),
  WordController.validate("overalllevel-status"),
  WordController.overallStatus
);
/*End */

/*User List based on department */
router.get(
  "/departmentuser/list",
  Authorization(),
  AdminController.departmentUserList
);
/*End */

/*User List based on department */
router.post("/sample/upload", AdminController.sampleUpload);
/*End */

/*To get dashboard word counts */
router.get("/dashboard/data", Authorization(), WordController.StatusWordCount);
/*End of dashboard count words */

/*Word translation */
router.post("/translation", AdminController.translation);
/*End of word translation */

/*Getting list of admins */
router.get("/admin/userlists", Authorization(), AdminController.userList);
/*End of getting list of admins */

/*update list of admins */
router.put("/update/adminuser", Authorization(), AdminController.updateProfile);
/*End of update list of admins */

/*User details */
router.get("/admindetails", Authorization(), AdminController.getUserDetails);
/*End of user details */

/* Inactive status*/

router.post(
  "/user/updateStatus",
  Authorization(),
  AdminController.inactiveuser
);
/*End of inactive status */

/*Email  */
router.post(
  "/send/email",
  AdminController.validate("sendEmailComments"),
  Authorization(),
  AdminController.sendEmailComments
);
/*End of Email */

router.get(
  "/approved/wordList",
  Authorization(),
  WordController.approvedwordslist
);
/* Site Settings */

router.post(
  "/site/settings",
  SettingUpload,
  Authorization(),
  AdminController.sitesetting
);
/*End  */

/*Get Site Settings */

router.get("/site/settings", AdminController.sitesettinglist);
/*End  */

/*download excel */

router.get("/download/excels", Authorization(), WordController.exceldownload);
/*End  */

/*download excel */
/* Web Push */
router.post("/web/push", AdminController.webpush);
/*End  */

/* Overalldashboard */
router.get(
  "/overalladmin/dashboarddata",
  Authorization(),
  WordController.overalladmindata
);
/*End  */

/* Overalldashboard */
router.get("/words/update", WordController.wordsUpdate);
/*End  */

/* Overalldashboard */
router.get("/words/delete", WordController.wordsDelete);
/*End  */

/* Overalldashboard */
router.get(
  "/processwords/delete",

  WordController.processWordsDelete
);
/*End  */

/* Push Notification */
router.get("/app/pushnotification", Authorization(), AdminController.webpush);
/*End of push notification  */

module.exports = router;
