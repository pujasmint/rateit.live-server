const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectID;

const sessionSchema = new Schema(
  {
    name: String,
    invitekey: String,
    rating: Number,
    totalAudience: Number,
    status: String,
    creator: { type: ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("session", sessionSchema);
module.exports = User;
