const express = require('express');
const router = express.Router();
const navgrahController = require('../controllers/navgrahController');


// Routes for Navgrah
router.post('/', navgrahController.createNavgrah); 
router.get('/', navgrahController.getAllNavgrah); 
router.get('/:id', navgrahController.getNavgrahById); 
router.put('/:id', navgrahController.updateNavgrah); 
router.delete('/:id', navgrahController.deleteNavgrah); 

module.exports = router;
