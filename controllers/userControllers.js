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
    let { email, role, fcm } = req.body;
    role = role?.toLowerCase() || "customer";
    let user = await User.findOne({ email, role });
    if (!user && role === "customer") {
      const freePlan = await Plan.findOne({ name: "Free" });
      if (!freePlan) {
        return res.status(400).json({
          success: false,
          message: "Free plan not found in the system.",
        });
      }
      const durationInDays = freePlan.duration || 28; // Default to 28 days
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000
      );
      user = new User({
        email,
        activePlan: {
          planId: freePlan._id,
          startDate: startDate,
          endDate: endDate,
          remainingMessages: freePlan.maxMessages || 100,
          remainingSize: freePlan.maxMessageSize || 1000,
        },
      });
      await user.save();
    } else if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found! Please register first.",
      });
    } else if (user && user.role === "astrologer" && !user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Astrologer not verified! Please contact admin.",
      });
    }
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    if (fcm) user.fcm = fcm;
    await user.save();
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

exports.registerAdmin = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    let user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
      role: "admin",
    });
    if (user)
      return res.status(400).json({
        success: false,
        error: "User with this email or phone number already exist",
      });
    user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: "admin",
      phoneNumber,
    });
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    await user.save();
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
    console.log("error on register: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, role, password } = req.body;
    role = role?.toLowerCase() || "customer";
    const user = await User.findOne({ email, role }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your account first! login with email OTP",
      });
    }
    const token = user.getSignedJwtToken({
      expiresIn: "30d",
      secret: process.env.JWT_SECRET,
    });
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  try {
    let { email, role, otp, fcmToken } = req.body;
    role = role?.toLowerCase() || "customer";
    const user = await User.findOne({ email, role });
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
    console.log("error on verifyEmailOTP: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.mobileOTPRequest = async (req, res) => {
  let { phoneNumber, role } = req.body;
  console.log(req.body, "body");
  role = role?.toLowerCase() || "customer";
  try {
    let checkUser = await User.findOne({ phoneNumber, role });
    if (!checkUser && role === "customer") {
      const freePlan = await Plan.findOne({ name: "Free" });
      if (!freePlan) {
        return res.status(400).json({
          success: false,
          message: "Free plan not found in the system.",
        });
      }
      const durationInDays = freePlan.duration || 28;
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000
      );
      checkUser = new User({
        phoneNumber,
        activePlan: {
          planId: freePlan._id,
          startDate: startDate,
          endDate: endDate,
          remainingMessages: freePlan.maxMessages || 100,
          remainingSize: freePlan.maxMessageSize || 1000,
        },
      });
      await checkUser.save();
    } else if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "Astrologer user not found! Please register first.",
      });
    } else if (
      checkUser &&
      checkUser.role === "astrologer" &&
      !checkUser.isVerified
    ) {
      return res.status(401).json({
        success: false,
        message: "Astrologer not verified! Please contact admin.",
      });
    }
    const otpService = msg91.getOTP(process.env.MSG91_TEMPLETE, { length: 6 });
    await otpService.send(`+91${phoneNumber}`);
    return res
      .status(200)
      .json({ msg: "OTP sent to your phoneNumber number.", success: true });
  } catch (error) {
    console.log("error on mobileOTPRequest: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.verifyMobileOtp = async (req, res) => {
  let { phoneNumber, role, otp, fcmToken } = req.body;
  role = role?.toLowerCase() || "customer";
  try {
    const checkUser = await User.findOne({ phoneNumber, role });
    if (!checkUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const otpService = msg91.getOTP(process.env.MSG91_TEMPLETE, { length: 6 });
    const result = await otpService.verify(`+91${phoneNumber}`, otp);
    if (result.message != "OTP verified success") {
      return res.status(400).json({ msg: result.message, success: false });
    }
    if (fcmToken) checkUser.fcm = fcmToken;
    const token = checkUser.getSignedJwtToken({
      expiresIn: "30d",
      secret: process.env.JWT_SECRET,
    });
    checkUser.isVerified = true;
    await checkUser.save();
    return res
      .status(200)
      .json({ msg: "Ok", success: true, token, user: checkUser });
  } catch (error) {
    console.log("error on verifyMobileOtp: ", error);
    return res
      .status(500)
      .json({ error: error, success: false, msg: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const users = await User.find({ role: "customer" })
      .skip(skip)
      .limit(limitNumber);
    const totalUsers = await User.countDocuments({ role: "customer" });
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
    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      profilePic,
    } = req.body;
    let user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const checkEmailUser = await User.findOne({
      email,
      _id: { $ne: req.user.id },
      role: "customer",
    });
    if (checkEmailUser) {
      return res.status(400).json({
        success: false,
        message: "Another user with this email already exists",
      });
    }
    const checkPhoneUser = await User.findOne({
      phoneNumber,
      _id: { $ne: req.user.id },
      role: "customer",
    });
    if (checkPhoneUser) {
      return res.status(400).json({
        success: false,
        message: "Another user with this phone number already exists",
      });
    }
    user = await User.findByIdAndUpdate(req.user.id, req.body, {
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
    const user = await User.findById(req.user.id).select("+password");
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
    let { email, role } = req.body;
    role = role?.toLowerCase() || "customer";
    const user = await User.findOne({ email, role });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = user.getSignedJwtToken({
      expiresIn: "1h",
      secret: process.env.RESET_SECRET,
    });
    const resetLink = `http://localhost:5173/auth/reset-password?token=${resetToken}`;
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
    console.log("Sending email with HTML content...");
    await sendEmail(email, "Password Reset Request", html);
    res
      .status(200)
      .json({ success: true, message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword function:", error);
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

// exports.requestAstroOTP = async (req, res) => {
//   try {
//     let { email, role, fcm } = req.body;
//     role = role?.toLowerCase() || "astrologer";
//     let user = await User.findOne({ email, role });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Astrologer not found! Please register first.",
//       });
//     }
//     const otp = generateOTP();
//     user.otp = { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 };
//     if (fcm) user.fcm = fcm;
//     await user.save();
//     const otpHtml = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
//         <h2 style="color: #333;">OTP Verification</h2>
//         <p style="color: #555;">
//           Your OTP is
//         </p>
//         <div style="text-align: center; margin: 20px 0;">
//           <p style="font-size: 18px; font-weight: bold; color: #007BFF;">${otp}</p>
//         </div>
//         <p style="color: #999; font-size: 12px;">
//           Best regards,<br>
//           Your Service Team
//         </p>
//       </div>
//     `;
//     await sendEmail(email, "Verify Your Account", otpHtml);
//     console.log("Verify Your Account: ", otp);
//     res.status(200).json({
//       success: true,
//       otp: otp,
//       message: "OTP has been sent to your email. Please check your inbox.",
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };

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
    let user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
      role: "astrologer",
    });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "User with this email or phone number already exist",
      });
    }
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
      message:
        "Astrologer registered successfully! Please wait for admin approval.",
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
    let astrologer = await Astrologer.findOne({ userId });
    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer profile not found",
      });
    }
    let user = await User.findById(astrologer.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
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
    await astrologer.save();
    user.firstName = name.split(" ")[0] || user.firstName;
    user.lastName = name.split(" ")[1] || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profilePic = profileImage || user.profilePic;
    await user.save();
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

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }
    const user = await User.findById(userId)
      .select("-password -otp.code")
      .populate("favoriteAstrologer", "name")
      .populate("activePlan.planId", "name description");
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

