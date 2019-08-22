const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

router.post("/profession", function(req, res, next) {
  User.find({ profession: req.body.profession })
    .then(users => {
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(500).json({ message: "No Professionals in this category" });
      }
    })
    .catch(() => {
      res.status(500).send("error");
    });
});

module.exports = router;
