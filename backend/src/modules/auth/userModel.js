const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", schema);

module.exports = userModel;
module.exports.userModel = userModel;
