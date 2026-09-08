const express = require("express");
const { sendOtp } = require("../modules/auth/controller/emailOtp");
const router = express.Router();

// Send OTP to email
router.post("/send-otp", sendOtp);
module.exports = router;