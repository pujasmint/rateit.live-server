const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectID;

const ratingSchema = new Schema(
  {
    session: { type: ObjectId, ref: "sessions" },
    rating: Number,
    fp: String
  },
  {
    timestamps: true
  }
);

const Rating = mongoose.model("rating", ratingSchema);
module.exports = Rating;
