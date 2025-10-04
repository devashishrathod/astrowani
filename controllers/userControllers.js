// userController.js
const User = require("../models/userModel");
const msg91 = require("msg91").default;
require("dotenv").config();

const { sendEmail } = require("../helpers/emailHelper");
const { generateOTP } = require("../helpers/otpHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Astrologer = require("../models/astrologerModel");
const Plan = require("../models/plansModel");
const { urlSendTestOtp, urlVerifyOtp } = require("../service/sendOtp");
const { sendOTP } = require("../utils/logger/utils");

exports.requestOTP = async (req, res) => {
  try {
    const { email, fcm } = req.body;

    // Find user by email
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new one
    if (!user) {
      // Fetch the "Free" plan from the database
      const freePlan = await Plan.findOne({ name: "Free" });

      if (!freePlan) {
        return res.status(400).json({
          success: false,
          message: "Free plan not found in the system.",
        });
      }

      // Calculate plan duration and dates
      const durationInDays = freePlan.duration || 28; // Default to 28 days
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000
      ); // Add duration in milliseconds

      // Create a new user with the Free plan
      user = new User({
        email,
        activePlan: {
          planId: freePlan._id,
          startDate: startDate,
          endDate: endDate,
          remainingMessages: freePlan.maxMessages || 0,
          remainingSize: freePlan.maxMessageSize || 0,
        },
      });
      await user.save();
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    };

    // Save or update FCM token
    if (fcm) {
      user.fcm = fcm;
    }
    await user.save();

    // Define the HTML email content
    const otpHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
        <h2 style="color: #333;">OTP Verification</h2>
        <p style="color: #555;">
          Your OTP is
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <p style="font-size: 18px; font-weight: bold; color: #007BFF;">${otp}</p>
        </div>
        <p style="color: #999; font-size: 12px;">
          Best regards,<br>
          Your Service Team
        </p>
      </div>
    `;
    await sendEmail(email, "Verify Your Account", otpHtml);
    console.log("otp: ", otp);

    res.status(201).json({
      success: true,
      message: "OTP has been sent to your email. Please check your inbox.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber } =
      req.body;
    let user = await User.findOne({ email: email, role: "admin" });
    if (user)
      return res
        .status(400)
        .json({ success: false, error: "User with this email already exist" });
    user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: "admin",
      phoneNumber,
    });

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    };
    await user.save();

    // Define the HTML email content
    const otpHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p style="color: #555;">
            You OTP is
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 18px; font-weight: bold; color: #007BFF;">${otp}</p>
          </div>
          <p style="color: #999; font-size: 12px;">
            Best regards,<br>
            Your Service Team
          </p>
        </div>
      `;
    await sendEmail(email, "Verify Your Account", otpHtml);
    res.status(201).json({
      success: true,
      message: "User registered. Please check your email for OTP.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Please verify your account first" });
    }

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = user.getSignedJwtToken({
      expiresIn: "30d",
      secret: process.env.JWT_SECRET,
    });
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, fcmToken } = req.body;
    // console.log("req.body: ", req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    // Generate a token for the user
    // const token = jwt.sign({ id: user._id }, process.env.RESET_SECRET, {
    //   expiresIn: "10m",
    // });
    const token = user.getSignedJwtToken({
      expiresIn: "30d",
      secret: process.env.JWT_SECRET,
    });
    user.isVerified = true;
    user.otp = undefined;
    user.fcm = fcmToken;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Account verified successfully", token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.mobileOTPRequest = async (req, res) => {
  console.log(
    " ================================= mobileOTPRequest ================================"
  );
  console.log("req.body: ", req.body);

  const mobile = req.body?.mobile;
  try {
    let checkUser = await User.findOne({ mobile: mobile });
    if (!checkUser) {
      const freePlan = await Plan.findOne({ name: "Free" });

      if (!freePlan) {
        return res.status(400).json({
          success: false,
          message: "Free plan not found in the system.",
        });
      }

      // Calculate plan duration and dates
      const durationInDays = freePlan.duration || 28; // Default to 28 days
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000
      ); // Add duration in milliseconds

      // Create a new user with the Free plan
      checkUser = new User({
        mobile,
        activePlan: {
          planId: freePlan._id,
          startDate: startDate,
          endDate: endDate,
          remainingMessages: freePlan.maxMessages || 0,
          remainingSize: freePlan.maxMessageSize || 0,
        },
      });
      await checkUser.save();
    }
    const otpService = await msg91.getOTP(process.env.MSG91_TEMPLETE, {
      length: 6,
    });
    await otpService.send(`+91${mobile}`);
    return res
      .status(200)
      .json({ msg: "OTP sent to your mobile number.", success: true });
  } catch (error) {
    console.log("error on mobileOTPRequest: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.verifyMobileOtp = async (req, res) => {
  console.log(" ====================== verifyMobileOtp ====================");
  console.log("req.body: ", req.body);

  const mobile = req.body?.mobile;
  const otp = req.body?.otp;
  const fcmToken = req.body?.fcmToken;

  try {
    const checkUser = await User.findOne({ mobile: mobile });
    if (!checkUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const otpService = await msg91.getOTP(process.env.MSG91_TEMPLETE, {
      length: 6,
    });
    const result = await otpService.verify(`+91${mobile}`, otp);

    // console.log("result: ", result);
    if (result.message != "OTP verified success") {
      return res.status(400).json({ msg: result.message, success: false });
    }
    if (fcmToken) {
      checkUser.fcm = fcmToken;
    }
    const token = checkUser.getSignedJwtToken({
      expiresIn: "30d",
      secret: process.env.JWT_SECRET,
    });
    checkUser.isVerified = true;
    await checkUser.save();
    return res.status(200).json({ msg: "Ok", success: true, token });
  } catch (error) {
    console.log("error on verifyMobileOtp: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    await user.save();
    await sendEmail(
      email,
      "New OTP for Account Verification",
      `Your new OTP is: ${otp}`
    );
    res
      .status(200)
      .json({ success: true, message: "New OTP sent to your email" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers and calculate the skip value
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch users with pagination
    const users = await User.find({ role: "customer" })
      .skip(skip)
      .limit(limitNumber);

    // Get the total count of users for pagination metadata
    const totalUsers = await User.countDocuments({ role: "customer" });

    // Respond with data and pagination info
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        totalUsers,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log(req.user.id);

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword);

    const user = await User.findById(req.user.id).select("+password");
    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect old password" });
    }
    console.log(newPassword);

    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // const resetToken = jwt.sign({ id: user._id }, process.env.RESET_SECRET, {
    //   expiresIn: "1h",
    // });

    const resetToken = user.getSignedJwtToken({
      expiresIn: "1h",
      secret: process.env.RESET_SECRET,
    });
    const resetLink = `http://localhost:5173/auth/reset-password?token=${resetToken}`; // Replace with your frontend URL

    // Define the HTML email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #555;">
          You requested to reset your password. Please use the following link to reset it:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="font-size: 18px; font-weight: bold; color: #007BFF;">Reset Password</a>
        </div>
        <p style="color: #555;">
          If you did not request this password reset, please ignore this email.
        </p>
        <p style="color: #999; font-size: 12px;">
          Best regards,<br>
          Your Service Team
        </p>
      </div>
    `;

    console.log("Sending email with HTML content..."); // Debugging line

    // Send the email with HTML content
    await sendEmail(email, "Password Reset Request", html);

    res
      .status(200)
      .json({ success: true, message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword function:", error); // Debugging line
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.RESET_SECRET);
    const user = await User.findById(decoded.id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.requestAstroOTP = async (req, res) => {
  try {
    const { email, fcm } = req.body;
    // console.log("req.body: ", req.body);

    // Find user by email without password, firstName, and lastName
    let user = await User.findOne({ email, role: "astrologer" });

    // If user doesn't exist, create a new one
    if (!user) {
      return res.status(401).json({ success: false, message: "No User Found" });
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    };
    // Save or update FCM token
    if (fcm) {
      user.fcm = fcm;
    }
    await user.save();

    // Define the HTML email content
    const otpHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
        <h2 style="color: #333;">OTP Verification</h2>
        <p style="color: #555;">
          Your OTP is
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <p style="font-size: 18px; font-weight: bold; color: #007BFF;">${otp}</p>
        </div>
        <p style="color: #999; font-size: 12px;">
          Best regards,<br>
          Your Service Team
        </p>
      </div>
    `;
    await sendEmail(email, "Verify Your Account", otpHtml);

    console.log("Verify Your Account: ", otp);

    res.status(201).json({
      success: true,
      otp: otp,
      message: "OTP has been sent to your email. Please check your inbox.",
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Register Astrologer and User
exports.registerAstrologer = async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    dateOfBirth,
    gender,
    experience,
    language,
    specialties,
    profileImage,
  } = req.body;

  try {
    let user = await User.findOne({ email: email, role: "astrologer" });
    if (user)
      return res
        .status(400)
        .json({ success: false, error: "User with this email already exist" });
    user = new User({
      email,
      role: "astrologer",
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      profilePic: profileImage,
    });
    user = await user.save();
    const astrologer = new Astrologer({
      name: `${firstName} ${lastName}`,
      email,
      phoneNumber,
      experience,
      language,
      specialties,
      profileImage,
      userId: user._id,
    });
    await astrologer.save();
    res.status(201).json({
      success: true,
      message: "Astrologer registered successfully",
      data: {
        user,
        astrologer,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Astrologer Profile
exports.updateAstrologerProfile = async (req, res, next) => {
  const userId = req.user.id;
  const {
    name,
    phoneNumber,
    bio,
    experience,
    experienceAndQualification,
    pricing,
    language,
    specialties,
    profileImage,
  } = req.body;

  try {
    // Find astrologer by userId
    let astrologer = await Astrologer.findOne({ userId });

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer profile not found",
      });
    }

    // Update astrologer profile fields
    astrologer.name = name || astrologer.name;
    astrologer.phoneNumber = phoneNumber || astrologer.phoneNumber;
    astrologer.bio = bio || astrologer.bio;
    astrologer.experience = experience || astrologer.experience;
    astrologer.experienceAndQualification =
      experienceAndQualification || astrologer.experienceAndQualification;
    astrologer.pricing = pricing || astrologer.pricing;
    astrologer.language = language || astrologer.language;
    astrologer.specialties = specialties || astrologer.specialties;
    astrologer.profileImage = profileImage || astrologer.profileImage;

    // Save updated profile
    await astrologer.save();

    res.status(200).json({
      success: true,
      message: "Astrologer profile updated successfully",
      data: astrologer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user details by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from the request parameters

    // Validate userId
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    // Find user by ID
    const user = await User.findById(userId)
      .select("-password -otp.code") // Exclude sensitive fields like password and OTP
      .populate("favoriteAstrologer", "name") // Populate favorite astrologer details (name only)
      .populate("activePlan.planId", "name description"); // Populate active plan details (optional fields)

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.requestOtp = async (req, res) => {
  const mobile = req.body?.mobile;

  try {
    let checkMobile = await User.findOne({ mobile: mobile });
    if (!checkMobile) {
      checkMobile = new User({ mobile }); // Create a new user object
      await checkMobile.save(); // Save the new user to the database
    }

    let result = await urlSendTestOtp(mobile);
    if (result.Status == "Success") {
      return res.status(200).json({
        success: true,
        msg: "Verification code sent successfully",
        result,
      });
    }
    return res
      .status(400)
      .json({ success: false, msg: "Failed to send verification code" });
  } catch (error) {
    console.error("Error requestOtp:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.verifyOTPAPI = async (req, res) => {
  // console.log("req.body: ", req.body);

  const sessionId = req.body.sessionId;
  const otp = req.body.otp;
  const mobile = req.body?.mobile;
  const fcmToken = req.body?.fcmToken;

  try {
    const checkUser = await User.findOne({ mobile: mobile });

    if (!checkUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    if (checkUser.isActive == false) {
      return res.status(401).json({
        success: false,
        msg: "Account is not active. Please contact with admin.",
      });
    }

    let result = await urlVerifyOtp(sessionId, otp);
    // console.log("result: ", result);
    if (fcmToken) {
      checkUser.fcm = fcmToken;
      await checkUser.save();
    }
    if (result?.Status == "Success") {
      // const token = await generateToken(checkUser)
      const token = checkUser.getSignedJwtToken({
        expiresIn: "30d",
        secret: process.env.JWT_SECRET,
      });
      return res.status(200).json({
        success: true,
        msg: "Verification successful",
        data: result,
        token,
      });
    }
    return res.status(400).json({ success: false, msg: "Verification failed" });
  } catch (error) {
    console.log("error on verifyOTP: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  const userId = req.params.id;

  console.log(" ====================== getUserDetails ====================");
  console.log("userId: ", userId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "User details", data: user });
  } catch (error) {
    console.log("error on getUserDetails: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};
