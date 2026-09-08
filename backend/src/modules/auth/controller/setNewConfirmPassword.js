const resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    // Check fields
    if (!resetToken || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token, password and confirm password are required",
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // Verify reset token
    let decoded;

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Reset token is invalid or expired",
      });
    }

    // Check token purpose
    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // Find user using email from token
    const user = await UserModel.findOne({
      email: decoded.email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
module.exports = resetPassword
