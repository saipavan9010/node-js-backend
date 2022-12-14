var WordService = require("../services/word.service");
var Word = require("../models/word.model");
const { body, validationResult, oneOf } = require("express-validator");
var xlsxtojson = require("xlsx-to-json-lc");
var xlstojson = require("xls-to-json-lc");
var fs = require("fs");
const { exists } = require("../models/word.model");

/*To create words */
exports.createWord = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    var createWord = await WordService.createWord(req);
    return res
      .status(200)
      .json({ data: createWord, message: "word added successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word creating */

/*Word update */
exports.UpdateWord = async function (req, res, next) {
  console.log(req.file);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    var updateWord = await WordService.UpdateWord(req);
    return res
      .status(200)
      .json({ data: updateWord, message: "Updated Sucessfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word update */

/*Edit words */
exports.editWord = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  try {
    var editWord = await WordService.editWord(req);
    return res
      .status(200)
      .json({ data: editWord, message: "Word is Updated Succesfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of edit words */

/*Getting word lists */
exports.getwordslist = async function (req, res, next) {
  try {
    var listWord = await WordService.listWord(req);
    return res.status(200).json({ data: listWord });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of getting word lists */

/*Word update status */
exports.Wordupdatestatus = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var wordDetails = await WordService.Wordupdatestatus(req);
    return res.status(200).json({ data: wordDetails });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word update status */

/*word count status*/
exports.StatusWordCount = async function (req, res, next) {
  try {
    var dashboard = await WordService.StatusWordCount(req);
    return res.status(200).json({
      data: dashboard,
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of word count status */

/*To get tracked word details */
exports.getwordtrackdetail = async function (req, res) {
  try {
    var TrackWord = await WordService.getWordtrackDetail(req);
    return res.status(200).json({ data: TrackWord });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of tracked word details */

/*To Assign words to Users */
exports.assignWords = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var Assignwords = await WordService.assignWords(req);
    return res
      .status(200)
      .json({ data: Assignwords, message: "Words Assigned Succesfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*English Word Update */
exports.englishWord = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var englishWords = await WordService.englishWord(req);
    return res.status(200).json({ data: englishWords });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*Meaning Word Update */
exports.wordMeanings = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var wordMeanings = await WordService.wordMeanings(req);
    return res
      .status(200)
      .json({ data: wordMeanings, message: "English Word Added Successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*Meaning Word Update */
exports.wordMeanings = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var wordMeanings = await WordService.wordMeanings(req);
    return res
      .status(200)
      .json({ data: wordMeanings, message: "Meaning Added Successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/* Word Image Update */
exports.wordImage = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var wordImage = await WordService.wordImage(req);
    return res
      .status(200)
      .json({ data: wordImage, message: "Image Added Successfully" });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/* Word Audio male Update */
exports.wordAudiomale = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var wordAudiomale = await WordService.wordAudiomale(req);
    return res.status(200).json({
      data: wordAudiomale,
      message: "Audio male Added Successfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/* Word Audio Female Update */
exports.wordAudiofemale = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var wordAudiofemale = await WordService.wordAudiofemale(req);
    return res.status(200).json({
      data: wordAudiofemale,
      message: "Audio Female Added Successfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*  Word Status Update */
exports.wordStatus = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var wordStatus = await WordService.wordStatus(req);
    return res.status(200).json({
      data: wordStatus,
      message: "Status Added Successfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/* Overall Word Status Update */
exports.overallStatus = async function (req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      var error = errors.array();
      throw Error(error[0].msg);
    }
    var overallStatus = await WordService.overallStatus(req);
    return res.status(200).json({
      data: overallStatus,
      message: "Word Status Added Successfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*  Words Update */
exports.wordsDelete = async function (req, res) {
  try {
    var data = await WordService.wordsDelete(req);
    return res.status(200).json({
      message: "Words Deleted Successfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*  Meaning Update */
exports.wordsUpdate = async function (req, res) {
  try {
    var data = await Word.updateMany(
      {},
      {
        grammer: "தரவு செயல்பாட்டில் உள்ளது",
        core_sense: "தரவு செயல்பாட்டில் உள்ளது",
        sub_sense: "தரவு செயல்பாட்டில் உள்ளது",
        synonym: "தரவு செயல்பாட்டில் உள்ளது",
        example: "தரவு செயல்பாட்டில் உள்ளது",
        homophones: "தரவு செயல்பாட்டில் உள்ளது",
        idioms_phrases: "தரவு செயல்பாட்டில் உள்ளது",
        etymology: "தரவு செயல்பாட்டில் உள்ளது",
      }
    );
    return res.status(200).json({
      message: "Words Update Successfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*  Words Delete */
exports.processWordsDelete = async function (req, res) {
  try {
    var data = await WordService.processWordsDelete(req);
    return res.status(200).json({
      message: "ProcessWords Deleted Successfully",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End*/

/*File upload */
exports.fileupload = async function (req, res) {
  if (!req.files.word_file)
    return res.status(422).send({ message: "File is Required", data: null }); // return res.status(400).send(req.files.word_file[0]);
  var exceltojson;
  if (req.files.word_file[0].originalname.split(".")[1] === "xlsx") {
    exceltojson = xlsxtojson;
  } else if (req.files.word_file[0].originalname.split(".")[1] === "xls") {
    exceltojson = xlstojson;
  } else {
    return res
      .status(422)
      .send({ message: "Please Upload a XLXS or XLS", data: null });
  }

  try {
    await exceltojson(
      {
        input: req.files.word_file[0].path, //the same path where we uploaded our file
        output: null, //since we don't need output.json
        lowerCaseHeaders: true,
      },
      async function (err, result) {
        if (err) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res
            .status(422)
            .json({ error_code: 1, err_desc: err, data: null });
        }

        if (result.length == 0) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res.status(422).json({
            error_code: 1,
            err_desc: err,
            message: "Excel Consists Empty Data",
            data: null,
          });
        } else if (result.length > 10000) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res.status(422).json({
            error_code: 1,
            err_desc: err,
            message: "Excel Data Exceeds 10000",
            data: null,
          });
        } else if (
          result[0].group == undefined ||
          result[0].word == undefined
        ) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res.status(422).json({
            error_code: 1,
            err_desc: err,
            message: "File contains no record",
            data: null,
          });
        }
        var tamil_unique_word = [];
        tamil_unique_word = result.map(function (itm) {
          return itm.word;
        });
        var exist_data = await Word.find({
          tamil_unique_word: { $in: tamil_unique_word },
        })
          .select("tamil_unique_word")
          .lean();

        exist_data = exist_data.map(function (tamil_words) {
          return tamil_words.tamil_unique_word;
        });

        var new_data = [];
        result.map(async function (word, index) {
          try {
            var data = {};
            if (word.group != "" && word.word != "") {
              if (!exist_data.includes(word.word)) {
                console.log(word.word);

                data.level1_status = "NEW";
                data.level3_status = "NEW";
                data.tamil_word = word.group;
                data.tamil_unique_word = word.word;
                data.image = word.image ? word.image : "words/no-image.jpg";
                data.english_assign_status = "0";
                data.image_assign_status = "0";
                data.audiomale_assign_status = "0";
                data.audiofemale_assign_status = "0";
                data.createdAt = new Date();
                data.updatedAt = new Date();
                new_data.push(data);
              } else {
                await Word.updateOne(
                  { tamil_unique_word: word.word },
                  {
                    $set: {
                      tamil_unique_word: word.word,
                      level3_status: "NEW",
                      tamil_word: word.group,
                      updatedAt: new Date(),
                    },
                  }
                );
              }
            }
          } catch (e) {
            throw Error(e);
          }
        });
        if (new_data.length > 0) {
          try {
            Word.insertMany(new_data)
              .then(function (data) {
                res.status(200).json({
                  message: "Data Upload successfully",
                });
              })
              .catch(function (error) {
                console.log(error); // Failure
              });
          } catch (e) {
            throw Error(e);
          }
        } else {
          fs.unlinkSync(req.files.word_file[0].path);
          res.status(200).json({
            message: "Data Upload successfully",
          });
        }
      }
    );
  } catch (e) {
    fs.unlinkSync(req.files.word_file[0].path);
    res
      .status(422)
      .json({ error_code: 1, message: "Corupted excel file", data: null });
  }
};
/*End pof file upload */

/*Meaning upload */
exports.meaningupload = async function (req, res) {
  if (!req.files.word_file)
    return res.status(422).send({ message: "File is Required", data: null });
  // return res.status(400).send(req.files.word_file[0]);
  var exceltojson;
  if (req.files.word_file[0].originalname.split(".")[1] === "xlsx") {
    exceltojson = xlsxtojson;
  } else if (req.files.word_file[0].originalname.split(".")[1] === "xls") {
    exceltojson = xlstojson;
  } else {
    return res
      .status(422)
      .send({ message: "Please Upload a XLXS or XLS", data: null });
  }

  try {
    await exceltojson(
      {
        input: req.files.word_file[0].path, //the same path where we uploaded our file
        output: null, //since we don't need output.json
        lowerCaseHeaders: true,
      },
      function (err, result) {
        if (err) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res
            .status(422)
            .json({ error_code: 1, err_desc: err, data: null });
        }

        if (result.length == 0) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res.status(422).json({
            error_code: 1,
            err_desc: err,
            message: "Excel Consists Empty Data",
            data: null,
          });
        } else if (result.length > 2000) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res.status(422).json({
            error_code: 1,
            err_desc: err,
            message: "Excel Data Exceeds 2000",
            data: null,
          });
        } else if (result[0].word == undefined) {
          fs.unlinkSync(req.files.word_file[0].path);
          return res.status(422).json({
            error_code: 1,
            err_desc: err,
            message: "File contains no record",
            data: null,
          });
        } else var bulkwords = Word.collection.initializeUnorderedBulkOp();

        result.forEach(function (word, index) {
          var data = {};
          if (word.word != "") {
            data.grammer = word.grammer;
            data.core_sense = word.coresense;
            data.sub_sense = word.subsense;
            data.synonym = word.synonym;
            data.example = word.example;
            data.homophones = word.homophones;
            data.idioms_phrases = word.idiomsphrases;
            data.etymology = word.etymology;
            data.meaning_assign_status = "0";
            data.updatedAt = new Date();
            var query = { tamil_unique_word: word.word };
            bulkwords.find(query).update({
              $set: {
                level2_status: "NEW",
                grammer: data.grammer,
                core_sense: data.core_sense,
                sub_sense: data.sub_sense,
                synonym: data.synonym,
                example: data.example,
                homophones: data.homophones,
                idioms_phrases: data.idioms_phrases,
                etymology: data.etymology,
                meaning_assign_status: "0",
                updatedAt: new Date(),
              },
            });
          }
        });
        bulkwords.execute(function (err, words) {
          if (err) {
            fs.unlinkSync(req.files.word_file[0].path);
            return res.status(422).json({
              error_code: 1,
              err_desc: err,
              message: "Invalid file format",
              data: null,
            });
          }
          fs.unlinkSync(req.files.word_file[0].path);
          res
            .status(200)
            .json({ message: "Meaning data upload successfully", data: words });
        });
      }
    );
  } catch (e) {
    fs.unlinkSync(req.files.word_file[0].path);
    res
      .status(422)
      .json({ error_code: 1, message: "Corupted excel file", data: null });
  }
};
/*End pof file upload */

/*Getting word lists */
exports.approvedwordslist = async function (req, res, next) {
  try {
    var listWord = await WordService.ApprovalStatus(req);
    return res.status(200).json({ data: listWord });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
/*End of getting word lists */

/* download excel  */
exports.exceldownload = async function (req, res) {
  try {
    // Calling the Service function with the new object from the Request Body
    var siteSettingsdata = await WordService.exceldownload(req, res);
    //console.log( userLists);
    return res.status(200).json({
      message: siteSettingsdata,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

/*End   */

/* Overall admin data  */
exports.overalladmindata = async function (req, res) {
  try {
    // Calling the Service function with the new object from the Request Body
    var overalldata = await WordService.overalladmindata(req, res);
    //console.log( userLists);
    return res.status(200).json({
      data: overalldata,
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

/*End   */

exports.validate = (method) => {
  switch (method) {
    case "add-word": {
      return [
        body("tamil_word", "tamil word is required").exists(),
        body("english_word", "english word is required").exists(),
        body("english_word", "English word should conatins 3 letters").isLength(
          {
            min: 3,
          }
        ),
        body(
          "tamil_word",
          "tamil words does not contain english words "
        ).matches("[\u00BF-\u1FFF\u2C00-\uD7FFw]"),
        body(
          "tamil_word",
          "tamil words does not contain special character "
        ).matches(/^[^*|\":<>[\]{}`\\()';@&!%#^()$]+$/),
        body(
          "english_word",
          " english word does not contain any special character, numeric and tamil word"
        ).matches(/^[A-Za-z]+$/),
      ];
    }
    case "edit-word": {
      return [
        body("word_level", "word level is required").exists(),
        body("word_id", "word id is required").exists(),
      ];
    }
    // case "word-status": {
    //   return [
    //     body("level_status", "level status is required").exists(),
    //     body("word_id", "word id is required").exists(),
    //     body("status", "status is required").exists(),
    //   ];
    // }

    case "assign-words": {
      return [body("assign_to", "Assign to  is required").exists()];
    }

    case "english-word": {
      return [
        body("word_id", "Word Id is required").exists(),
        body("english_word", "English Word is required").exists(),
        body(
          "english_word",
          "English word should contain atleast 3 letters"
        ).isLength({
          min: 3,
        }),
        body(
          "english_word",
          "english update word does not contain any special character, numeric and tamil word"
        ).matches(/^[a-zA-Z ]*$/),
      ];
    }

    case "meanings-word": {
      return [
        body("beginners", "Beginners is required").exists(),
        body("intermediate", "Intermediate  is required").exists(),
        body("professional", "Professional  is required").exists(),
        body("simple_meaning", "Simple Meaning  is required").exists(),
        body("word_id", "Word Id is required").exists(),
      ];
    }

    case "word-image": {
      return [
        body("word_id", "Word Id is required").exists(),
        // body("word_id","word image does not contain greater than 2 mb").matches(/(\d+)X(\d+)/g)
        //body("word_id", "Image only contain jpg").matches(/.(jpg|jpeg|png|gif)$/)
        //body("([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg)$").exists,
        //body("word_id","Image doe contain only png,jpg and jpeg format only").exists,
        // body("image", "Image is required").custom((value, { req }) => {
        //   console.log(req.files.image[0].filename == null);
        //   req.files.image[0].filename != null;
        // }),
      ];
    }

    case "word-audio-male": {
      return [
        // body("audio", "Audio format only allow mp3 format").matches('/^\d+\. (.*) - (.*)\.mp3$/'),
        body("tamil_word", "Tamil Word is required").exists(),
        //body("audio.files.audio[0]", "Audio Id is required").notEmpty(),
        //oneOf(body('audio','Audio Id is required'))
        // body("audio", "Audio Id is required").exists(),
        //body("word_id", "Audio does contain only mp3 format only").matches(/\.(?:wav|mp3)$/i),

        // body("image", "Image is required").custom((value, { req }) => {
        //   console.log(req.files.image[0].filename == null);
        //   req.files.image[0].filename != null;
        // }),
      ];
    }
    case "word-audio-female": {
      return [
        body("tamil_word", "Tamil Word is required").exists(),
        // body("image", "Image is required").custom((value, { req }) => {
        //   console.log(req.files.image[0].filename == null);
        //   req.files.image[0].filename != null;
        // }),
      ];
    }
    case "word-status": {
      return [
        body("word_id", "Word Id is required").exists(),
        body("status", "Status is required").exists(),
        body("department", "Department is required").exists(),
      ];
    }

    case "overalllevel-status": {
      return [
        body("word_id", "Word Id is required").exists(),
        body("status", "Status is required").exists(),
        body("level", "Level is required").exists(),
      ];
    }
  }
};
