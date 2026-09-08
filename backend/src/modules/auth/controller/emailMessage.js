const { sendMail } = require("../../../utils/nodemailer");


// Send Email
const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: "Email, subject, and text are required",
      });
    }

    await sendMail(to, subject, text);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = { sendEmail };
