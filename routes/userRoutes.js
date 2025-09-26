// userRoutes.js
const express = require("express");
const router = express.Router();
const { requestOTP, register, login, verifyOTP, resendOTP, getProfile, updateProfile, forgotPassword, resetPassword, updatePassword, getAllUser, requestAstroOTP, registerAstrologer, updateAstrologerProfile, getUserById, requestOtp, verifyOTPAPI, getUserDetails, mobileOTPRequest, verifyMobileOtp, } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/sign-in", requestOTP);
router.post("/astro-sign-in", requestAstroOTP);
router.post("/register", register); // admin
router.post("/register-astrologer", registerAstrologer);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post('/mobile-otp-request', mobileOTPRequest)
router.post('/mobile-otp-verify', verifyMobileOtp)

router.get("/profile", protect, getProfile);
router.get("/get-all-users", protect, getAllUser);
router.put("/profile", protect, updateProfile);
router.put("/update-astrologer-profile", protect, updateAstrologerProfile);
router.put("/update-password", protect, updatePassword);

router.post('/request-otp', requestOtp)
router.post('/otp-verify', verifyOTPAPI)

router.get('/user/details/:id', /* protect, */ getUserDetails)

// Route to get user details by ID
router.get("/:userId", getUserById);

module.exports = router;