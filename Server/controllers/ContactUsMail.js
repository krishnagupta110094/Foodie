// controllers/contactController.js
const sendMail = require("../config/sendMail");

exports.contactUsController = async (req, res) => {
  const { name, email, message } = req.body;

  // Validation: Check if fields are empty
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields (Name, Email, Message)",
    });
  }

  try {
    // Professional HTML Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background-color: #15803d; color: white; padding: 30px; text-align: center; }
          .header h2 { margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 30px; background-color: #ffffff; }
          .field-box { margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 10px; border-left: 5px solid #fbbf24; }
          .label { font-weight: bold; color: #15803d; text-transform: uppercase; font-size: 12px; display: block; margin-bottom: 5px; }
          .value { font-size: 16px; color: #1e293b; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Inquiry</h2>
          </div>
          <div class="content">
            <div class="field-box">
              <span class="label">Full Name</span>
              <span class="value">${name}</span>
            </div>
            <div class="field-box">
              <span class="label">Email Address</span>
              <span class="value">${email}</span>
            </div>
            <div class="field-box">
              <span class="label">Message</span>
              <p class="value" style="white-space: pre-line;">${message}</p>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from your website's contact form.</p>
            <p>&copy; ${new Date().getFullYear()} Foodie. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendMail(
      process.env.MAIL_USER, // Admin Email
      `🚀 New Inquiry: ${name}`,
      `You have a new message from ${name} (${email})`, // Fallback text
      htmlContent,
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully! We will get back to you soon.",
    });
  } catch (error) {
    console.error("EMAIL_CONTROLLER_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
  }
};
