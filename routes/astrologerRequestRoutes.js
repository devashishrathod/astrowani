const express = require('express');
const router = express.Router();
const astrologerRequestController = require('../controllers/astrologerRequestController');

// Create a new astrologer request
router.post('/', astrologerRequestController.createRequest);

// Get all astrologer requests
router.get('/', astrologerRequestController.getAllRequests);

// Get a specific astrologer request by ID
router.get('/:id', astrologerRequestController.getRequestById);

// Update an astrologer request by ID
router.put('/:id', astrologerRequestController.updateRequest);

// Delete an astrologer request by ID
router.delete('/:id', astrologerRequestController.deleteRequest);

module.exports = router;