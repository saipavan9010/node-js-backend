const { Seeder } = require("mongoose-data-seed");
const permissions = require("../models/Permission.model");
var data = [
  {
    display_name: "English Word",
    group_name: "WORD",
    name: "english-word",
  },
  {
    display_name: "Meanings",
    group_name: "WORD",
    name: "meanings-word",
  },
  {
    display_name: "Audio Male ",
    group_name: "WORD",
    name: "word-audio-male",
  },
  {
    display_name: "Audio Female",
    group_name: "WORD",
    name: "word-audio-female",
  },
  {
    display_name: "Image",
    group_name: "WORD",
    name: "word-image",
  },
  {
    display_name: "BULK Tamil Word UPLOAD",
    group_name: "WORD",
    name: "word-upload",
  },
  {
    display_name: "BULK Meanings  UPLOAD",
    group_name: "WORD",
    name: "meaning-upload",
  },
  {
    display_name: "ASSIGN WORD",
    group_name: "WORD",
    name: "assign-word",
  },

  {
    display_name: "List",
    group_name: "WORD",
    name: "word-list",
  },
  {
    display_name: "List",
    group_name: "CMS PAGE",
    name: "cms-list",
  },
  {
    display_name: "EDIT/CREATE",
    group_name: "CMS PAGE",
    name: "cms-edit",
  },
  {
    display_name: "CREATE",
    group_name: "ROLE",
    name: "add-role",
  },
  {
    display_name: "EDIT",
    group_name: "ROLE",
    name: "edit-role",
  },
  {
    display_name: "LIST",
    group_name: "ROLE",
    name: "role-list",
  },
  {
    display_name: "LIST",
    group_name: "ORGANISATION",
    name: "organisation-list",
  },
  {
    display_name: "CREATE",
    group_name: "ORGANISATION",
    name: "add-organisation",
  },
  {
    display_name: "EDIT",
    group_name: "ORGANISATION",
    name: "edit-organisation",
  },
  {
    display_name: "LIST",
    group_name: "DEPARTMENT",
    name: "list-department",
  },
  {
    display_name: "CREATE",
    group_name: "DEPARTMENT",
    name: "add-department",
  },
  {
    display_name: "EDIT",
    group_name: "DEPARTMENT",
    name: "edit-department",
  },
  {
    display_name: "DEPARTMENT USERS LIST",
    group_name: "DEPARTMENT",
    name: "users-list",
  },
];

class PermissionsSeeder extends Seeder {
  async shouldRun() {
    return permissions
      .countDocuments()
      .exec()
      .then((count) => count === 0);
  }

  async run() {
    return permissions.create(data);
  }
}

module.exports = PermissionsSeeder;
