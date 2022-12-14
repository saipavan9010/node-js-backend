var jwt = require("jsonwebtoken");

var Authorization = function (options) {
  return function (req, res, next) {
    var token = req.headers["authorization"];
    var msg = { auth: false, message: "No token provided." };
    if (!token) res.status(500).send(msg);
    jwt.verify(token, process.env.SECRET, async function (err, data) {
      var msg = { auth: false, message: "Failed to authenticate token." };

      if (err) {
        res.status(500).send(msg);
        if (
          req.session.admintoken != undefined &&
          req.session.admintoken[token]
        ) {
          delete req.session.admintoken[token];
        }
      }

      if (
        req.session.admintoken != undefined &&
        req.session.admintoken[token]
      ) {
        res.status(500).send({ auth: false, message: "Token is Invalid" });
      }

      if (!data.admin)
        res.status(500).send({ auth: false, message: "Token is Not valid" });

      req.admindetails = data.admin;
      next();
    });
  };
};

var userAuthorization = function (options) {
  return function (req, res, next) {
    var header = req.headers["authorization"];
    var msg = { auth: "Bearer", message: "No token provided." };
    if (!header) res.status(500).send(msg);

    var headerPart = header.split(" ");
    var msg = { auth: false, message: "Failed to authenticate token." };
    if (headerPart.length != 2 && headerPart[0] != "Bearer") {
      res.status(500).send(msg);
    }
    var token = header.replace("Bearer ", "");

    jwt.verify(token, process.env.SECRET, function (err, data) {
      var msg = { auth: token, message: "Failed to authenticate token." };

      if (err) {
        res.status(500).send(msg);
        if (
          req.session.usertoken != undefined &&
          req.session.usertoken[token]
        ) {
          delete req.session.usertoken[token];
        }
      }

      if (req.session.usertoken != undefined && req.session.usertoken[token]) {
        res.status(500).send({ auth: false, message: "Token is Invalid" });
      }
      if (!data.user)
        res.status(500).send({ auth: false, message: "Token is Not valid" });

      req.userdetails = data.user;
      next();
    });
  };
};

module.exports = { Authorization, userAuthorization };
