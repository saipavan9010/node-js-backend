const mongoose = require("mongoose");
const Admins = require("./seeders/admins.seeder");
const Roles = require("./seeders/roles.seeder");
const Organisations = require("./seeders/organisations.seeder");
const Departments = require("./seeders/department.seeder");
const Permissions = require("./seeders/permissions.seeder");
const Rolepermissions = require("./seeders/rolepermissions.seeder");
require("dotenv").config();

const mongoURL = process.env.DB_URL;

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
const seedersList = {
  Admins,
  Roles,
  Organisations,
  Departments,
  Permissions,
  Rolepermissions,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
const dropdb = async () => mongoose.connection.db.dropDatabase();

module.exports = { seedersList, connect, dropdb };
