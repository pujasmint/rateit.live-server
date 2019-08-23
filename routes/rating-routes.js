const express = require("express");
const router = express.Router();
const Rating = require("../models/rating-model");
const Session = require("../models/session-model");
const SessionRating = require("../models/session-rating-model");

router.post("/user", function(req, res, next) {
  Session.findOne({ invitekey: req.body.invitekey.toUpperCase() })
    .populate("creator")
    .then(session => {
      Rating.findOne({ fp: req.body.fp, session: session._id }, function(
        err,
        rating
      ) {
        if (err) {
          res.status(500).json({ message: "Problem with getting user rating" });
        } else {
          res.status(200).json({ session, rating });
        }
      });
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ message: "Invite key not found" });
    });
});

router.post("/update", function(req, res, next) {
  Session.findOne({ invitekey: req.body.invitekey.toUpperCase() }, (err, session) => {
    if (err) {
      res.status(500).json({ session, rating: null });
    } else {
      if (session.status === "NOTSTARTED") {
        res.status(500).json({ message: "Session not started yet" });
      } else if (session.status === "FINISHED") {
        res.status(500).json({ message: "Session already over" });
      } else {
        Rating.findOneAndUpdate(
          { fp: req.body.fp, session: session._id },
          { rating: req.body.rating },
          { upsert: true, new: true },
          function(err, rating) {
            if (err) {
              res
                .status(500)
                .json({ message: "Problem with user rating update" });
            } else {
              Rating.find({ session: session._id }, (err, allRatings) => {
                if (err) {
                  res.status(500).json({
                    message: "Problem with finding all ratings of session"
                  });
                } else {
                  const totalRating = allRatings.reduce(
                    (tot, userRating) => tot + userRating.rating,
                    0
                  );
                  const averageRating = totalRating / allRatings.length;
                  const newSessionRating = {
                    session: session._id,
                    time: req.body.time,
                    rating: averageRating
                  };
                  SessionRating.create(newSessionRating)
                    .then(sessionRating => {
                      res.status(200).json({ session, rating });
                    })
                    .catch(e => {
                      console.log(e);
                      res.status(500).json({
                        message: "Problem with updating session average rating"
                      });
                    });
                }
              });
            }
          }
        );
      }
    }
  });
});

module.exports = router;
