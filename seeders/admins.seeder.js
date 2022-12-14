const { Seeder } = require("mongoose-data-seed");
const admin = require("../models/admin.model");
var bcrypt = require("bcryptjs");
var hashedPassword = bcrypt.hashSync("cdp123*", 8);
const data = [
  {
    username: "cosmic",
    name: "COSMIC",
    email: "cosmic@mail.com",
    password: hashedPassword,
    role: "SUPERADMIN",
    organisation: "COSMIC",
    department: "OVERALLADMIN",
    status: "Active",
  },
  {
    username: "ctsg",
    name: "CTSG",
    email: "ctsg@mail.com",
    password: hashedPassword,
    role: "SUPERADMIN",
    organisation: "CTSG",
    department: "OVERALLADMIN",
    status: "Active",
  },
  {
    username: "english",
    name: "ENGLISH APPROVER",
    email: "english@mail.com",
    password: hashedPassword,
    role: "APPROVER",
    organisation: "CTSG",
    department: "ENGLISH",
    status: "Active",
  },
  {
    username: "eu1",
    name: "ENGLISH USER 1",
    email: "eu1@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "ENGLISH",
    status: "Active",
  },
  {
    username: "eu2",
    name: "ENGLISH USER 2",
    email: "eu2@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "ENGLISH",
    status: "Active",
  },
  {
    username: "image",
    name: "IMAGE APPROVER",
    email: "image@mail.com",
    password: hashedPassword,
    role: "APPROVER",
    organisation: "CTSG",
    department: "IMAGE",
    status: "Active",
  },
  {
    username: "img1",
    name: "IMAGE USER 1",
    email: "img1@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "IMAGE",
    status: "Active",
  },
  {
    username: "img2",
    name: "IMAGE USER 2",
    email: "img2@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "IMAGE",
    status: "Active",
  },
  {
    username: "audio",
    name: "AUDIO APPROVER",
    email: "audio@mail.com",
    password: hashedPassword,
    role: "APPROVER",
    organisation: "CTSG",
    department: "AUDIO",
    status: "Active",
  },
  {
    username: "audiomale",
    name: "ADUIO MALE USER",
    email: "audiomale@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "AUDIOMALE",
    status: "Active",
  },
  {
    username: "audiofemale",
    name: "AUDIO FEMALE USER",
    email: "audiofemale@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "AUDIOFEMALE",
    status: "Active",
  },
  {
    username: "meaning",
    name: "MEANING APPROVER",
    email: "meaning@mail.com",
    password: hashedPassword,
    role: "APPROVER",
    organisation: "CTSG",
    department: "MEANING",
    status: "Active",
  },
  {
    username: "mu1",
    name: "MEANING USER 1",
    email: "mu1@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "MEANING",
    status: "Active",
  },
  {
    username: "mu2",
    name: "MEANING USER 2",
    email: "mu2@mail.com",
    password: hashedPassword,
    role: "USER",
    organisation: "CTSG",
    department: "MEANING",
    status: "Active",
  },
];

class AdminsSeeder extends Seeder {
  async shouldRun() {
    return admin
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return admin.create(data);
  }
}

module.exports = AdminsSeeder;
