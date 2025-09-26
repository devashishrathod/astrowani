const express = require("express");
const router = express.Router();
const { createSupportRequest, getSupportRequests, deleteSupportRequest, } = require("../controllers/SupportController");
const { protect } = require("../middleware/authMiddleware");

// POST: Create a new support request
router.post("/create-support", protect, createSupportRequest);

// GET: Get all support requests
router.get("/get-all-supports", getSupportRequests);

// DELETE: Delete a support request by ID
router.delete("/:id", deleteSupportRequest);

module.exports = router;
