const express = require("express");
const router = express.Router();
const sendMail = require("../config/sendMail");
const { uploadToCloudinary } = require("../utils/UploadToCloudinary");
const { fixExistingUsersRestaurant } = require("../controllers/Restaurant");
require("dotenv").config();

// POST /api/send-mail
router.post("/send-mail", async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const info = await sendMail(to, subject, text, html);
    res.json({ success: true, message: "Mail sent successfully!", info });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send mail" });
  }
});

// POST /api/v1/upload
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || (!req.files.image && !req.files.video)) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.image || req.files.video;
    const result = await uploadToCloudinary(
      file,
      process.env.FOLDER_NAME,
      null,
      "auto"
    );

    res.status(200).json({
      message: "File uploaded successfully ✅",
      url: result.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed ❌", error: error.message });
  }
});

// router.post("/send-mail",middleware1 ,middleware2 , controller1);
  
router.post("/abc",fixExistingUsersRestaurant);

module.exports = router;
