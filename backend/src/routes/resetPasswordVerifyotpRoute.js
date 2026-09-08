const express = require("express");
const { verifyOtp } = require("../modules/auth/controller/otpVerification");

const router = express.Router();

// verify OTP from db

router.post("/password-reset", verifyOtp);
module.exports = router;
