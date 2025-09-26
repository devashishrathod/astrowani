
const router = require('express').Router();
const vendorController = require('../controllers/vendorController');
const { protect, authorize} = require('../middleware/authMiddleware');

router.use(protect, authorize('astrologer'));

router.get('/customers', vendorController.getMyCustomers);
router.get('/customers/:customerId/chat-history', vendorController.getCustomerChatHistory);
router.get('/customers/:customerId/stats', vendorController.getCustomerStats);
router.patch('/customers/:customerId/status', vendorController.updateCustomerStatus);

module.exports = router;