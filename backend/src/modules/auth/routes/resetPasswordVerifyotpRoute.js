const express = require("express");
const { verifyOtp } = require("../controller/otpVerification");

const router = express.Router();

// verify OTP from db

router.post("/password-reset", verifyOtp);
module.exports = router;
