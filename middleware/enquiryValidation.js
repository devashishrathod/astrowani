

exports.addEnquiryValidation = async (req, res, next) => {
    const fname = req.body?.fname
    const gender = req.body?.gender
    const dob = req.body?.dob
    const birthPlace = req.body?.birthPlace
    const maritalStatus = req.body?.maritalStatus
    const reason = req.body?.reason
    const mobile = req.body?.mobile
    const type = req.body?.type

    try {
        if (!fname) {
            return res.status(400).json({ message: "First Name is required", success: false });
        }
        if (!gender) {
            return res.status(400).json({ message: "Gender is required", success: false });
        }
        if (!birthPlace) {
            return res.status(400).json({ message: "Birth Place is required", success: false });
        }
        if (!dob) {
            return res.status(400).json({ message: "Date of Birth is required", success: false });
        }
        if (!maritalStatus) {
            return res.status(400).json({ message: "Marital Status is required", success: false });
        }
        if (!reason) {
            return res.status(400).json({ message: "Reason for Enquiry is required", success: false });
        }
        if (!mobile) {
            return res.status(400).json({ message: "Mobile Number is required", success: false });
        }
        if (!type) {
            return res.status(400).json({ message: "Type of Enquiry is required", success: false });
        }
        next();
    } catch (error) {
        console.log("error on addEnquiryValidation", error);
        return res.status(500).json({ message: error.message, error, success: false });
    }
}