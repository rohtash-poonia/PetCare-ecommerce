const jwt = require("jsonwebtoken");
const userModel = require("../modules/auth/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.chatAppAccessToken || req.cookies?.token;

    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_jwt_secret_key",
    );

    const userId = decodedData.id || decodedData._id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or token invalid.",
      });
    }

    req.user = user;
    req.userData = { id: user._id, username: user.username, email: user.email };

    if (!req.userData) {
      return res.status(401).json({
        success: false,
        message: "User data not found",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
