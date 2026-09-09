const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoute"));
router.use("/forget-password", require("./otpRoute"));
router.use("/RESET-password", require("./resetPasswordVerifyotpRoute"));
router.use("/products", require("./productRoute"));
router.use("/category", require("./categoryRoute"));
router.use("/cart", require("./cartRoute"));
router.use("/order", require("./orderRoute"));


module.exports = router;
