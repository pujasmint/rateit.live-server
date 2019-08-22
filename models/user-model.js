const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    contact: String,
    fullname: String,
    profession: String,
    rating: Number,
    totalSessions: Number,
    image: { data: Buffer, contentType: String }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
