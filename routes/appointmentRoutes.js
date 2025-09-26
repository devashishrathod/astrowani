const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, appointmentController.createAppointment);
router.get('/get-all-appointments', protect, authorize('admin'), appointmentController.getAllAppointments);
router.get('/get-all-astrologer-appointments', protect, authorize('astrologer'), appointmentController.getAllAstrologerAppointments);
// Routes for upcoming and past appointments
router.get('/upcoming', protect, appointmentController.getUpcomingAppointments);
router.get('/past', protect, appointmentController.getPastAppointments);
//
router.get('/:id', protect, appointmentController.getAppointmentById);
router.put('/:id', protect, authorize('admin', 'user'), appointmentController.updateAppointment);
router.delete('/:id', protect, authorize('admin'), appointmentController.deleteAppointment);

module.exports = router;
