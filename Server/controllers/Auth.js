const OTP = require("../models/OTPSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Profile = require("../models/profileSchema");
const otpGenerator = require("otp-generator");
const sendMail = require("../config/sendMail");
const jwt = require("jsonwebtoken");

//signup Controller
exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    // Check if All Details are there or not
    // Check if password and confirm password match
    // Check if user already exists
    // Find the most recent OTP for the email
    // OTP not found for the email
    // Invalid OTP
    // Hash the password
    // Create the user
    // Create the Additional Profile For User

    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;
    // Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !otp
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Check OTP
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 }) // latest OTP
      .limit(1);

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found for this email",
      });
    }

    if (recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create additional profile (blank initially)
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      bio: null,
      contactNumber: null,
    });

    // 7. Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // 8. Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: await User.findById(newUser._id).populate("additionDetails"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      error: error.message,
    });
  }
};

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email })
      .populate("additionDetails")
      .populate({
        path: "cart",
        populate: {
          path: "items.dish",
          select: "name price image status",
          populate: { path: "category", select: "name" }, // optional
        },
      });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        //token(payload,secret-key,option)
        { email: user.email, id: user._id, accountType: user.accountType }, //payload
        process.env.JWT_SECRET, //secret key
        {
          expiresIn: "24h", //options
        }
      );

      // Save token to user document in database
      user.token = token;
      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Successfully`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    // const checkUserPresent = await User.findOne({ email });
    // if (checkUserPresent) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "User is Already Registered",
    //   });
    // }

    // Generate OTP
    let otp;
    let existingOtp;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existingOtp = await OTP.findOne({ otp });
    } while (existingOtp);

    // Send OTP via mail
    try {
      await sendMail(
        email,
        "OTP Verification",
        otp,
        `<h2> OTP is : ${otp} </h2>
        <h1>OTP Expires in 5 Minutes</h1>`
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send mail",
        error: error.message,
      });
    }

    // Save OTP in DB
    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp, // ⚠️ In production: OTP ko response me mat bhejna
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The old password is incorrect" });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      // If new password and confirm new password do not match, return a 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await sendMail(
        updatedUserDetails?.email,
        "Password Changed Successfully!",
        "null",
        `<h1>Password updated successfully for ${updatedUserDetails?.firstName} ${updatedUserDetails?.lastName}
        Password Changed Successfully</h1>`
      );
      console.log("Email sent successfully:", emailResponse?.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    // Logged-in user ka ID le le (middleware se milta hai)
    const userId = req.user.id;

    // User find kar le (restaurant populate karna optional hai)
    const userDetails = await User.findById(userId)
      .select("-password"); // password exclude kar

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Success response
    return res.status(200).json({
      success: true,
      user: userDetails,
      message: "User details fetched successfully",
    });
  } catch (error) {
    console.error("GET_USER_DETAILS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user details",
      error: error.message,
    });
  }
};
