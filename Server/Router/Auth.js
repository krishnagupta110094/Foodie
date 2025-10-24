const express = require("express");
const { sendotp, signup, login, changePassword, getUserDetails, editProfile } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");
const router = express.Router();
require("dotenv").config();

router.post("/auth/send-otp",sendotp);
router.post("/auth/signup",signup);
router.post("/auth/login",login);
router.post("/auth/change-password",auth,changePassword);
router.post("/auth/reset-password-token",resetPasswordToken);
router.post("/auth/reset-password",resetPassword);
router.get("/auth/get-user-details",auth,getUserDetails);
router.post("/auth/edit-profile",auth,editProfile);

module.exports = router;