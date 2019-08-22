const express = require("express");
const router = express.Router();
const Session = require("../models/session-model");
const SessionRating = require("../models/session-rating-model");
const User = require("../models/user-model");
var randomstring = require("randomstring");

router.post("/create", function(req, res, next) {
  if (req.isAuthenticated()) {
    let newSession = {
      name: req.body.name,
      invitekey: randomstring.generate({
        length: 5,
        readable: true,
        charset: "alphanumeric",
        capitalization: "uppercase"
      }),
      status: "NOTSTARTED",
      creator: req.user._id
    };
    Session.create(newSession)
      .then(session => {
        res.status(200).json(session);
      })
      .catch(() => {
        res.send("error");
      });
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

router.post("/update", function(req, res, next) {
  if (req.isAuthenticated()) {
    Session.findOneAndUpdate(
      { _id: req.body.id },
      { status: req.body.status },
      { upsert: true, new: true },
      function(err, session) {
        if (err) return res.send(500, { error: err });
        return res.status(200).json(session);
      }
    );
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

router.post("/finish", function(req, res, next) {
  if (req.isAuthenticated()) {
    const sessionRating = parseFloat(req.body.rating) || 0;
    const audienceCount = parseFloat(req.body.totalAudience) || 0;
    Session.findOneAndUpdate(
      { _id: req.body.id },
      {
        status: req.body.status,
        rating: sessionRating,
        totalAudience: audienceCount
      },
      { upsert: true, new: true },
      function(err, session) {
        if (err) return res.send(500, { error: err });
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            rating:
              (req.user.rating * req.user.totalSessions + session.rating) /
              (req.user.totalSessions + 1),
            totalSessions: req.user.totalSessions + 1
          },
          { upsert: true, new: true },
          function(err, user) {
            if (err) return res.send(500, { error: err });
            return res.status(200).json(session);
          }
        );
      }
    );
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

module.exports = router;
