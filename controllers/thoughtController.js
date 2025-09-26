const Thought = require("../models/Thought");


// Get the latest created thought
exports.getLatestThought = async (req, res) => {
    try {
        const latestThought = await Thought.findOne().sort({ createdAt: -1 }); // Sort by creation date in descending order
        if (!latestThought) {
            return res.status(404).json({ message: "No thoughts found." });
        }
        res.status(200).json(latestThought);
    } catch (error) {
        console.error("Error fetching the latest thought: ", error);
        res.status(500).json({ message: "Failed to fetch the latest thought." });
    }
};

// Create a new thought
exports.createThought = async (req, res) => {
    try {
        const { thoughtText, author } = req.body;
        const thought = new Thought({ thoughtText, author });
        await thought.save();

        res.status(201).json({ success: true, message: "Thought created successfully.", data: thought, });
    } catch (error) {
        console.error("Error creating thought:", error);
        res.status(500).json({ success: false, message: "Failed to create thought.", });
    }
};

// Get all thoughts with optional pagination
exports.getAllThoughts = async (req, res) => {
    try {
        // Extract pagination parameters from query (with default values)
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

        // Calculate the starting index
        const skip = (page - 1) * limit;

        // Fetch paginated thoughts sorted by date
        const thoughts = await Thought.find().sort({ date: -1 }).skip(skip).limit(limit);

        // Count total thoughts for meta information
        const totalThoughts = await Thought.countDocuments();

        res.status(200).json({ success: true, data: thoughts, meta: { currentPage: page, totalPages: Math.ceil(totalThoughts / limit), totalThoughts, limit, }, });
    } catch (error) {
        console.error("Error fetching thoughts:", error);
        res.status(500).json({ success: false, message: "Failed to fetch thoughts.", });
    }
};


// Get a single thought by ID
exports.getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);

        if (!thought) {
            return res.status(404).json({ success: false, message: "Thought not found.", });
        }

        res.status(200).json({ success: true, data: thought, });
    } catch (error) {
        console.error("Error fetching thought:", error);
        res.status(500).json({ success: false, message: "Failed to fetch thought.", });
    }
};

// Update a thought
exports.updateThought = async (req, res) => {
    try {
        const { thoughtText, author } = req.body;

        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.id,
            { thoughtText, author },
            { new: true, runValidators: true }
        );

        if (!updatedThought) {
            return res.status(404).json({
                success: false,
                message: "Thought not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Thought updated successfully.",
            data: updatedThought,
        });
    } catch (error) {
        console.error("Error updating thought:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update thought.",
        });
    }
};

// Delete a thought
exports.deleteThought = async (req, res) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.id);

        if (!deletedThought) {
            return res.status(404).json({
                success: false,
                message: "Thought not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Thought deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting thought:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete thought.",
        });
    }
};


exports.updateToLatestThought = async (req, res) => {
    const { thoughtId } = req.body;
    try {
        // First, disable timestamps for this operation
        await Thought.findByIdAndUpdate(
            thoughtId,
            { $set: { createdAt: new Date() } },
            {
                new: true,
                timestamps: false,
                strict: false
            }
        );

        // Then fetch the updated document to confirm the change
        const updatedThought = await Thought.findById(thoughtId);

        if (!updatedThought) {
            return res.status(404).json({ message: "Thought not found." });
        }

        res.status(200).json({
            message: "Thought updated to the latest successfully.",
            thought: updatedThought,
        });
    } catch (error) {
        console.error("Error updating the thought to latest: ", error);
        res.status(500).json({ message: "Failed to update the thought." });
    }
};