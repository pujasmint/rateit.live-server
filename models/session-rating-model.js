const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectID;

const sessionRatingSchema = new Schema(
  {
    session: { type: ObjectId, ref: "sessions" },
    time: Date,
    rating: Number
  },
  {
    timestamps: true
  }
);

const SessionRating = mongoose.model("sessionrating", sessionRatingSchema);
module.exports = SessionRating;
