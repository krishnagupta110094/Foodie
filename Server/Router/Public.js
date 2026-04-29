const express = require("express");

const { contactUsController } = require("../controllers/ContactUsMail");
const router = express.Router();
require("dotenv").config();

router.post("/contact-us", contactUsController);

module.exports = router;
