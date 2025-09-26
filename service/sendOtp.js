const axios = require('axios');
require("dotenv").config()
const APIKEY = process.env.api_key_2Factor

exports.urlSendTestOtp = async (mobile) => {
    try {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://2factor.in/API/V1/${APIKEY}/SMS/+91${mobile}/AUTOGEN/OTP1`,
            headers: {}
        };

        const response = await axios(config);
        console.log("response: ", response.data);
        return response.data; // Return actual response data
    } catch (error) {
        console.log("error: ", error);
        throw error; // Ensure the error is propagated
    }
};


exports.urlVerifyOtp = async (sessionId, otp) => {
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://2factor.in/API/V1/${APIKEY}/SMS/VERIFY/${sessionId}/${otp}`,
            headers: {}
        };

        const response = await axios(config);
        console.log("Response: ", response.data);
        return response.data; // Return the actual data
    } catch (error) {
        console.log("Error: ", error.message);
        throw error; // Ensure the error is propagated
    }
};