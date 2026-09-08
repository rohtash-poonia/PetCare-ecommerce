const mongoose = require("mongoose");
const otpGenerator = require("otp-generator");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // OTP expires in 5 minutes (300 seconds)
    },
  },
  { timestamps: true },
);
const OtpModel = mongoose.model("EmailOtp", otpSchema);
module.exports = { OtpModel}