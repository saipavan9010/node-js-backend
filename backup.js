const fs = require("fs")
const _ = require("lodash")
const exec = require("child_process").exec
const path = require("path")
require("dotenv").config()

// Concatenate root directory path with our backup folder.
const backupDirPath = path.join(process.env.bdbackup, "database-backup")

const dbOptions = {
	uri: process.env.DB_URL,
	autoBackup: true,
	removeOldBackup: true,
	keepLastDaysBackup: 30,
	autoBackupPath: backupDirPath,
}

// return stringDate as a date object.
exports.stringToDate = (dateString) => {
	return new Date(dateString)
}

// Check if variable is empty or not.
exports.empty = (mixedVar) => {
	let undef, key, i, len
	const emptyValues = [undef, null, false, 0, "", "0"]
	for (i = 0, len = emptyValues.length; i < len; i++) {
		if (mixedVar === emptyValues[i]) {
			return true
		}
	}
	if (typeof mixedVar === "object") {
		for (key in mixedVar) {
			return false
		}
		return true
	}
	return false
}

// Auto backup function
exports.dbAutoBackUp = () => {
	// check for auto backup is enabled or disabled
	if (dbOptions.autoBackup == true) {
		let date = new Date()
		let beforeDate, oldBackupDir, oldBackupPath

		// Current date
		currentDate = this.stringToDate(date)
		let newBackupDir =
			currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate()

		// New backup path for current backup process
		let newBackupPath = dbOptions.autoBackupPath + "-mongodump-" + newBackupDir
		// check for remove old backup after keeping # of days given in configuration
		if (dbOptions.removeOldBackup == true) {
			beforeDate = _.clone(currentDate)
			// Substract number of days to keep backup and remove old backup
			beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup)
			oldBackupDir =
				beforeDate.getFullYear() + "-" + (beforeDate.getMonth() + 1) + "-" + beforeDate.getDate()
			// old backup(after keeping # of days)
			oldBackupPath = dbOptions.autoBackupPath + "mongodump-" + oldBackupDir
		}

		// Command for mongodb dump process
		let cmd = "mongodump --out " + newBackupPath + " --uri=" + dbOptions.uri
		// var path = "C:/Program Files/" + "MongoDB/" + "Server/4.0/bin";
		// console.log(path);

		exec(cmd, { cwd: process.env.mongodump }, (error, stdout, stderr) => {
			if (this.empty(error)) {
				console.log("sucess")
				// check for remove old backup after keeping # of days given in configuration.
				if (dbOptions.removeOldBackup == true) {
					if (fs.existsSync(oldBackupPath)) {
						exec("rm -rf " + oldBackupPath, (err) => {})
					}
				}
			} else {
				console.log(error)
			}
		})
	}
}
