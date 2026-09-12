// Import the otp-generator library to generate numeric/alphanumeric OTPs
const otpGenerator = require("otp-generator");
// Import the custom sendMail utility for sending emails via Nodemailer
const { sendMail } = require("../../../utils/nodemailer");
// Import the Otp model to interact with the OTPs collection in the database
const { OtpModel } = require("../model/otpModel");

// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false, // Do not include uppercase letters
    specialChars: false, // Do not include special characters
    lowerCaseAlphabets: false, // Do not include lowercase letters
    digits: true, // Only include digits
  });
};


// Main controller function to send an OTP to the user's email
const sendOtp = async (req, res) => {
  try {
    // Extract email from the request body
    const { email } = req.body;
    
    // Check if the email field is provided
    if (!email) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Email is required", // Error message
      });
    }

    // Generate a new 6-digit OTP
    const otp = generateOTP();

    // Delete any previous OTPs associated with this email to ensure only the latest is valid
    await OtpModel.deleteOne({ email: email });

    // Create a new OTP document to save in the database
    const otpData = new OtpModel({
      email: email, // Associate OTP with the email
      otp: otp, // Store the generated OTP
    });

    // Save the OTP document to the database
    await otpData.save();

    // Send the OTP via email to the user using the custom sendMail function
    await sendMail(
      email, // Recipient email address
      "Your OTP for Email Verification", // Email subject
      `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`, // Email body content
    );

    // Return a 200 OK response indicating success
    res.status(200).json({
      success: true, // Indicate successful operation
      message: "OTP sent successfully to your email", // Success message
      email: email, // Return the email address
    });
  } catch (error) {
    // Log any unexpected errors to the console
    console.log("Error:", error);
    // Return a 500 Internal Server Error response to the client
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to send OTP", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Export the sendOtp function
module.exports = {sendOtp}