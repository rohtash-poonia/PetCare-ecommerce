// Import the Otp model to interact with the OTPs collection in the database
const { OtpModel } = require("../model/otpModel");

// Controller method to verify an OTP
const verifyOtp = async (req, res) => {
  try {
    // Extract email and otp from the request body (fixed missing email destructuring)
    const { email, otp } = req.body;

    // Check if both email and OTP are provided
    if (!email || !otp) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Email and OTP are required", // Error message
      });
    }

    // Find the OTP document in the database that matches both email and OTP
    const otpRecord = await OtpModel.findOne({ email: email, otp: otp });

    // If no matching OTP record is found
    if (!otpRecord) {
      // Return a 400 Bad Request indicating invalid credentials
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Invalid OTP or email", // Error message
      });
    }

    // Delete the OTP from the database after successful verification so it can't be reused
    await OtpModel.deleteOne({ email: email, otp: otp });

    // Return a 200 OK response indicating successful verification
    res.status(200).json({
      success: true, // Indicate successful operation
      message: "OTP verified successfully", // Success message
      email: email, // Return the verified email address
    });
  } catch (error) {
    // Log any unexpected errors to the console
    console.log("Error:", error);
    // Return a 500 Internal Server Error response to the client
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to verify OTP", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Export the verifyOtp function
module.exports = { verifyOtp };