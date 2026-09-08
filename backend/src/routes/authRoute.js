const express = require("express");
const { authController } = require("../modules/auth/controller/authController");

// create router
const router = express.Router();

// Public auth routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

module.exports = router;
