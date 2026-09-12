// Note: jwt, UserModel, and bcrypt seem to be missing imports in the original file, 
// they must be imported at the top for this controller to work correctly.
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel"); // Make sure this path is correct

// Controller method to reset the user's password using a reset token
const resetPassword = async (req, res) => {
  try {
    // Extract the reset token, new password, and password confirmation from the request body
    const { resetToken, password, confirmPassword } = req.body;

    // Check if all required fields are provided
    if (!resetToken || !password || !confirmPassword) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Reset token, password and confirm password are required", // Error message
      });
    }

    // Check if the new password and the confirm password match
    if (password !== confirmPassword) {
      // Return a 400 Bad Request if they don't match
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Password and confirm password do not match", // Error message
      });
    }

    // Variable to hold the decoded JWT payload
    let decoded;

    try {
      // Verify the reset token using the secret key
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      // Return a 401 Unauthorized if the token is invalid or expired
      return res.status(401).json({
        success: false, // Indicate failure
        message: "Reset token is invalid or expired", // Error message
      });
    }

    // Verify that the token was specifically issued for password reset purposes
    if (decoded.purpose !== "password-reset") {
      // Return a 401 Unauthorized if the token purpose is incorrect
      return res.status(401).json({
        success: false, // Indicate failure
        message: "Invalid reset token", // Error message
      });
    }

    // Find the user in the database using the email extracted from the decoded token
    const user = await UserModel.findOne({
      email: decoded.email,
    });

    // If no user is found with that email
    if (!user) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "User not found", // Error message
      });
    }

    // Hash the new password using bcrypt with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the document
    user.password = hashedPassword;

    // Save the updated user document back to the database
    await user.save();

    // Return a 200 OK response indicating successful password reset
    return res.status(200).json({
      success: true, // Indicate successful operation
      message: "Password reset successfully", // Success message
    });
  } catch (error) {
    // Log any unexpected errors to the server console
    console.error("Reset Password Error:", error);

    // Return a 500 Internal Server Error response to the client
    return res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to reset password", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Export the resetPassword function
module.exports = resetPassword;
