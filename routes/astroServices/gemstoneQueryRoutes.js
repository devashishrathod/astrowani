const express = require("express");
const router = express.Router();
const gemstoneQueryController = require("../../controllers/astroServices/gemstoneQueryController");
const { protect } = require("../../middleware/authMiddleware");



// Create a new query
router.post("/gemstone-query", protect, gemstoneQueryController.createGemstoneQuery);

// Get all queries
router.get("/get-all-queries", gemstoneQueryController.getAllQueries);

// Get queries by user
router.get("/query/:userId", gemstoneQueryController.getQueriesByUser);

// Update query status or respond
router.patch("/query/:id", gemstoneQueryController.updateQuery);

// Delete a query
router.delete("/query/:id", gemstoneQueryController.deleteQuery);

module.exports = router;
