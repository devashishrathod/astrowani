const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getWalletBalance, createWallet, addFunds, deductFunds, getTransactionHistory, } = require("../controllers/walletController");

// Middleware to protect routes
router.use(protect);

// Wallet Routes
router.get("/balance", getWalletBalance); // Get wallet balance
router.post("/create", createWallet); // Create wallet
router.post("/add-funds", addFunds); // Add funds to wallet
router.post("/deduct-funds", deductFunds); // Deduct funds from wallet
router.get("/transactions", getTransactionHistory); // Get transaction history

module.exports = router;
