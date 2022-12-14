var AdminService = require("../services/admin.service")
var Admin = require("../models/admin.model")
const { body, validationResult } = require("express-validator")
const { Translate } = require("@google-cloud/translate").v2
const OneSignal = require("onesignal-node")

/*Create user */

exports.createUser = async function (req, res, next) {
	console.log(req.body)
	// Req.Body contains the form submit values.
	const errors = validationResult(req) // Finds the validation errors in this request and wraps them in an object with handy functions

	if (!errors.isEmpty()) {
		var error = errors.array()
		throw Error(error[0].msg)
	}

	var User = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		role: req.body.role,
		username: req.body.username,
		department: req.body.department,
		organisation: req.body.organisation,
	}
	try {
		// Calling the Service function with the new object from the Request Body
		var createdUser = await AdminService.createUser(User)
		return res.status(200).json({ data: createdUser, message: "Succesfully Created User" })
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End */

/*Login User */

exports.loginUser = async function (req, res, next) {
	// Req.Body contains the form submit values.
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		var error = errors.array()
		throw Error(error[0].msg)
	}
	var User = {
		username: req.body.username,
		password: req.body.password,
	}
	try {
		// Calling the Service function with the new object from the Request Body
		var loginUser = await AdminService.loginUser(User)
		return res.status(200).json({ data: loginUser, message: "Logged in successfully", status: 1 })
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End */

/*Get User */

exports.getUsers = async function (req, res, next) {
	// Check the existence of the query parameters, If doesn't exists assign a default value
	var page = req.query.page ? req.query.page : 1
	var limit = req.query.limit ? req.query.limit : 10
	try {
		var Users = await AdminService.getUsers({}, page, limit)
		// Return the Users list with the appropriate HTTP password Code and Message.
		return res.status(200).json({
			status: 200,
			data: Users,
			message: "Succesfully Users Recieved",
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}

/*End */

/* Department User List  */
exports.departmentUserList = async function (req, res, next) {
	try {
		var DepartmentUsers = await AdminService.departmentUserList(req)
		// Return the Users list with the appropriate HTTP password Code and Message.
		return res.status(200).json({
			status: 200,
			data: DepartmentUsers,
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}

/* END */

/* Sample Upload  */
exports.sampleUpload = async function (req, res, next) {
	try {
		// Return the Users list with the appropriate HTTP password Code and Message.
		return res.status(200).json({
			status: 200,
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}

/* END */

/*Reset password */

exports.resetPassword = async function (req, res, next) {
	try {
		const errors = validationResult(req)
		console.log(errors)

		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() })
			return
		}
		var Users = await AdminService.resetPassword(req)
		// Return the Users list with the appropriate HTTP password Code and Message.
		return res.status(200).json({
			status: 200,
			data: Users,
			message: "Password reset successfully",
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End */

/*Logout */

exports.logout = async function (req, res, next) {
	try {
		var Admins = await AdminService.logout(req)
		// Return the Users list with the appropriate HTTP password Code and Message.
		return res.status(200).json({
			status: 200,
			message: "Logged out successfully",
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End */

/*Translation */

exports.translation = async function (req, res, next) {
	try {
		// const translate = new Translate({
		//   projectId: "certain-region-265116",
		//   keyFilename: "certain-region-265116-8fd0bb73a719.json",
		// });
		// console.log("pavan");
		// const text = "a";
		// const target = "te";
		// var [translations] = await translate.translate(text, target);
		// console.log(translations);
		// console.log(`Text: ${text}`);
		// console.log(`Translation: ${translations}`);
		let googleTransliterate = require("google-input-tool")
		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

		let sourceText = req.body.word
		let inputLanguage = "ta-t-i0-und"
		let maxResult = 8
		let request = new XMLHttpRequest()

		googleTransliterate(request, sourceText, inputLanguage, maxResult).then(function (response) {
			return res.status(200).json({ status: 200, data: [...new Set(response)] })
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End */

/*Validate */
exports.validate = (method) => {
	//console.log(method);
	switch (method) {
		case "createUser": {
			return [
				body("username", "username is required").exists(),
				body("email", "Invalid email").exists().isEmail(),
				body("password").exists(),
				body("role").exists(),
			]
		}
		case "Userlogin": {
			return [
				body("username", "username is required").exists(),
				body("password", "password is required").exists(),
			]
		}
		case "sendEmailComments": {
			return [
				body("To", "Email To is required").exists(),
				body("Subject", "Subject is required").exists(),
				body("Message", "Message is required").exists(),
			]
		}
		case "reset-forgot": {
			return [
				body("old_password", "Old Password is required").exists(),
				body("new_password", "New Password is required").exists(),
				body("new_password", "New password is Old and New Password should not be same")
					.exists()
					.custom((value, { req }) => value != req.body.old_password),
			]
		}
	}
}
/*End */

/*UserList */
exports.userList = async function (req, res) {
	try {
		// Calling the Service function with the new object from the Request Body
		var userLists = await AdminService.userList(req)
		//console.log( userLists);
		return res.status(200).json({ data: userLists, message: "UserList", status: 1 })
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End */

/*Profile update */
exports.updateProfile = async function (req, res) {
	try {
		// Calling the Service function with the new object from the Request Body
		var updateProfile = await AdminService.updateProfile(req)
		return res.status(200).json({ data: updateProfile, message: "Profile updated successfully" })
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End of profile update */

/*User details */
exports.getUserDetails = async function (req, res) {
	console.log(req)
	try {
		var userDetails = await AdminService.getUserDetails(req)
		// Return the Users list with the appropriate HTTP password Code and Message.
		return res.status(200).json({
			status: 200,
			data: userDetails,
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}
/*End of user details */

/*Account status */
exports.inactiveuser = async function (req, res) {
	try {
		// Calling the Service function with the new object from the Request Body
		var userLists = await AdminService.getInactiveUser(req)
		//console.log( userLists);
		return res.status(200).json({
			data: userLists,
			message: "Status Updated Successfully",
			status: 1,
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}

/*End of account tatus */

/*Send email */
exports.sendEmailComments = async function (req, res) {
	try {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			var error = errors.array()
			throw Error(error[0].msg)
		}

		// Calling the Service function with the new object from the Request Body
		var userLists = await AdminService.sendemailstatus(req)
		//console.log( userLists);
		return res.status(200).json({ data: userLists, message: "Email sent successfully", status: 1 })
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.

		return res.status(400).json({ status: 400, message: e.message })
	}
}

/*End of email send */

/* Site Setting  */
exports.sitesetting = async function (req, res) {
	try {
		// Calling the Service function with the new object from the Request Body
		var siteSettings = await AdminService.sitesetting(req)
		//console.log( userLists);
		return res.status(200).json({
			data: siteSettings,
			message: "Added Sucessfully",
			status: 1,
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}

/*End of Site Setting  */

/* Get Site Setting  */
exports.sitesettinglist = async function (req, res) {
	try {
		// Calling the Service function with the new object from the Request Body
		var siteSettingsdata = await AdminService.sitesettinglist(req)
		//console.log( userLists);
		return res.status(200).json({
			data: siteSettingsdata,
		})
	} catch (e) {
		//Return an Error Response Message with Code and the Error Message.
		return res.status(400).json({ status: 400, message: e.message })
	}
}

/*End of Site Setting  */

/* Web push  */
exports.webpush = async function (req, res) {
	try {
		// using async/await
		const client = new OneSignal.Client(
			"c670ff59-af19-426c-8546-f83f864028c5",
			"MjJiZjk2MTYtZWJlOS00YTY5LTg4MGUtYmM5M2E1ODZlOWI5"
		)
		const notification = {
			contents: {
				tr: "Yeni bildirim",
				en: "New notification",
			},
			included_segments: ["Subscribed Users"],
			filters: [{ field: "tag", key: "level", relation: ">", value: 10 }],
		}

		const response = await client.createNotification(notification)
		console.log(response)
	} catch (e) {
		if (e instanceof OneSignal.HTTPError) {
			// When status code of HTTP response is not 2xx, HTTPError is thrown.
			console.log(e.statusCode)
			console.log(e.body)
		}
	}
}
