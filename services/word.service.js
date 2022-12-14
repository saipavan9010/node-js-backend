var Word = require("../models/word.model")
var Wordofday = require("../models/agarathi/wordofday.model")
var Admin = require("../models/admin.model")
var Userwordview = require("../models/agarathi/userwordview.model")
var Userrecentview = require("../models/agarathi/userwordview.model")
var Trackwords = require("../models/trackword.model")
var Processword = require("../models/processword.model")
var Department = require("../models/Department.model")
var cron = require("node-cron")
const mongoose = require("mongoose")
const { db, update, aggregate } = require("../models/word.model")
var ObjectId = require("mongodb").ObjectID
const fs = require("fs")
var path = require("path")
const excel = require("exceljs")
const { JsonWebTokenError } = require("jsonwebtoken")
const aggregatePaginate = require("mongoose-aggregate-paginate-v2")

/*Create old word */
exports.createWordold = async function (req) {
	try {
		// Saving the User
		var newWord = new Word({
			tamil_word: req.body.tamil_word,
			english_word: req.body.english_word,
			created_by: req.admindetails._id,
			updated_by: req.admindetails._id,
		})
		//var savedWord = await newWord.save();
		return newWord
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of create old word */

/*Delete word */
exports.wordsDelete = async function (req) {
	try {
		var deleted_words = await Word.deleteMany({})
		return deleted_words
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End */

/*Delete  processWordsDelete*/
exports.processWordsDelete = async function (req) {
	try {
		var deleted_words = await Processword.deleteMany({})
		return deleted_words
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End */

/*Create word */
exports.createWord = async function (req) {
	var trackword = [
		{
			status: "Added",
			level: "level1",
			admin: req.admindetails.name,
			date: new Date().getFormatDate(),
		},
	]

	try {
		// Saving the Word
		const Count_tamil_words = await Word.count({
			tamil_word: req.body.tamil_word,
		})
		var tamil_unique_word = req.body.tamil_word + " - " + Count_tamil_words

		var newWord = new Word({
			tamil_word: req.body.tamil_word,
			english_word: req.body.english_word,
			tamil_unique_word: tamil_unique_word,
			image: "words/no-image.jpg",
			level1_status: "Added",
			created_by: req.admindetails._id,
			updated_by: req.admindetails._id,
		})
		var savedWord = await newWord.save()
		/* Tracking Word */

		var newtrackWords = new Trackwords({
			word_track: trackword,
			word_detail: savedWord._id,
		})
		var saveTrackwords = await newtrackWords.save()
		if (req.admindetails.role == "CTINUSER") {
			var adminRole = ["CTINUSER", "CTINADMIN"]
			var adminStatus = ["Added", "Addded"]
		} else {
			var adminRole = ["CTINADMIN"]
			var adminStatus = ["Processed"]
		}
		adminRole.forEach(async (role, index) => {
			var processData = new Processword({
				word_detail: savedWord._id,
				admin_id: req.admindetails._id,
				role: role,
				remarks: "",
				status: adminStatus[index],
				level_status: "level1",
			})
			var processWords = await processData.save()
		})

		return savedWord
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of create word */

/*Update word */
exports.UpdateWord = async function (req) {
	try {
		const id = req.body.id
		const updateword = await Word.findOne({ _id: id })
		const trackWords = await Trackwords.findOne({ word_detail: id }).select("word_track")
		console.log(updateword)
		if (trackWords) var trackData = trackWords.word_track

		if (
			updateword.tamil_word != req.body.tamil_word ||
			updateword.english_word != req.body.english_word
		) {
			const trackword = {
				status: "Added - Edited ",
				level: "level1",
				admin: req.admindetails.name,
				date: new Date().getFormatDate(),
			}
			if (trackWords) trackData.push(trackword)
			// else var trackwordSave = new Trackwords(trackword);
		}
		if (req.body.professional || req.body.intermediate || req.body.beginners) {
			const trackword = {
				status: "Added",
				level: "level2",
				admin: req.admindetails.name,
				date: new Date().getFormatDate(),
			}
			if (trackWords) trackData.push(trackword)
			// else var trackwordSave = new Trackwords(trackword);
		}

		if (req.files.image || req.files.audio) {
			const trackword = {
				status: "Added",
				level: "level3",
				admin: req.admindetails.name,
				date: new Date().getFormatDate(),
			}
			if (trackWords) trackData.push(trackword)
			// else var trackwordSave = new Trackwords(trackword);
		}
		;(updateword.tamil_word = req.body.tamil_word),
			(updateword.english_word = req.body.english_word),
			(updateword.professional = req.body.professional),
			(updateword.intermediate = req.body.intermediate),
			(updateword.beginners = req.body.beginners),
			(updateword.image = req.files.image
				? "words/" + req.files.image[0].filename
				: "words/no-image.jpg"),
			(updateword.audio = req.files.audio ? "words/" + req.files.audio[0].filename : ""),
			(updateword.level2_status = "Added"),
			(updateword.level3_status = "Added"),
			(updateword.created_by = req.admindetails._id),
			(updateword.updated_by = req.admindetails._id)

		// Update the Word
		var updatedWord = await updateword.save()
		if (trackWords)
			var updatetrackWord = await Trackwords.updateOne(
				{ word_detail: id },
				{ word_track: trackData }
			)
		// else var trackwordData = await Trackwords.save();

		return updatedWord
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of update word */

/*Edit word */
exports.editWord = async function (req) {
	try {
		const id = req.body.word_id
		const word_level = req.body.word_level
		// var word_details = Word.findOne({ _id: id });
		// return word_details;
		var word_details = {}
		if (word_details.length != 0) {
			if (word_level == 2) {
				word_details.level2_status = "Added"
				word_details.appearance = req.body.appearance
				word_details.teaching = req.body.teaching
				word_details.appearance = req.body.appearance
			} else if (word_level == 3) {
				word_details.level3_status = "Added"
				word_details.image = req.files.image
					? "words/" + req.files.image[0].filename
					: "words/no-image.jpg"
				word_details.audio = req.files.audio ? "words/" + req.files.audio[0].filename : ""
			} else if (word_level == 1) {
				word_details.tamil_word = req.body.tamil_word
				word_details.english_word = req.body.english_word
			}
		} else {
			return false
		}
		var word_detail = await Word.updateOne({ _id: id }, word_details)

		return word_details
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of edit word */

/*Word search */
exports.wordSearch = async function (req) {
	try {
		const name = req.body.word_name
		const word_detail = Word.find({
			$or: [
				{ tamil_word: { $regex: name, $options: "i" } },
				{ english_word: { $regex: name, $options: "i" } },
			],
		})
			// .where("level1_status")
			// .equals("Approved")
			// .where("level2_status")
			// .equals("Approved")

			.limit(10)
		return word_detail
	} catch (e) {
		// return a Error message describing the reason
		throw Error(e)
	}
}
/*End of word search */

/*Word detail */
exports.wordDetail = async function (req) {
	try {
		const id = req.params.wordId
		const word_detail = await Word.findOne({ _id: id })

		word_detail.viewers_count = word_detail.viewers_count + 1
		word_detail.save()

		const related_words = await Word.find({
			tamil_word: word_detail.tamil_word,
			_id: { $ne: id },
		})

		word_detail.set("related_words", related_words, { strict: false })

		var UserWordDataDetail = await Userwordview.findOne({
			word_data: id,
			user_id: req.userdetails._id,
		})

		if (!UserWordDataDetail) {
			var UserWordDataDetail = new Userwordview({
				word_data: id,
				user_id: req.userdetails._id,
			})
			word_detail.set("book_mark", 0, {
				strict: false,
			})
		} else {
			UserWordDataDetail.updatedAt = new Date()

			word_detail.set("book_mark", UserWordDataDetail.book_mark, {
				strict: false,
			})
		}
		var userdata = await UserWordDataDetail.save()

		return word_detail
	} catch (e) {
		throw Error(e)
	}
}
/*End of word details */

/*Word detail for unauth */
exports.unauthworddetail = async function (req) {
	try {
		const id = req.params.wordId
		const word_detail = await Word.findOne({ _id: id })

		word_detail.viewers_count = word_detail.viewers_count + 1
		word_detail.save()

		const related_words = await Word.find({
			tamil_word: word_detail.tamil_word,
			_id: { $ne: id },
		})

		word_detail.set("related_words", related_words, { strict: false })

		return word_detail
	} catch (e) {
		throw Error(e)
	}
}

cron.schedule(
	"0 0 * * * ",
	() => {
		console.log("running every minute 1, 2, 4 and 5")
		WordOfDay()
	},
	{
		scheduled: true,
		timezone: "Asia/Singapore",
	}
)
/*End of unauth word details */

/*Word of day */
exports.wordOfDay = async function (req) {
	try {
		let words_count = await Word.find().count()

		let word_of_day_count = await Word.find({ wordofday_status: 1 }).count()
		if (words_count == word_of_day_count) {
			await Word.update({ wordofday_status: 0 })
		}

		let word_of_day = await Word.findOne({ wordofday_status: 0 }).limit(1)

		var singaporeTime = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Singapore",
		})
		
		console.log("India time: " + new Date(singaporeTime))
		var WordData = new Wordofday({
			word_id: word_of_day._id,
			date: new Date(singaporeTime).toISOString(),
		})

		var WordData = await WordData.save()
		word_of_day.wordofday_status = 1
		var update_data = await word_of_day.save()

		return word_of_day
	} catch (e) {
		throw Error(e)
	}
}
/*End of word of day */

/*Status word count */
exports.StatusWordCount = async function (req) {
	try {
		var department = req.admindetails.department
		var role = req.admindetails.role
		var user_id = req.admindetails._id
		var month = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
		var month_name = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		]
		if (role == "APPROVER") var status = ["Open", "Rework", "Pending Approval", "Approved"]
		else var status = ["Open", "Rework", "Done", "Pending Approval", "Approved"]

		var grapdata = []
		var d = new Date()
		var year = req.query.year ? req.query.year : d.getFullYear()
		var group = { $match: {} }

		if (role == "APPROVER") {
			switch (department) {
				case "ENGLISH":
					cond = { english_assign_status: "0", level1_status: "NEW" }
					break
				case "IMAGE":
					cond = { image_assign_status: "0", level3_status: "NEW" }
					break
				case "AUDIO":
					cond = {
						$or: [{ audiofemale_assign_status: "0" }, { audiomale_assign_status: "0" }],
						level3_status: "NEW",
					}

					group = {
						$group: {
							_id: "$tamil_word",
						},
					}
					break

				case "MEANING":
					cond = { meaning_assign_status: "0", level2_status: "NEW" }
					break
			}
			var statusnew = await Word.aggregate([
				{ $match: cond },
				group,
				{
					$count: "count",
				},
			])
			var grapnew_month = await Word.aggregate([
				{ $match: cond },
				{
					$group: {
						_id: {
							month: { $month: "$createdAt" },
							year: { $year: "$createdAt" },
						},
						Word_counts: { $sum: 1 },
					},
				},
			])

			grapnew_month = grapnew_month.filter((word) => word._id.year == year)
			month.forEach(function (val, key) {
				var monthexist = grapnew_month.find((words) => words._id.month == val)
				if (monthexist != undefined) {
					grapdata.push({
						type: "New",
						value: monthexist.Word_counts,
						date: month_name[key],
						year: year,
					})
				} else {
					grapdata.push({
						type: "New",
						value: 0,
						date: month_name[key],
						year: year,
					})
				}
			})
		} else {
			var statusnew = []
		}

		if (department == "AUDIO") {
			var condition = { department: { $in: ["AUDIOMALE", "AUDIOFEMALE"] } }
		} else {
			var condition = { department: department }
		}

		if (role == "USER") var usercond = { user_id: mongoose.Types.ObjectId(user_id) }
		else var usercond = {}

		var StatusWordCount = await Processword.aggregate([
			{ $match: condition },
			{ $match: usercond },
			{ $group: { _id: "$level_status", Word_counts: { $sum: 1 } } },
		])

		var graphStatusWordCount = await Processword.aggregate([
			{ $match: condition },
			{ $match: usercond },

			{
				$group: {
					_id: {
						status: "$level_status",
						month: { $month: "$createdAt" },
						year: { $year: "$createdAt" },
					},
					Word_counts: { $sum: 1 },
				},
			},
		])

		graphStatusWordCount = graphStatusWordCount.filter((word) => word._id.year == year)

		month.forEach(function (val, key) {
			status.forEach(function (statusval) {
				var status_new = statusval
				if (statusval == "Pending Approval") status_new = "COMPLETED"
				var monthexist = graphStatusWordCount.find(
					(words) => words._id.month == val && status_new.toUpperCase() == words._id.status
				)
				if (monthexist != undefined) {
					grapdata.push({
						type: statusval,
						value: monthexist.Word_counts,
						date: month_name[key],
						year: year,
					})
				} else {
					grapdata.push({
						type: statusval,
						value: 0,
						date: month_name[key],
						year: year,
					})
				}
			})
		})

		return {
			newstatusdata: statusnew,
			statusdata: StatusWordCount,
			graphOverallStatus: grapdata,
		}
	} catch (e) {
		throw Error(e)
	}
}
/*End of word status count */

/*Status word count */
exports.overalladmindata = async function (req) {
	try {
		var word_total_data = await Word.count()
		var word_approved_data = await Word.find({
			level1_status: "APPROVED",
			level2_status: "APPROVED",
			level3_status: "APPROVED",
		}).count()

		return {
			min: 0,
			max: word_total_data,
			count: word_approved_data,
		}
	} catch (e) {
		throw Error(e)
	}
}
/*End */

/*Word of day detail */
exports.wordofdaydetails = async function (req) {
	try {
		const word_of_day_details = await Wordofday.find()
			.sort([["createdAt", "descending"]])
			.limit(7)
			.populate("word_id")
			.populate("book_mark", "book_mark", {
				user_id: req.userdetails._id,
				book_mark: 1,
			})
			.lean()
		return word_of_day_details
	} catch (e) {
		throw Error(e)
	}
}
/*End of word of day detail */

/*Word of day detail for unauth */
exports.unauthWordofdaydetails = async function (req) {
	try {
		const word_of_day_details = await Wordofday.find()
			.sort([["createdAt", "descending"]])
			.limit(7)
			.populate("word_id")
			.lean()
		return word_of_day_details
	} catch (e) {
		throw Error(e)
	}
}
/*End of word of day details for unauth */

/*User recent view */
exports.userrecentview = async function (req) {
	try {
		const userRecentViewDetails = await Userrecentview.find({
			user_id: req.userdetails._id,
		})
			.sort([["updatedAt", "descending"]])
			.limit(10)
			.populate("word_data")
		return userRecentViewDetails
	} catch (e) {
		throw Error(e)
	}
}
/*End of user recent view */

/*Featured data */
exports.featuredata = async function (req) {
	try {
		const featureDataDetails = await Word.find()
			.sort([["viewers_count", -1]])
			.populate("book_mark", "book_mark", {
				user_id: req.userdetails._id,
				book_mark: 1,
			})
			.limit(10)
			.lean()

		return featureDataDetails
	} catch (e) {
		throw Error(e)
	}
}
/*End of featured data */

/*Featured data for unauth */
exports.unauthfeaturedata = async function (req) {
	try {
		const featureDataDetails = await Word.find(
			{},
			"tamil_word image level1_status level2_status level3_status english_word tamil_unique_word beginners intermediate professional audio"
		)
			.sort([["viewers_count", -1]])
			.limit(10)
			.lean()

		return featureDataDetails
	} catch (e) {
		throw Error(e)
	}
}
/*End of featured data for unauth */

/*get word track detail */
exports.getWordtrackDetail = async function (req) {
	try {
		const word_id = req.params.id
		const bookmarkData = await Trackwords.findOne({
			word_detail: word_id,
		})
		return bookmarkData
	} catch (e) {
		throw Error(e)
	}
}
/*End of get word track detail */

/*Bookmark */
exports.bookmark = async function (req) {
	try {
		var UserWordDataDetail = await Userwordview.findOne({
			word_data: req.body.word_id,
			user_id: req.userdetails._id,
		})
		if (!UserWordDataDetail) {
			var UserWordDataDetail = new Userwordview({
				word_data: req.body.word_id,
				user_id: req.userdetails._id,
				book_mark: req.body.bookmark,
			})
		} else {
			UserWordDataDetail.book_mark = req.body.bookmark
		}
		var userdata = await UserWordDataDetail.save()
		var UserWordDataDetail = await Userwordview.find({
			user_id: req.userdetails._id,
			book_mark: 1,
		})

		return UserWordDataDetail
	} catch (e) {
		throw Error(e)
	}
}
/*End of bookmark */

/*Bookmark details */
exports.bookmarkDetail = async function (req) {
	try {
		const options = {
			page: req.query.page,
			limit: req.query.limit,
		}
		// var UserWordDataDetail = await Userwordview.find({user_id: req.userdetails._id,
		//   book_mark: 1,}).populate(
		//     "word_data",
		//     "tamil_word image level1_status level2_status level3_status english_word tamil_unique_word beginners intermediate professional audio"
		//   );

		var myAggregate = Userwordview.aggregate([
			{
				$lookup: {
					from: "words",
					localField: "word_data",
					foreignField: "_id", // field in the items collection
					as: "words_data",
				},
			},
			{
				$unwind: {
					path: "$words_data",
					preserveNullAndEmptyArrays: false,
				},
			},
			{ $match: { book_mark: 1, user_id: req.userdetails._id } },
		])

		var bookmark_page = await Userwordview.aggregatePaginate(myAggregate, options)
		return bookmark_page
	} catch (e) {
		throw Error(e)
	}
}
/*End of bookmark details */

/*Total Bookmark details */
exports.bookmarkDetails = async function (req) {
	try {
		var UserWordDataDetail = await Userwordview.find({
			user_id: req.userdetails._id,
			book_mark: 1,
		})
		return UserWordDataDetail
	} catch (e) {
		throw Error(e)
	}
}
/*End of Total bookmark details */

/*English Word Update */
exports.englishWord = async function (req) {
	try {
		var word_id = mongoose.Types.ObjectId(req.body.word_id)
		var department = req.admindetails.department
		var user_id = mongoose.Types.ObjectId(req.admindetails._id)
		var english_word = req.body.english_word
		var assign_to = req.admindetails.username
		//console.log(department);

		var processword = await Processword.findOne({
			word_detail: word_id,
			department: department,
		})

		if (processword) {
			await Word.update({ _id: word_id }, { english_word: english_word })
			var lvlStatus = ""
			if (processword.level_status == "REWORK") {
				processword.comments = req.body.comments
				lvlStatus = "REWORK"
			} else {
				processword.level_status = "DONE"
				lvlStatus = "DONE"
			}

			var processword = await processword.save()

			var obj = {}
			obj.assign_to = req.admindetails.username
			obj.status = lvlStatus
			obj.date = new Date()

			var trackWord = await Trackwords.findOne({
				word_detail: word_id,
				department: department,
			})
			var Arrtrack = trackWord.word_track
			Arrtrack.push(obj)

			await Trackwords.update(
				{ word_detail: word_id, department: department },
				{ word_track: Arrtrack }
			)

			return processword
		} else {
			throw Error("English Word is not able to edit")
		}
	} catch (e) {
		throw Error(e)
	}
}
/*End */

/* Words Meaning Update */

exports.wordMeanings = async function (req) {
	try {
		var word_id = mongoose.Types.ObjectId(req.body.word_id)
		var department = req.admindetails.department
		var user_id = mongoose.Types.ObjectId(req.admindetails._id)
		var grammer = req.body.grammer
		var core_sense = req.body.core_sense
		var sub_sense = req.body.sub_sense
		var synonym = req.body.synonym
		var example = req.body.example
		var homophones = req.body.homophones
		var idioms_phrases = req.body.idioms_phrases
		var etymology = req.body.etymology
		var assign_to = req.admindetails.username
		var processword = await Processword.findOne({
			word_detail: word_id,
			department: department,
		})

		if (processword) {
			await Word.update(
				{ _id: word_id },
				{
					grammer: grammer,
					core_sense: core_sense,
					sub_sense: sub_sense,
					synonym: synonym,
					example: example,
					homophones: homophones,
					idioms_phrases: idioms_phrases,
					etymology: etymology,
				}
			)
			var lvlStatus = ""
			if (processword.level_status == "REWORK") {
				processword.comments = req.body.comments
				lvlStatus = "REWORK"
			} else {
				processword.level_status = "DONE"
				lvlStatus = "DONE"
			}

			processword = await processword.save()

			var obj = {}
			obj.assign_to = req.admindetails.username
			obj.status = lvlStatus
			obj.date = new Date()

			var trackWord = await Trackwords.findOne({
				word_detail: word_id,
				department: department,
			})
			//return trackWord;
			var Arrtrack = trackWord.word_track
			Arrtrack.push(obj)

			await Trackwords.update(
				{ word_detail: word_id, department: department },
				{ word_track: Arrtrack }
			)

			return processword
		} else {
			throw Error(" Word Meaning is not able to edit")
		}
	} catch (e) {
		throw Error(e)
	}
}
/*End  */

/* Words Image Update */
exports.wordImage = async function (req) {
	try {
		var word_id = mongoose.Types.ObjectId(req.body.word_id)
		var department = req.admindetails.department
		var user_id = mongoose.Types.ObjectId(req.admindetails._id)
		var image = "words/" + req.files.image[0].mimetype
		var filename = "words/" + req.files.image[0].filename
		var imagepath = path.join(__dirname, "../public")
		var assign_to = req.admindetails.username
		if (req.files.image[0].size > 2097152) {
			throw Error("File limit should not exceed 2 MB")
		}

		if (image != "words/image/jpg" && image != "words/image/jpeg" && image != "words/image/png") {
			throw Error("Image format must be in jpg,jpeg,png")
		}

		var processword = await Processword.findOne({
			word_detail: word_id,
			department: department,
		})
		var worddata = await Word.findById(word_id).select("image")
		if (worddata.image != "words/no-image.jpg") {
			var oldimagepath = imagepath + "/" + worddata.image
			fs.unlinkSync(oldimagepath)
		}

		if (processword) {
			await Word.update({ _id: word_id }, { image: filename })
			var lvlStatus = ""
			if (processword.level_status == "REWORK") {
				processword.comments = req.body.comments
				lvlStatus = "REWORK"
			} else {
				processword.level_status = "DONE"
				lvlStatus = "DONE"
			}
			processword = await processword.save()

			var obj = {}
			obj.assign_to = req.admindetails.username
			obj.status = lvlStatus
			obj.date = new Date()

			var trackWord = await Trackwords.findOne({
				word_detail: word_id,
				department: department,
			})

			var Arrtrack = trackWord.word_track
			Arrtrack.push(obj)

			await Trackwords.update(
				{ word_detail: word_id, department: department },
				{ word_track: Arrtrack }
			)

			return processword
		} else {
			throw Error(" Word Image is not able to edit")
		}
	} catch (e) {
		fs.unlinkSync(req.files.audio[0].path)
		throw Error(e)
	}
}
/*End  */

/* Words Audio Male Update */
exports.wordAudiomale = async function (req) {
	try {
		var audiomale = req.files.audio[0].filename
		var audiotype = req.files.audio[0].mimetype

		if (audiotype != "audio/mpeg") {
			throw Error("Audio format must be in mp3")
		}

		var word_id = mongoose.Types.ObjectId(req.body.word_id)
		var tamil_word = req.body.tamil_word
		var department = req.admindetails.department
		var user_id = mongoose.Types.ObjectId(req.admindetails._id)
		var audiomale = "words/" + req.files.audio[0].filename
		var assign_to = req.admindetails.username

		// file validation
		if (req.files.audio[0].size > 2097152) {
			throw Error("File limit should not exceed 2 MB")
		}

		var processword = await Processword.findOne({
			word_detail: word_id,
			department: department,
		})
		var audiopath = path.join(__dirname, "../public")
		var worddata = await Word.findById(word_id).select("audiomale")
		if (worddata && worddata.audiomale) {
			var oldaudiopath = audiopath + "/" + worddata.audiomale
			fs.unlinkSync(oldaudiopath)
		}

		if (processword) {
			await Word.updateMany({ tamil_word: tamil_word }, { audiomale: audiomale })
			var lvlStatus = ""

			if (processword.level_status == "REWORK") {
				processword.comments = req.body.comments
				lvlStatus = "REWORK"
			} else {
				processword.level_status = "DONE"
				lvlStatus = "DONE"
			}

			processword = await processword.save()

			var obj = {}
			obj.assign_to = assign_to
			obj.status = lvlStatus
			obj.date = new Date()

			var trackWord = await Trackwords.findOne({
				word_detail: word_id,
				department: department,
			})

			var Arrtrack = trackWord.word_track
			Arrtrack.push(obj)

			await Trackwords.update(
				{ word_detail: word_id, department: department },
				{ word_track: Arrtrack }
			)

			return processword
		} else {
			throw Error(" Word Audio Male is not able to edit")
		}
	} catch (e) {
		fs.unlinkSync(req.files.audio[0].path)
		throw Error(e)
	}
}
/*End  */

/* Words Audio female Update */
exports.wordAudiofemale = async function (req) {
	try {
		var audiomale = req.files.audio[0].filename
		var audiotype = req.files.audio[0].mimetype

		if (audiotype != "audio/mpeg") {
			throw Error("Audio format must be in mp3")
		}

		var word_id = mongoose.Types.ObjectId(req.body.word_id)
		var tamil_word = req.body.tamil_word
		var department = req.admindetails.department
		var user_id = mongoose.Types.ObjectId(req.admindetails._id)
		var audiofemale = "words/" + req.files.audio[0].filename
		var assign_to = req.admindetails.username

		// File validation

		if (req.files.audio[0].size > 2097152) {
			throw Error("File limit should not exceed 2 MB")
		}

		var processword = await Processword.findOne({
			word_detail: word_id,
			department: department,
		})

		var audiopath = path.join(__dirname, "../public")

		var worddata = await Word.findById(word_id).select("audiofemale")

		if (worddata && worddata.audiofemale) {
			var oldaudiopath = audiopath + "/" + worddata.audiofemale
			fs.unlinkSync(oldaudiopath)
		}

		if (processword) {
			console.log(tamil_word)
			var update = await Word.updateMany({ tamil_word: tamil_word }, { audiofemale: audiofemale })
			console.log(update)

			var lvlStatus = ""

			if (processword.level_status == "REWORK") {
				processword.comments = req.body.comments
				lvlStatus = "REWORK"
			} else {
				processword.level_status = "DONE"
				lvlStatus = "DONE"
			}

			processword = await processword.save()

			var obj = {}
			obj.assign_to = assign_to
			obj.status = lvlStatus
			obj.date = new Date()

			var trackWord = await Trackwords.findOne({
				word_detail: word_id,
				department: department,
			})

			var Arrtrack = trackWord.word_track
			Arrtrack.push(obj)

			await Trackwords.update(
				{ word_detail: word_id, department: department },
				{ word_track: Arrtrack }
			)

			return processword
		} else {
			throw Error(" Word Audio Male is not able to edit")
		}
	} catch (e) {
		fs.unlinkSync(req.files.audio[0].path)
		throw Error(e)
	}
}
/*End  */

/*  Word Status Update */
exports.ApprovalStatus = async function (req) {
	try {
		// var word_id = mongoose.Types.ObjectId(req.body.word_id);
		// var department = req.body.department;
		// var user_id = mongoose.Types.ObjectId(req.admindetails._id);

		var WordListStatus = await Word.find({})

		return WordListStatus
	} catch (e) {
		throw Error(e)
	}
}
/*End  */

/*  Word Status Update */
exports.wordStatus = async function (req) {
	try {
		var word_id = mongoose.Types.ObjectId(req.body.word_id)
		var department = req.body.department
		var user_id = mongoose.Types.ObjectId(req.admindetails._id)
		var status = req.body.status
		var comments = req.body.comments
		var assign_to = req.admindetails.username

		var processword = await Processword.findOne({
			word_detail: word_id,
			department: department,
		})

		if (processword) {
			processword.level_status = status
			processword.comments = req.body.comments ? req.body.comments : ""
			processword = await processword.save()

			var obj = {}
			obj.assign_to = assign_to
			obj.status = status
			obj.comments = comments
			obj.date = new Date()

			var trackWord = await Trackwords.findOne({
				word_detail: word_id,
				department: department,
			})

			var Arrtrack = trackWord.word_track
			Arrtrack.push(obj)

			await Trackwords.update(
				{ word_detail: word_id, department: department },
				{ word_track: Arrtrack }
			)

			if (status == "APPROVED" && department == "ENGLISH") {
				await Word.update({ _id: word_id }, { level1_status: "APPROVED" })
			} else if (status == "APPROVED" && department == "MEANING") {
				await Word.update({ _id: word_id }, { level2_status: "APPROVED" })
			} else if (status == "APPROVED" && department == "IMAGE") {
				var processwords = await Processword.find({
					word_detail: word_id,
					$or: [{ department: "AUDIOMALE" }, { department: "AUDIOFEMALE" }],
					level_status: "APPROVED",
				})
				if (processwords.length > 1) {
					await Word.update({ _id: word_id }, { level3_status: "APPROVED" })
				}
			} else if (status == "APPROVED" && department == "AUDIOMALE") {
				var processwords = await Processword.find({
					word_detail: word_id,
					$or: [{ department: "IMAGE" }, { department: "AUDIOFEMALE" }],
					level_status: "APPROVED",
				})
				if (processwords.length > 1) {
					await Word.update({ _id: word_id }, { level3_status: "APPROVED" })
				}
			} else if (status == "APPROVED" && department == "AUDIOFEMALE") {
				var processwords = await Processword.find({
					word_detail: word_id,
					$or: [{ department: "IMAGE" }, { department: "AUDIOMALE" }],
					level_status: "APPROVED",
				})
				if (processwords.length > 1) {
					await Word.update({ _id: word_id }, { level3_status: "APPROVED" })
				}
			}
			return processword
		} else {
			throw Error(department + " Not Done Yet")
		}
	} catch (e) {
		throw Error(e)
	}
}
/*End  */

/*  Overall Status Update */
exports.overallStatus = async function (req) {
	try {
		var word_id = mongoose.Types.ObjectId(req.body.word_id)
		var level = req.body.level
		var status = req.body.status
		if (level == "level1") {
			var word_level = { level1_status: "APPROVED" }
			var condition = {
				word_detail: word_id,
				department: "ENGLISH",
				level_status: "COMPLETED",
			}
		} else if (level == "level2") {
			var word_level = { level2_status: "APPROVED" }
			var condition = {
				word_detail: word_id,
				department: "MEANING",
				level_status: "COMPLETED",
			}
		} else if (level == "level3") {
			var word_level = { level3_status: "APPROVED" }
			var condition = {
				word_detail: word_id,
				department: { $in: ["AUDIOFEMALE", "AUDIOMALE", "IMAGE"] },
				level_status: "COMPLETED",
			}
		}
		var processword = await Processword.findOne(condition)
		if (processword) {
			await Word.update({ _id: word_id }, word_level)
			processword.level_status = "APPROVED"
			processword = await processword.save()
			return processword
		} else {
			throw Error(level + " Not able to Update")
		}
	} catch (e) {
		throw Error(e)
	}
}
/*End  */

/*Assign Words */
exports.assignWords = async function (req) {
	try {
		var assign = ["all", "individual"]
		var assign_to = req.body.assign_to
		var words = req.body.word_id
		var _users = req.body.user_id
		var assign_from = req.admindetails.username

		//console.log(assign_from);
		var cond = {}
		switch (req.admindetails.department) {
			case "ENGLISH":
				cond = { english_assign_status: "0" }
				break
			case "IMAGE":
				cond = { image_assign_status: "0" }
				break
			case "AUDIO":
				cond = {
					audiomale_assign_status: "0",
					audiofemale_assign_status: "0",
				}
				break

			case "MEANING":
				cond = { meaning_assign_status: "0" }
				break
		}

		if (words == undefined && assign_to == "individual") throw Error("Please select the Words")
		var user_id = req.body.user_id
		var data = []
		var condition = {
			department_name: req.admindetails.department,
			organisation_name: req.admindetails.organisation,
			role_name: req.admindetails.role,
		}

		var department_id = await Department.findOne(condition).select("_id")

		if (assign.includes(assign_to)) {
			if (assign_to == "all") {
				if (req.admindetails.department != "AUDIO") var word_all = await Word.find(cond)
				else
					var word_all = await Word.aggregate([
						{
							$match: {
								$or: [
									{
										audiomale_assign_status: "0",
									},
									{
										audiofemale_assign_status: "0",
									},
								],
							},
						},
						{
							$group: {
								_id: "$tamil_word",
								doc: { $first: "$$ROOT" },
							},
						},
						{ $replaceRoot: { newRoot: "$doc" } },
					])

				// return word_all;

				if (req.admindetails.department == "AUDIO") {
					//console.log('D');
					condition = {
						$or: [{ department: "AUDIOMALE" }, { department: "AUDIOFEMALE" }],
						role: "USER",
						status: "Active",
					}
				} else {
					condition = {
						department: req.admindetails.department,
						role: "USER",
						status: "Active",
					}
				}

				var _user = await Admin.find(condition).select()

				var wordCount = word_all.length
				var userCount = _user.length

				if (wordCount < userCount) {
					throw Error("User are greater Words Assign equally operation cannot be done")
				}
				// var round_value = Math.round(wordCount / userCount);
				// var round_check = round_value - Math.round(wordCount / userCount);
				// if (round_check <= 0.4) round_value = round_value + 1;
				// var assign_word = round_value;
				// var i = 0;
				// var j = 0;
				var _wordAll = []
				word_all.forEach((value) => {
					// if (i == assign_word) {
					//   i = 0;
					//   j++;
					// }
					_user.forEach((val) => {
						var obj = {
							word_detail: value._id,
							assigned_admin: req.admindetails._id,
							department: val.department,
							department_id: department_id._id,
							user_name: val.username,
							user_id: val._id,
							comments: "",
							level_status: "OPEN",
						}
						data.push(obj)
					})

					// i++;

					_wordAll.push(value.tamil_word)
				})

				var update_condtion = {}
				switch (req.admindetails.department) {
					case "ENGLISH":
						update_condtion = { english_assign_status: "1" }
						break
					case "IMAGE":
						update_condtion = { image_assign_status: "1" }
						break
					case "AUDIO":
						update_condtion = {
							audiomale_assign_status: 1,
							audiofemale_assign_status: 1,
						}
						break
					case "MEANING":
						update_condtion = { meaning_assign_status: 1 }
						break
				}

				var savedwords = await Processword.insertMany(data)

				var trackobj = []
				data.forEach((element) => {
					var TrackObj = {}
					var tObj = {}

					TrackObj.word_track = []
					tObj.assign_to = element.user_name
					tObj.asign_from = assign_from
					tObj.status = element.level_status
					tObj.date = new Date()
					TrackObj.word_track.push(tObj)
					TrackObj.word_detail = element.word_detail
					TrackObj.department = element.department
					trackobj.push(TrackObj)
				})

				var trackWords = await Trackwords.insertMany(trackobj)

				var updatedwords = await Word.updateMany(
					{ tamil_word: { $in: _wordAll } },
					update_condtion,
					{ multi: true }
				)
			} else {
				var existsCond = {}
				switch (req.admindetails.department) {
					case "ENGLISH":
						existsCond = { english_assign_status: "1", _id: { $in: words } }
						break
					case "IMAGE":
						existsCond = { image_assign_status: "1", _id: { $in: words } }
						break
					case "AUDIO":
						if (req.body.department == "AUDIOMALE") {
							existsCond = {
								audiomale_assign_status: "1",
								_id: { $in: words },
							}
							break
						} else if (req.body.department == "AUDIOFEMALE") {
							existsCond = {
								audiofemale_assign_status: "1",
								_id: { $in: words },
							}
							break
						}

					case "MEANING":
						existsCond = { meaning_assign_status: "1", _id: { $in: words } }
						break
				}

				var wordExists = Word.find(existsCond).select("_id")

				//return existsCond;

				if ((await wordExists).length > 0) {
					throw Error("Some words are already assigned")
				}
				var user_details = await Admin.find().where("_id").in(_users)
				//return user_details;
				// return user_details;

				words.forEach((value) => {
					var obj = {
						word_detail: value,
						user_id: user_id[0],
						user_name: user_details[0].username,
						assigned_admin: req.admindetails._id,
						department: user_details[0].department,
						department_id: department_id._id,
						level_status: "OPEN",
						comments: "",
					}
					data.push(obj)

					if (user_details.length > 1 && req.admindetails.department == "AUDIO") {
						var obj = {
							word_detail: value,
							user_id: user_id[0],
							user_name: user_details[1].username,
							assigned_admin: req.admindetails._id,
							department: user_details[1].department,
							department_id: department_id._id,
							level_status: "OPEN",
							comments: "",
						}
						data.push(obj)
					}
				})
				var update_condtion = {}
				switch (req.admindetails.department) {
					case "ENGLISH":
						update_condtion = { english_assign_status: 1 }
						break
					case "IMAGE":
						update_condtion = { image_assign_status: 1 }
						break
					case "AUDIO":
						//return _users;
						if (_users.length == 2) {
							update_condtion = {
								audiomale_assign_status: 1,
								audiofemale_assign_status: 1,
							}
						} else if (_users.length == 1) {
							if (user_details[0].department == "AUDIOMALE") {
								update_condtion = {
									audiomale_assign_status: 1,
								}
							} else {
								update_condtion = {
									audiofemale_assign_status: 1,
								}
							}
						}

						break
					case "MEANING":
						update_condtion = { meaning_assign_status: 1 }
						break
				}
				// return data;
				//return user_details[0].department;

				//return data;
				var savedwords = await Processword.insertMany(data)

				var trackobj = []
				data.forEach((element) => {
					var TrackObj = {}
					var tObj = {}
					TrackObj.word_track = []
					tObj.assign_to = element.user_name
					tObj.asign_from = assign_from
					tObj.status = element.level_status
					tObj.date = new Date()
					TrackObj.word_track.push(tObj)
					TrackObj.word_detail = element.word_detail
					TrackObj.department = element.department
					trackobj.push(TrackObj)
				})

				var trackWords = Trackwords.insertMany(trackobj)

				var updatedwords = await Word.updateMany({ _id: { $in: words } }, update_condtion, {
					multi: true,
				})
			}
		} else {
			throw Error("Assign to Must contain ALL or Individual")
		}

		return savedwords
	} catch (e) {
		throw Error(e)
	}
}
/*End */

/*Word update status */
exports.Wordupdatestatus = async function (req) {
	try {
		var role = req.admindetails.role
		var status = req.body.status
		var word_id = req.body.word_id
		var level_status = req.body.level_status

		var data = {
			word_detail: word_id,
			admin_id: req.admindetails._id,
			role: req.admindetails.role,
			remarks: req.body.remarks,
			status: status,
			level_status: level_status,
		}
		if (status == "Processed" || status == "Rejected" || status == "Approved") {
			await Processword.update(
				{
					word_detail: req.body.word_id,
					role: role,
					level_status: level_status,
				},
				data,
				{ upsert: true }
			)
		}

		if (role == "CTINADMIN") {
			if (status == "Processed") {
				data.status = "Added"
				data.role = "COSMICADMIN"
				data.remarks = ""
				await Processword.update(
					{
						word_detail: word_id,
						role: "COSMICADMIN",
						level_status: level_status,
					},
					data,
					{
						upsert: true,
					}
				)
				await Word.findOne()
			} else {
				data.status = "Recorrect"
				data.role = "CTINUSER"
				data.remarks = req.body.remarks
				await Processword.update(
					{
						word_detail: word_id,
						role: "CTINUSER",
						level_status: level_status,
					},
					data,
					{
						upsert: true,
					}
				)
			}
		} else if (role == "COSMICADMIN") {
			if (status == "Processed") {
				data.status = "Added"
				data.remarks = ""
				data.role = "CTSGADMIN"
			} else {
				data.status = "Recorrect"
				data.remarks = req.body.remarks
				data.role = "CTINADMIN"
			}

			await Processword.update(
				{
					word_detail: word_id,
					role: data.role,
					level_status: level_status,
				},
				data,
				{
					upsert: true,
				}
			)
		} else if (role == "CTSGADMIN") {
			if (status == "Processed") {
				data.status = "Added"
				data.role = "LKYFBADMIN"
				data.remarks = ""
			} else {
				data.status = "Recorrect"
				data.remarks = req.body.remarks
				data.role = "COSMICADMIN"
			}
			await Processword.update(
				{
					word_detail: req.body.word_id,
					role: data.role,
					level_status: level_status,
				},
				data,
				{
					upsert: true,
				}
			)
		} else if (role == "LKYFBADMIN") {
			var update = {}
			//console.log("pavan");
			if (level_status == "level1") update = { level1_status: status }
			else if (level_status == "level2") update = { level2_status: status }
			else update = { level3_status: status }
			var words = await Word.update({ _id: word_id }, update)
			var processword = await Processword.updateMany(
				{
					word_detail: word_id,
					level_status: level_status,
				},
				{ status: status },
				{
					upsert: true,
				}
			)
		}
		return processword
	} catch (e) {
		throw Error(e)
	}
}
/*End of word update status */

/*List words */

exports.listWord = async function (req) {
	try {
		const level = req.query.level
		const status = req.query.status
		var searchvalue = req.query.searchvalue
		var page = parseInt(req.query.page)
		var size = parseInt(req.query.length)
		var query = {}
		if (page < 0 || page === 0) {
			response = {
				error: true,
				message: "invalid page numbers, should start with 1",
			}
			return res.json(response)
		}

		if (searchvalue) {
			searchvalue = {
				$or: [{ tamil_unique_word: { $regex: searchvalue, $options: "i" } }],
			}
		} else {
			searchvalue = {}
		}
		query.skip = size * (page - 1)
		query.limit = size
		query.sort = { _id: -1 }
		const options = {
			page: req.query.page,
			limit: req.query.length,
			allowDiskUse: true,
		}
		if (
			req.admindetails.role == "SUPERADMIN" &&
			(req.admindetails.organisation == "CTSG" || req.admindetails.organisation == "COSMIC")
		) {
			var myAggregate = Word.aggregate([
				{ $match: searchvalue },
				{
					$lookup: {
						from: "processwords",
						localField: "_id",
						foreignField: "word_detail",
						as: "Processwords",
					},
				},
			])

			var wordsData = await Word.aggregatePaginate(myAggregate, options)
			return wordsData
		} else if (req.admindetails.role == "APPROVER") {
			if (req.admindetails.department == "ENGLISH")
				var department_condition_status = {
					$and: [{ english_assign_status: "0" }],
				}

			if (req.admindetails.department == "IMAGE")
				var department_condition_status = {
					$and: [{ image_assign_status: { $eq: "0" } }],
				}

			if (req.admindetails.department == "MEANING")
				var department_condition_status = {
					$and: [{ meaning_assign_status: { $eq: "0" } }],
				}
			var group = (replace = sort = { $match: {} })
			if (req.admindetails.department == "AUDIO") {
				var department_condition_status = {
					$or: [
						{ audiomale_assign_status: { $eq: "0" } },
						{ audiofemale_assign_status: { $eq: "0" } },
					],
				}
				var group = {
					$group: {
						_id: "$tamil_word",
						doc: { $first: "$$ROOT" },
					},
				}
				var sort = {
					$sort: {
						"doc.audiomale_assign_status": -1,
						"doc.audiofemale_assign_status": -1,
					},
				}
				var replace = { $replaceRoot: { newRoot: "$doc" } }
			}
			if (status == "NEW") {
				var myAggregate = Word.aggregate([
					{ $match: searchvalue },
					{ $match: department_condition_status },
					group,
					sort,
					replace,
				])

				var wordsData = await Word.aggregatePaginate(myAggregate, options)
			} else {
				if (req.admindetails.department == "AUDIO") {
					var department_condition_status = {
						$or: [{ department: { $eq: "AUDIOMALE" } }, { department: { $eq: "AUDIOFEMALE" } }],
					}
				} else {
					var department_condition_status = {
						department: req.admindetails.department,
					}
				}
				var filter = {}
				if (req.query.filter) {
					var filter = { user_name: req.query.filter }
				}
				var sort = { $match: {} }
				if (req.query.field && req.query.order_by) {
					if (req.query.order_by == 1) {
						var sort = { $sort: { [req.query.field]: 1 } }
					} else {
						var sort = { $sort: { [req.query.field]: -1 } }
					}
				}

				var myAggregate = Processword.aggregate([
					{
						$match: {
							level_status: req.query.status,
						},
					},
					{ $match: department_condition_status },
					{ $match: filter },
					sort,

					{
						$lookup: {
							from: "words",
							localField: "word_detail", // field in the orders collection
							foreignField: "_id", // field in the items collection
							as: "words",
						},
					},
					{
						$addFields: {
							words: {
								$arrayElemAt: [
									{
										$filter: {
											input: "$words",
											as: "comp",
											cond: {
												$or: [
													{
														$regexMatch: {
															input: "$$comp.tamil_unique_word",
															regex: req.query.searchvalue,
															options: "i",
														},
													},
													{
														$regexMatch: {
															input: "$$comp.english_word",
															regex: req.query.searchvalue,
															options: "i",
														},
													},
												],
											},
										},
									},
									0,
								],
							},
						},
					},
					{
						$unwind: {
							path: "$words",
							preserveNullAndEmptyArrays: false,
						},
					},
				])

				var wordsData = await Processword.aggregatePaginate(myAggregate, options)
			}
		} else if (req.admindetails.role == "USER") {
			if (req.query.status == "COMPLETED") {
				var levelstatus = {
					$or: [{ level_status: { $eq: "COMPLETED" } }, { level_status: { $eq: "APPROVED" } }],
				}
			} else {
				var levelstatus = {
					level_status: req.query.status,
				}
			}

			var myAggregate = Processword.aggregate([
				{
					$match: {
						department: req.admindetails.department,
						user_id: mongoose.Types.ObjectId(req.admindetails._id),
					},
				},
				{ $match: levelstatus },

				{
					$lookup: {
						from: "words",
						localField: "word_detail", // field in the orders collection
						foreignField: "_id", // field in the items collection
						as: "words",
					},
				},
				{
					$addFields: {
						words: {
							$arrayElemAt: [
								{
									$filter: {
										input: "$words",
										as: "comp",
										cond: {
											$or: [
												{
													$regexMatch: {
														input: "$$comp.tamil_unique_word",
														regex: req.query.searchvalue,
														options: "i",
													},
												},
												{
													$regexMatch: {
														input: "$$comp.english_word",
														regex: req.query.searchvalue,
														options: "i",
													},
												},
											],
										},
									},
								},
								0,
							],
						},
					},
				},
				{
					$unwind: {
						path: "$words",
						preserveNullAndEmptyArrays: false,
					},
				},
			])

			var wordsData = await Processword.aggregatePaginate(myAggregate, options)
		}
		return wordsData
	} catch (e) {
		throw Error(e)
	}
}

/*END */

Date.prototype.getFormatDate = function () {
	var monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]
	return this.getDate() + " " + monthNames[this.getMonth()] + ", " + this.getFullYear()
}

async function WordOfDay() {
	try {
		let words_count = await Word.find().count()
		let word_of_day_count = await Word.find({ wordofday_status: 1 }).count()
		if (words_count == word_of_day_count) {
			await Word.updateAll({ wordofday_status: 0 })
		}

		let word_of_day = await Word.findOne({ wordofday_status: 0 }).limit(1)
		var singaporeTime = new Date().toLocaleString("en-US", {
			timeZone: "Asia/Singapore",
		})
		console.log("Singapore time: " + new Date(singaporeTime))
		var WordData = new Wordofday({
			word_id: word_of_day._id,
			date: new Date(singaporeTime).toISOString(),
		})

		var WordData = await WordData.save()
		word_of_day.wordofday_status = 1
		var update_data = await word_of_day.save()

		return word_of_day
	} catch (e) {
		console.log(e.message)
	}
}
/*End of list of words */

/* Download Excel */
exports.exceldownload = async function (req, res) {
	try {
		var url = process.env.BASE_URL
		var department = req.admindetails.department
		if (department == "AUDIO") {
			var cond = {
				department: { $in: ["AUDIOMALE", "AUDIOFEMALE"] },
				level_status: "APPROVED",
			}
		} else {
			var cond = {
				department: department,
				level_status: "APPROVED",
			}
		}
		var processword = await Processword.find(cond)
			.select("user_name")
			.select("department")
			.populate("word_detail")
			.lean()
		var workbook = new excel.Workbook()
		var worksheet = workbook.addWorksheet(department)

		var data = []
		processword.forEach(function (value) {
			var obj = {}

			if (department === "IMAGE") {
				obj.tamil_word = value.word_detail.tamil_unique_word
				obj.root_word = value.word_detail.tamil_word
				obj.english_word = value.word_detail.english_word
				obj.image = url + "/" + value.word_detail.image
				obj.department = value.department
				obj.username = value.user_name
				obj.completed_by = value.user_name
				obj.completed_on = value.word_detail.updatedAt
				worksheet.columns = [
					{ header: "Tamil Word", key: "tamil_word", width: 30 },
					{ header: "Root Word", key: "root_word", width: 30 },
					{ header: "English Word", key: "english_word", width: 30 },
					{ header: "Image", key: "image", width: 30 },
					{ header: "Department", key: "department", width: 30 },
					{ header: "Username", key: "username", width: 30 },
					{ header: "Completed By", key: "completed_by", width: 30 },
					{ header: "Completed on", key: "completed_on", width: 30 },
				]
			} else if (department === "MEANING") {
				obj.tamil_word = value.word_detail.tamil_unique_word
				obj.root_word = value.word_detail.tamil_word
				obj.english_word = value.word_detail.english_word
				obj.department = value.department
				obj.username = value.user_name
				obj.completed_by = value.user_name
				obj.completed_on = value.updatedAt
				obj.core_sense = value.word_detail.core_sense
				obj.etymology = value.word_detail.etymology
				obj.sub_sense = value.word_detail.sub_sense
				obj.grammer = value.word_detail.grammer
				obj.synonym = value.word_detail.synonym
				obj.example = value.word_detail.example
				obj.completed_by = value.user_name
				obj.completed_on = value.word_detail.updatedAt
				worksheet.columns = [
					{ header: "Tamil Word", key: "tamil_word", width: 30 },
					{ header: "Root Word", key: "root_word", width: 30 },
					{ header: "English Word", key: "english_word", width: 30 },
					{ header: "Image", key: "image", width: 30 },
					{ header: "Department", key: "department", width: 30 },
					{ header: "Username", key: "username", width: 30 },
					{ header: "Core Sense", key: "core_sense", width: 30 },
					{ header: "Etymology", key: "etymology", width: 30 },
					{ header: "Sub Sense", key: "sub_sense", width: 30 },
					{ header: "Grammar", key: "grammer", width: 30 },
					{ header: "Synonym", key: "synonym", width: 30 },
					{ header: "Example", key: "example", width: 30 },
					{ header: "Completed By", key: "completed_by", width: 30 },
					{ header: "Completed on", key: "completed_on", width: 30 },
				]
			} else if (department == "AUDIO") {
				obj.root_word = value.word_detail.tamil_word
				obj.english_word = value.word_detail.english_word
				obj.department = value.department
				obj.username = value.user_name
				obj.completed_by = value.user_name
				obj.completed_on = value.word_detail.updatedAt
				if (value.department == "AUDIOMALE") obj.audio = url + "/" + value.word_detail.audiomale
				else {
					obj.audio = url + "/" + value.word_detail.audiofemale
				}

				worksheet.columns = [
					{ header: "Root Word", key: "root_word", width: 30 },
					{ header: "English Word", key: "english_word", width: 30 },
					{ header: "Audio", key: "audio", width: 30 },
					{ header: "Department", key: "department", width: 30 },
					{ header: "Username", key: "username", width: 30 },
					{ header: "Completed By", key: "completed_by", width: 30 },
					{ header: "Completed on", key: "completed_on", width: 30 },
				]
			} else if (department === "ENGLISH") {
				obj.tamil_word = value.word_detail.tamil_unique_word
				obj.root_word = value.word_detail.tamil_word
				obj.english_word = value.word_detail.english_word
				obj.department = value.department
				obj.username = value.user_name
				obj.completed_by = value.user_name
				obj.completed_on = value.word_detail.updatedAt
				worksheet.columns = [
					{ header: "Tamil Word", key: "tamil_word", width: 30 },
					{ header: "Root Word", key: "root_word", width: 30 },
					{ header: "English Word", key: "english_word", width: 30 },
					{ header: "Department", key: "department", width: 30 },
					{ header: "Username", key: "username", width: 30 },
					{ header: "Completed By", key: "completed_by", width: 30 },
					{ header: "Completed on", key: "completed_on", width: 30 },
				]
			}

			data.push(obj)
		})

		worksheet.addRows(data)
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		)
		res.setHeader("Content-Disposition", "attachment; filename=" + "English.xlsx")

		return workbook.xlsx.write(res).then(function () {
			res.status(200).end()
		})
	} catch (e) {
		throw Error(e)
	}
}

/* End */
