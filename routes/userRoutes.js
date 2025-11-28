const express = require("express");
const router = express.Router();
const {
  requestOTP,
  registerAdmin,
  login,
  verifyEmailOTP,
  resendOTP,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
  getAllUser,
  requestAstroOTP,
  registerAstrologer,
  updateAstrologerProfile,
  getUserById,
  requestOtp,
  verifyOTPAPI,
  getUserDetails,
  mobileOTPRequest,
  verifyMobileOtp,
} = require("../controllers/userControllers");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/login-with-email", requestOTP); // user with new or old email
//router.post("/astro-sign-in", requestAstroOTP); // astrologer with existing email
router.post("/register", registerAdmin); // admin
router.post("/register-astrologer", registerAstrologer); // register astrologer
router.post("/login", login); // login with email and password /// verify check krna h
router.post("/verify-otp", verifyEmailOTP);
// router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword); // by email template reset link
router.post("/reset-password", resetPassword); // reset password by token Id
router.post("/mobile-otp-request", mobileOTPRequest);
router.post("/mobile-otp-verify", verifyMobileOtp);
router.get("/profile", protect, getProfile);
router.get("/get-all-users", protect, getAllUser);
router.put("/profile", protect, authorize("customer"), updateProfile);
router.put(
  "/update-astrologer-profile",
  protect,
  authorize("astrologer"),
  updateAstrologerProfile
);
router.put("/update-password", protect, updatePassword);
// router.post("/request-otp", requestOtp);
// router.post("/otp-verify", verifyOTPAPI);
router.get("/user/details/:id", /* protect, */ getUserDetails);
router.get("/:userId", getUserById);

module.exports = router;
