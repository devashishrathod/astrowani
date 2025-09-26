const express = require("express");
const router = express.Router();
const thoughtController = require("../controllers/thoughtController");
const { protect, authorize } = require("../middleware/authMiddleware");


router.get("/", thoughtController.getAllThoughts);

router.get('/latest', thoughtController.getLatestThought);

router.use(protect, authorize('admin'));
// Route to get the latest thought

// Create a new thought
router.post("/", thoughtController.createThought);

// Get all thoughts

// Route to update a thought to be the latest
router.put('/update-latest', thoughtController.updateToLatestThought);

// Get a single thought by ID
router.get("/:id", thoughtController.getThoughtById);

// Update a thought
router.put("/:id", thoughtController.updateThought);

// Delete a thought
router.delete("/:id", thoughtController.deleteThought);


module.exports = router;
