const otpGenerator = require("otp-generator");
const { sendMail } = require("../../../utils/nodemailer");
const { OtpModel } = require("../model/otpModel");

//fuction to generate otp
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
};


// main fuction send otp on email
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete previous OTP for this email if exists
    await OtpModel.deleteOne({ email: email });

    // Save new OTP to database
    const otpData = new OtpModel({
      email: email,
      otp: otp,
    });

    await otpData.save();

    // Send OTP via email
    await sendMail(
      email,
      "Your OTP for Email Verification",
      `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`,
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      email: email,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};
module.exports = {sendOtp}