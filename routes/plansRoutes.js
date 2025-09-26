// planRoutes.js
const express = require("express");
const router = express.Router();
const { createPlan, buyPlan, getAllPlans, getPlanById, updatePlan, deletePlan } = require("../controllers/plansController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Get all plans
router.get("/get-all-plans", getAllPlans);

// Route to buy a plan
router.post("/buy", protect, buyPlan);

router.use(protect, authorize('admin'));

// Create a new plan
router.post("/create-plans", createPlan);

// Get a single plan by ID
router.get("/:planId", getPlanById);

// Update a plan by ID
router.put("/:planId", updatePlan);

// Delete a plan by ID
router.delete("/:planId", deletePlan);

module.exports = router;
