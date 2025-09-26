const express = require('express');
const router = express.Router();
const horoscopeController = require('../controllers/horoscopeController');


// Routes for horoscope
router.post('/', horoscopeController.createHoroscope); // Create
router.get('/', horoscopeController.getAllHoroscopes); // Get all
router.get('/:zodiacSign/:type', horoscopeController.getHoroscopeBySignAndType); // Get by zodiac sign and type
router.put('/:id', horoscopeController.updateHoroscope); // Update
router.delete('/:id', horoscopeController.deleteHoroscope); // Delete

module.exports = router;
