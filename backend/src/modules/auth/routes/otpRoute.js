const express = require("express");
const { sendOtp } = require("../modules/auth/controller/emailOtp");
const router = express.Router();

// Send OTP to email
router.post("/send-otp", sendOtp);
router.post("/password-reset", sendOtp);
module.exports = router;