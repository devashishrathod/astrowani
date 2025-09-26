// user will come here and enlquiry for contacting the astrologers
const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    dob: {
        // this is for the date of birth
        type: String,
        required: true,
    },
    dot: {
        // thie is for the time of birth
        type: String,
    },
    birthPlace: {
        type: String,
        required: true,
    },
    maritalStatus: {
        type: String,
        required: true,
        enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated']
    },
    reason: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true,
        // min: 1000000000,
        // max: 9999999999
    },
    type: {
        type: String,
        enum: ['call', 'chat']
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'ongoing', 'completed', 'cancelled']
    },
    partnerDetails: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        dateOfBirth: {
            type: String,
        },
        timeOfBirth: {
            type: String,
        },
        placeOfBirth: {
            type: String,
        },
        gender: {
            type: String,
        },

    },
    // Add any other fields you want to include here like location, date, time etc.
}, { timestamps: true });


const Enquiry = mongoose.model('Enquiry', EnquirySchema);
module.exports = Enquiry;