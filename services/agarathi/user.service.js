var User = require("../../models/agarathi/user.model")
var Userotp = require("../../models/agarathi/authotp.model")
var UserSearch = require("../../models/agarathi/usersearchdata.model")
var Rating = require("../../models/agarathi/rating")
var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { createUser } = require("../../controllers/agarathi/user.controller")
var ejs = require("ejs")
var path = require("path")
const mongoose = require("mongoose")
var ObjectId = require("mongodb").ObjectID
const { get } = require("request")
var AppVersions = require("../../models/agarathi/version")
var enlan = require("../../language/en")
var tnlan = require("../../language/tn")

/*Create user */
exports.createUser = async function (user) {
	// Creating a new Mongoose Object by using the new keyword
	var email = user.email
	var hashedPassword = bcrypt.hashSync(user.password, 10)
	var newUser = new User({
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email.toString().toLowerCase(),
		mobile_no: user.mobile_no,
		gender: user.gender,
		dob: user.dob,
		password: hashedPassword,
		language: user.language,
	})

	try {
		var name = user.first_name + " " + user.last_name
		var existsMail = User.find({
			email: user.email.toString().toLowerCase(),
		})
		if ((await existsMail) != "") {
			throw Error("Already registered email, try another")
		}
		// Saving the User
		var savedUser = await newUser.save()

		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: "cdp.cosmicconsultancy@gmail.com",
				pass: "cdp1234*",
			},
			tls: { rejectUnauthorized: false },
		})
		var imagepath = path.join(__dirname, "../../views")
		//ssconsole.log(imagepath)
		var data_file = await ejs.renderFile(imagepath + "/email.ejs", {
			name: name,
		})

		// send mail with defined transport object
		let info = transporter.sendMail({
			from: "cdp.cosmicconsultancy@gmail.com", // sender address
			subject: "Welcome To Agarathi", // Subject line
			to: email,
			html: data_file,
		})

		return savedUser
	} catch (e) {
		// return a Error message describing the reason

		throw Error(e)
	}
}
/*End of creating users */

