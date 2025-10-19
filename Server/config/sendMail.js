const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host:process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,  // your gmail
        pass: process.env.MAIL_PASS,  // app password (not gmail password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,   // plain text
      html,   // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};

module.exports = sendMail;
