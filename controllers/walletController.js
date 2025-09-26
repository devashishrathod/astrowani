const Wallet = require("../models/walletModel");
const WalletTransaction = require("../models/walletTransactionModel");

// Get wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    res.status(200).json({ success: true, balance: wallet.balance, currency: wallet.currency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a wallet for a user
exports.createWallet = async (req, res) => {
  try {
    const wallet = new Wallet({ userId: req.user._id });
    await wallet.save();

    res.status(201).json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add funds to the wallet
exports.addFunds = async (req, res) => {
  const { amount, description } = req.body;

  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    // Update balance
    wallet.balance += amount;
    await wallet.save();

    // Log the transaction
    const transaction = new WalletTransaction({
      walletId: wallet._id,
      type: "credit",
      amount,
      description,
      status: "completed",
    });
    await transaction.save();

    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Deduct funds from the wallet
exports.deductFunds = async (req, res) => {
  const { amount, description } = req.body;

  try {
    let wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient funds" });
    }

    // Update balance
    wallet.balance -= amount;
    await wallet.save();

    // Log the transaction
    const transaction = new WalletTransaction({
      walletId: wallet._id,
      type: "debit",
      amount,
      description,
      status: "completed",
    });
    await transaction.save();

    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get wallet transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    const transactions = await WalletTransaction.find({ walletId: wallet._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
