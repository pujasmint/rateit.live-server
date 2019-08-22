const express = require("express");
const router = express.Router();
const Rating = require("../models/rating-model");
const Session = require("../models/session-model");
const SessionRating = require("../models/session-rating-model");

router.post("/details", function(req, res, next) {
  Session.findOne({ _id: req.body.sessionId })
    .populate("creator")
    .then(session => {
      Rating.find({ session: req.body.sessionId }, function(
        err,
        allUserRating
      ) {
        if (err) {
          res
            .status(500)
            .json({ message: "Problem with getting all user ratings" });
        } else {
          if (allUserRating.length === 0) {
            res
              .status(200)
              .json({ session, userRatings: null, sessionRatings: null });
          } else {
            SessionRating.find({ session: req.body.sessionId }, function(
              err,
              sessionRatings
            ) {
              if (err) {
                res
                  .status(500)
                  .json({ message: "Problem in finding session ratings" });
              } else {
                const totalAudience = allUserRating.length;
                const userRatingsByCategory = allUserRating.reduce(
                  (groupedRating, userRating) => {
                    if (groupedRating[userRating.rating]) {
                      groupedRating[userRating.rating] =
                        groupedRating[userRating.rating] + 1;
                    } else {
                      groupedRating[userRating.rating] = 1;
                    }
                    return groupedRating;
                  },
                  {}
                );
                const lastRating = sessionRatings[
                  sessionRatings.length - 1
                ].rating.toFixed(2);
                const sessionRatingsByTime = sessionRatings.reduce(
                  (allSessionRatings, sessionRating) => {
                    allSessionRatings[sessionRating.time] =
                      sessionRating.rating;
                    return allSessionRatings;
                  },
                  {}
                );

                res.status(200).json({
                  session,
                  totalAudience,
                  lastRating,
                  userRatings: userRatingsByCategory,
                  sessionRatings: sessionRatingsByTime
                });
              }
            });
          }
        }
      });
    })
    .catch(e => {
      console.log(e);
      res.status(500).json({ message: "Session Id Not Found" });
    });
});

module.exports = router;