/*User login */
exports.loginUser = async function (user) {
	// Creating a new Mongoose Object by using the new keyword
	try {
		// Find the User
		var _details = await User.findOne({
			email: user.email.toString().toLowerCase(),
		})
		//console.log(_details);
		if (!_details) throw Error("Not a registered account, Please signup")
		var passwordIsValid = bcrypt.compareSync(user.password, _details.password)
		if (!passwordIsValid) throw Error("Invalid username/password")
		var token = jwt.sign({ user: _details }, process.env.SECRET, {
			expiresIn: 8640000, // expires in 24 hours
		})
		_details.language = user.language
		_details.save()
		_details.toJSON({ hide: "password" })

		return { token: token, userDetails: _details }
	} catch (e) {
		//console.log(e);
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of user login */

/*Getting users */
exports.getUsers = async function (query, page, limit) {
	// Options setup for the mongoose paginate
	var options = {
		page,
		limit,
	}
	// Try Catch the awaited promise to handle the error
	try {
		var Users = await User.find({})
		// Return the Userd list that was retured by the mongoose promise
		return Users
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of get users */

/*Getting of user details */
exports.getUserDetails = async function (req) {
	// Try Catch the awaited promise to handle the error
	try {
		var Users = await User.findOne({ _id: req.userdetails._id }).lean()
		delete Users.password
		// Return the Userd list that was retured by the mongoose promise
		return Users
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of getting user details */

/*Profile update */
exports.updateProfile = async function (req) {
	try {
		const user = await User.findOne({ _id: req.userdetails._id })

		;(user.first_name = req.body.first_name),
			(user.last_name = req.body.last_name),
			(user.email = req.body.email),
			(user.mobile_no = req.body.mobile_no),
			(user.dob = req.body.dob),
			(user.gender = req.body.gender)

		var existsMail = User.find({
			email: user.email,
			_id: { $ne: req.userdetails._id },
		})

		if (user == "ENGLISH") {
			var message = enlan.languagedata.existemail
		} else {
			var message = tnlan.languagedata.existemail
		}
		if ((await existsMail) != "") {
			throw Error(message)
		}
		var UpdatedUser = await user.save()

		return UpdatedUser
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of profile update */

/*Delete  processWordsDelete*/
exports.updateLanguage = async function (req) {
	try {
		if (!req.query.language) {
			throw Error("Language field is required ")
		}
		var language = req.query.language.toUpperCase()
		var update_langauge = await User.updateOne({ _id: req.userdetails._id }, { language: language })
		return update_langauge
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End */

/*Forgot password */
exports.forgotPassword = async function (req) {
	try {
		const language = req.body.language
		const users = await User.findOne({ email: req.body.email })
		if (language.toUpperCase() == "ENGLISH") {
			var message = enlan.languagedata.emailnotexist
		} else {
			var message = tnlan.languagedata.emailnotexist
		}
		if (!users) {
			throw Error(message)
		}
		users.language = language.toUpperCase()
		await users.save()

		var name = users.first_name + " " + users.last_name

		var minm = 100000
		var maxm = 999999
		var result = Math.floor(Math.random() * (maxm - minm + 1)) + minm
		var otp = result

		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: "cdp.cosmicconsultancy@gmail.com",
				pass: "cdp1234*",
			},
			tls: { rejectUnauthorized: false },
		})

		var email = req.body.email

		var imagepath = path.join(__dirname, "../../views")
		//ssconsole.log(imagepath)
		var data_file = await ejs.renderFile(imagepath + "/forgot.ejs", {
			name: name,
			otp: otp,
		})
		// send mail with defined transport object
		let info = transporter.sendMail({
			from: "cdp.cosmicconsultancy@gmail.com", // sender address
			subject: "Agarathi App Forgot OTP", // Subject line
			to: email,
			html: data_file,
		})
		var otpAuth = await Userotp.findOne({
			email_id: req.body.email,
		})

		if (!otpAuth) {
			var otpAuth = new Userotp({
				otp: otp,
				email_id: req.body.email,
			})
		} else {
			otpAuth.otp = otp
		}

		var Authotp = await otpAuth.save()

		return true
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of forgot pasword */

/*Reser-password */
exports.resetPassword = async function (req) {
	try {
		const user = await User.findOne({ _id: req.userdetails._id })
		var passwordIsValid = bcrypt.compareSync(req.body.old_password, user.password)
		const language = user.language
		if (language.toUpperCase() == "ENGLISH") {
			var message = enlan.languagedata.password_incorrect
		} else {
			var message = tnlan.languagedata.password_incorrect
		}
		if (!passwordIsValid) throw Error(message)
		var hashedPassword = bcrypt.hashSync(req.body.new_password, 10)
		var Users = await User.updateOne({ _id: req.userdetails._id }, { password: hashedPassword })

		return user

		// Return the Userd list that was retured by the mongoose promise
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of reset-password */

/*Logout */
exports.logout = async function (req) {
	try {
		const header = req.header("authorization")
		var token = header.replace("Bearer ", "")
		if (!req.session.usertoken) {
			req.session.usertoken = {}
		}
		req.session.usertoken[token] = token

		var user = await User.findOne({ _id: req.userdetails._id })

		return { token: req.session.usertoken, language: user.language }
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of logout */

/*OTP-checking */
exports.checkotp = async function (req) {
	try {
		const language = req.body.language
		const user = await User.findOne({ email: req.body.email })

		if (language.toUpperCase() == "ENGLISH") {
			var message = enlan.languagedata.emailnotexist
			var otpverified_message = enlan.languagedata.otp_verified
			var otpnotverified_message = enlan.languagedata.otp_not_verified
		} else {
			var message = tnlan.languagedata.emailnotexist
			var otpverified_message = tnlan.languagedata.otp_verified
			var otpnotverified_message = tnlan.languagedata.otp_not_verified
		}
		if (!user) {
			throw Error(message)
		}
		var otpAuth = await Userotp.findOne({
			email_id: req.body.email,
			otp: req.body.otp,
		})
		if (otpAuth) {
			var data = { status: 1, message: otpverified_message }
		} else {
			var data = { status: 0, message: otpnotverified_message }
		}
		return data
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of otp checking */

/*Change pasword */
exports.changepassword = async function (req) {
	try {
		const user = await User.findOne({ email: req.body.email })
		const language = req.body.language
		if (language.toUpperCase() == "ENGLISH") {
			var message = enlan.languagedata.emailnotexist
		} else {
			var message = tnlan.languagedata.emailnotexist
		}
		if (!user) {
			throw Error(message)
		}
		var hashedPassword = bcrypt.hashSync(req.body.password, 10)

		user.password = hashedPassword
		var changepassword = await user.save()
		return changepassword
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of change password */

/*Search words */
exports.searchword = async function (req) {
	try {
		const tamil_word = req.body.tamil_word
		const english_word = req.body.english_word
		const word_id = req.body.word_id
		const user_id = req.userdetails._id
		var data = {
			tamil_word: tamil_word,
			english_word: english_word,
			word_id: word_id,
		}

		var userSearchData = await UserSearch.findOne({ user_id: user_id })

		if (userSearchData) {
			var search_data = userSearchData.search_data

			var exist_data = search_data.find((data) => data.word_id == word_id)
			if (exist_data) {
				var index_word = search_data.findIndex((data) => data.word_id == word_id)

				search_data.splice(index_word, 1)
				search_data.push(data)
			} else {
				search_data.push(data)
			}

			userSearchData.search_data = search_data
		} else {
			var userSearchData = new UserSearch({
				search_data: data,
				user_id: user_id,
			})
		}
		var userdata = await userSearchData.save()

		return userdata
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of search words */

/*Search word details */
exports.searchworddetail = async function (req) {
	try {
		var user_id = req.userdetails._id
		var userSearchData = await UserSearch.findOne({ user_id: user_id })
		if (userSearchData) {
			var userdata = userSearchData.search_data.reverse()
		} else {
			var userdata = []
		}

		return userdata
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of search word details */

/*Remove search words */
exports.removesearchword = async function (req) {
	try {
		var user_id = req.userdetails._id
		var all = req.query.all
		var word_id = req.query.word_id
		var userSearchData = await UserSearch.findOne({ user_id: user_id })
		var userdata = []
		var message = ""

		if (userSearchData) {
			var search_data = userSearchData.search_data
			if (all == 0) {
				var exist_data = search_data.find((data) => data.word_id == word_id)
				if (exist_data) {
					var index_word = search_data.findIndex((data) => data.word_id == word_id)
					search_data.splice(index_word, 1)
					userdata = userSearchData.search_data.reverse()
					userSearchData.search_data = search_data
					message = "Word Removed Successfully"
				} else {
					message = "Search Word ID Don't Exist"
				}
			} else if (all == 1) {
				userSearchData.search_data = []
				userdata = []
				message = "All Words Removed Successfully"
			}
		} else {
			message = "No Search Word Data"
		}

		await userSearchData.save()

		return { message: message, data: userdata }
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of remove search words */

/*Create Rating */
exports.createRating = async function (req) {
	try {
		var user_id = req.userdetails._id
		var comment = req.body.comment
		var rating = req.body.rating
		var suggestion = req.body.suggestion
		var source_type = req.body.source_type

		var rating_data = {
			user_id: user_id,
			comment: comment,
			rating: rating,
			suggestion: suggestion,
			source_type: source_type,
		}

		var savedData = await Rating.update({ user_id: user_id }, rating_data, {
			upsert: true,
		})

		return savedData
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}

/*End of feedback*/

/*App version */

exports.createVersion = async function (req) {
	try {
		var AppVersion = new AppVersions({
			AppVersion: req.body.AppVersion,
		})

		var savedVersion = await AppVersion.save()
		return {
			version: savedVersion,
		}
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}

exports.updateVersion = async function (req) {
	try {
		var data = await AppVersions.findOne()

		var version = req.body.AppVersion
		data.AppVersion = version
		data.save()

		return data
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}

exports.getAppVersion = async function (req) {
	try {
		//var data = req.query.AppVersion

		var _details = await AppVersions.findOne()

		if (parseFloat(req.query.AppVersion) >= parseFloat(_details.AppVersion)) {
			return "true"
		} else if (_details) {
			return "false"
		}
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
