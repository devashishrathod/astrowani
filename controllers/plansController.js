// planController.js
const Plan = require("../models/plansModel");
const userModel = require("../models/userModel");

exports.createPlan = async (req, res) => {
  try {
    const { name, price, questions, includesRemedies } = req.body;

    const newPlan = new Plan({ name, price, questions, includesRemedies });
    await newPlan.save();

    res.status(201).json({
      success: true,
      data: newPlan,
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create plan.",
    });
  }
};

exports.buyPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id; // Assumes `protect` middleware attaches `req.user`

    // Validate the provided plan ID
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found." });
    }

    console.log("plan: ", plan);


    // Fetch the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Calculate the new plan's start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000); // Add duration in days

    // Update the user's active plan
    user.activePlan = {
      planId: plan._id,
      startDate: startDate,
      endDate: endDate,
      remainingMessages: plan.maxMessages || 0,
      remainingSize: plan.maxMessageSize || 0,
    };

    await user.save();

    res.status(200).json({ success: true, message: `You have successfully purchased the plan: ${plan.name}.`, activePlan: user.activePlan, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// planController.js
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 }); // Sorting by price ascending
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans.",
    });
  }
};


// planController.js
exports.getPlanById = async (req, res) => {
  const { planId } = req.params;

  try {
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plan.",
    });
  }
};
// planController.js
exports.updatePlan = async (req, res) => {
  const { planId } = req.params;
  const { name, price, questions, includesRemedies } = req.body;

  try {
    const updatedPlan = await Plan.findByIdAndUpdate(
      planId,
      { name, price, questions, includesRemedies },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update plan.",
    });
  }
};
// planController.js
exports.deletePlan = async (req, res) => {
  const { planId } = req.params;

  try {
    const deletedPlan = await Plan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete plan.",
    });
  }
};
