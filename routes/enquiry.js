const express = require('express');
const { addEnquiry, getEnquiry, deleteEnquiry, updateEnquiry } = require('../controllers/enquiry');
const { addEnquiryValidation } = require('../middleware/enquiryValidation');
const enquiryRouter = express.Router();


enquiryRouter.get('/', getEnquiry)

enquiryRouter.get('/:id', getEnquiry)

enquiryRouter.post('/add', addEnquiryValidation, addEnquiry)

enquiryRouter.put('/update/:id', updateEnquiry)

enquiryRouter.delete('/delete/:id', deleteEnquiry)


module.exports = enquiryRouter