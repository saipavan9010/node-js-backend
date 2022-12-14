const winston = require("winston");
require("winston-mongodb");
require("dotenv").config();

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      ),
    }),
    new winston.transports.MongoDB({
      level: "error",
      db: process.env.DB_URL,
      collection: "errorlogs",
    }),
  ],
});

module.exports = logger;
