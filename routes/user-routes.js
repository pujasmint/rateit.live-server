const express = require("express");
const router = express.Router();
const Session = require("../models/session-model");
const User = require("../models/user-model");

router.post("/details", function(req, res, next) {
  User.findOne({ _id: req.body.userId })
    .then(user => {
      Session.find({ creator: req.body.userId })
        .then(sessions => {
          const mappedSession = sessions.map(session => ({
            name: session.name,
            rating: session.rating,
            status: session.status,
            totalAudience: session.totalAudience,
            link: `session/${session._id}`
          }));
          if (req.user && req.user._id.toString() === req.body.userId) {
            res.status(200).json({ sessions: mappedSession, user });
          } else {
            const finishedSessions = mappedSession.filter(
              session => session.status === "FINISHED"
            );
            res.status(200).json({ sessions: finishedSessions, user });
          }
        })
        .catch(() => {
          res.status(500).send("error");
        });
    })
    .catch(() => {
      res.status(500).send("error");
    });
});

module.exports = router;