exports.getUserDetails = async (req, res) => {
  const userId = req.params.id;
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

// exports.requestOtp = async (req, res) => {
//   const phoneNumber = req.body?.phoneNumber;
//   try {
//     let checkMobile = await User.findOne({ phoneNumber: phoneNumber });
//     if (!checkMobile) {
//       checkMobile = new User({ phoneNumber });
//       await checkMobile.save();
//     }
//     let result = await urlSendTestOtp(phoneNumber);
//     if (result.Status == "Success") {
//       return res.status(200).json({
//         success: true,
//         msg: "Verification code sent successfully",
//         result,
//       });
//     }
//     return res
//       .status(400)
//       .json({ success: false, msg: "Failed to send verification code" });
//   } catch (error) {
//     console.error("Error requestOtp:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// };

// exports.verifyOTPAPI = async (req, res) => {
//   const sessionId = req.body.sessionId;
//   const otp = req.body.otp;
//   const phoneNumber = req.body?.phoneNumber;
//   const fcmToken = req.body?.fcmToken;
//   try {
//     const checkUser = await User.findOne({ phoneNumber: phoneNumber });
//     if (!checkUser) {
//       return res.status(404).json({ success: false, msg: "User not found" });
//     }
//     if (checkUser.isActive == false) {
//       return res.status(401).json({
//         success: false,
//         msg: "Account is not active. Please contact with admin.",
//       });
//     }
//     let result = await urlVerifyOtp(sessionId, otp);
//     if (fcmToken) {
//       checkUser.fcm = fcmToken;
//       await checkUser.save();
//     }
//     if (result?.Status == "Success") {
//       const token = checkUser.getSignedJwtToken({
//         expiresIn: "30d",
//         secret: process.env.JWT_SECRET,
//       });
//       return res.status(200).json({
//         success: true,
//         msg: "Verification successful",
//         data: result,
//         token,
//       });
//     }
//     return res.status(400).json({ success: false, msg: "Verification failed" });
//   } catch (error) {
//     console.log("error on verifyOTP: ", error);
//     return res
//       .status(500)
//       .json({ error: error, success: false, msg: error.message });
//   }
// };

// exports.resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//     const otp = generateOTP();
//     user.otp = {
//       code: otp,
//       expiresAt: Date.now() + 10 * 60 * 1000,
//     };
//     await user.save();
//     await sendEmail(
//       email,
//       "New OTP for Account Verification",
//       `Your new OTP is: ${otp}`
//     );
//     res
//       .status(200)
//       .json({ success: true, message: "New OTP sent to your email" });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// };
