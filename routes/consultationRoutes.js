const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, consultationController.createConsultation);
router.get('/get-all-consultations', protect, authorize('admin'), consultationController.getAllConsultations);
router.get('/get-astrologer-consultations', protect, authorize('astrologer'), consultationController.getAstrologerConsultations);
router.get('/:id', protect, consultationController.getConsultationById);
router.put('/:id', protect, authorize('admin', 'user'), consultationController.updateConsultation);
router.delete('/:id', protect, authorize('admin'), consultationController.deleteConsultation);

module.exports = router;
