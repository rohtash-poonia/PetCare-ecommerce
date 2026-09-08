const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoute"));
router.use("/forget-password", require("./otpRoute"));
router.use("/RESET-password", require("./resetPasswordVerifyotpRoute"));


module.exports = router;
