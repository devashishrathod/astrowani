const User = require("../models/userModel");
const Wallet = require("../models/walletModel");

exports.validatePlanAndWallet = async (req, res, next) => {
  const { userId } = req.body;
  const messageSize = req.body.message.length / 1024; // Convert to KB
  // console.log("req.body: ", req.body);

  try {
    // console.log("userId: ", userId);

    const user = await User.findById(userId).populate("activePlan.planId");
    // console.log("user: ", user);
    if (!user || !user.activePlan) {
      return res.status(400).json({ message: "No active plan found." });
    }

    const plan = user.activePlan.planId;
    if (!plan) {
      return res.status(400).json({ message: "Invalid plan." });
    }

    if (user.activePlan.remainingMessages <= 0 || user.activePlan.remainingSize < messageSize) {
      return res.status(403).json({ message: "Plan limits exceeded. Upgrade your plan." });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance <= 0) {
      return res.status(403).json({ message: "Insufficient wallet balance." });
    }

    // Attach plan and wallet info to request for further processing
    req.userPlan = user.activePlan;
    req.wallet = wallet;

    next();
  } catch (error) {
    res.status(500).json({ message: "Validation error", error });
  }
};
