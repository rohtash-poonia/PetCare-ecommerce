const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");

const authController = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Registration Error: Username, Email, and Password are required",
        });
      }

      // Check if user already exists
      const existingUser = await userModel.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or username already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      const userResponse = newUser.toObject();
      delete userResponse.password;

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        userData: userResponse,
      });
    } catch (error) {
      console.error(`Internal Error: Error in User Registration:`, error);
      return res.status(500).json({
        success: false,
        message: `Internal Error in User Registration: ${error.message}`,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await userModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Login Error: User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Login Error: Incorrect password",
        });
      }

      const secret = process.env.JWT_SECRET || "default_jwt_secret_key";
      const accesstoken = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        secret,
        { expiresIn: "7d" },
      );

      const userObj = user.toObject();
      delete userObj.password;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: userObj,
        accesstoken: accesstoken,
      });
    } catch (error) {
      console.error(`Internal Error: Error in User Login:`, error);
      return res.status(500).json({
        success: false,
        message: `Internal Error in User Login: ${error.message}`,
      });
    }
  },
};

module.exports = { authController };
