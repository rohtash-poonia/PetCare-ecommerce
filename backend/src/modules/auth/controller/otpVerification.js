const { OtpModel } = require("../model/otpModel");

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const {  otp } = req.body;  // email deleted need only otp for varification

    if ( !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find OTP in database
    const otpRecord = await OtpModel.findOne({ email: email, otp: otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or email",
      });
    }

    // Delete the OTP after successful verification
    await OtpModel.deleteOne({ email: email, otp: otp });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      email: email,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

module.exports = { verifyOtp };