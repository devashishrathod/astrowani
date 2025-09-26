const Astrologer = require("../models/astrologerModel");
const CallHistory = require("../models/CallHistory");

// @desc    Create a new call history record
// @route   POST /api/call-history
// @access  Private
exports.createCallHistory = async (req, res, next) => {
  const { astrologerId, clientId, callStartTime, callEndTime, callStatus, rating, comments, } = req.body;

  try {
    const callDuration = (new Date(callEndTime) - new Date(callStartTime)) / 60000; // Calculate duration in minutes
    const astrologer = await Astrologer.findOne({
      userId: astrologerId,
    });
    const newCall = await CallHistory.create({ astrologerId, clientId, callStartTime, callEndTime, callDuration, callStatus, rating, comments, });
    astrologer.callCount = astrologer.callCount + 1;

    await astrologer.save()
    res.status(201).json({ success: true, data: newCall, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// // @desc    Get call history for astrologer or client
// // @route   GET /api/call-history
// // @access  Private
// exports.getCallHistory = async (req, res, next) => {
//   const { astrologerId, clientId, limit = 10, offset = 0 } = req.query;

//   try {
//     const filter = {};
//     if (astrologerId) filter.astrologerId = astrologerId;
//     if (clientId) filter.clientId = clientId;

//     const history = await CallHistory.find(filter)
//       .skip(Number(offset))
//       .limit(Number(limit))
//       .sort({ callStartTime: -1 });

//     res.status(200).json({
//       success: true,
//       count: history.length,
//       data: history,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// @desc    Get call history for astrologer or client
// @route   GET /api/call-history
// @access  Private
exports.getCallHistory = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const filter = {};
    // console.log("ROLE :", req.user.role);

    // Check user role and set filter accordingly
    if (req.user.role === "astrologer") {
      filter.astrologerId = req.user._id; // Filter by astrologer ID
    } else if (req.user.role === "customer") {
      filter.clientId = req.user._id; // Filter by client ID
    } else {
      return res.status(403).json({ success: false, message: "User role is not authorized to access this route", });
    }

    // Fetch and populate call history
    const history = await CallHistory.find(filter)
      .populate("astrologerId", "firstName lastName email profilePic") // Populate astrologer details
      .populate("clientId", "firstName lastName email profilePic") // Populate client details
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ callStartTime: -1 });
    // console.log("history: ", history);

    res.status(200).json({ success: true, count: history.length, data: history, });
  } catch (error) {
    console.log("error on getCallHistory: ", error);

    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCallHistoryByAstroId = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const astrologerId = req.params?.id
  try {
    const filter = { astrologerId };

    const history = await CallHistory.find(filter)
      .populate("astrologerId", "firstName lastName email") // Populate astrologer details
      .populate("clientId", "firstName lastName email profilePic") // Populate client details
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ callStartTime: -1 });

    res.status(200).json({ success: true, count: history.length, data: history, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
exports.getCallHistoryTOekn = async (req, res) => {

  const astrologerId = req.user._id
  try {
    const filter = { astrologerId };

    const history = await CallHistory.find(filter)
      .populate("astrologerId", "firstName lastName email") // Populate astrologer details
      .populate("clientId", "firstName lastName email profilePic") // Populate client details
      .sort({ callStartTime: -1 });

    res.status(200).json({ success: true, count: history.length, data: history, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// @desc    Update a call history record
// @route   PUT /api/call-history/:id
// @access  Private
exports.updateCallHistory = async (req, res, next) => {
  try {
    const updatedCall = await CallHistory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });

    if (!updatedCall) {
      return res.status(404).json({ success: false, message: "Call history not found" });
    }

    res.status(200).json({ success: true, data: updatedCall, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a call history record
// @route   DELETE /api/call-history/:id
// @access  Private
exports.deleteCallHistory = async (req, res, next) => {
  try {
    const deletedCall = await CallHistory.findByIdAndDelete(req.params.id);

    if (!deletedCall) {
      return res.status(404).json({ success: false, message: "Call history not found" });
    }

    res.status(200).json({ success: true, message: "Call history deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
