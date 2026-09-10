const express = require("express");

const router = express.Router();

router.use("/auth", require("../modules/auth/routes/authRoute"));
router.use("/forget-password", require("./otpRoute"));
router.use(
  "/RESET-password",
  require("../modules/auth/routes/resetPasswordVerifyotpRoute"),
);
router.use("/products", require("./productRoute"));
router.use("/category", require("../modules/category/categoryRoute"));
router.use("/cart", require("./cartRoute"));
router.use("/order", require("./orderRoute"));
router.use("/wishlist", require("../modules/wishlist/wishlistRoute"));

module.exports = router;
