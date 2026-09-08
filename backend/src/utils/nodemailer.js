const nodemailer = require("nodemailer");

const sendMail = async (to,subject,text) =>{
    try {
        let host = process.env.SMTP_HOST;
        if (!host || host.includes("@")) {
          host = "smtp.gmail.com";
        }

        const transporter = nodemailer.createTransport({
          host,
          port: Number(process.env.SMTP_PORT || 587),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
         const mailOption = {
           from: process.env.SMTP_FROM || process.env.SMTP_USER, // your email
           to,
           subject,
           text,
           html: `<h2>${subject}</h2><p>${text}</p>`,
         };
          const info = await transporter.sendMail(mailOption);
          console.log("Message sent successfully");
          console.log("Message ID:", info.messageId);
    return info;
    } catch (error) {
           console.error("Email sending failed:", error.message);
           throw error;
    }
}
module.exports = { sendMail };