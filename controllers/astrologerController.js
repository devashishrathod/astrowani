const Astrologer = require("../models/astrologerModel");
const User = require("../models/userModel");
const Session = require('../models/sessionModel');
const Chat = require('../models/chatModel');
const CallHistory = require("../models/CallHistory");
const { default: mongoose } = require("mongoose");
const moment = require('moment');


const getTodayDateRange = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0); // Set time to 00:00:00
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999); // Set time to 23:59:59
  return { todayStart, todayEnd };
};


// @desc    Get all astrologers with pagination
// @route   GET /api/v1/astrologers
// @access  Public
exports.getAstrologers = async (req, res, next) => {
  try {
    // Extract page and limit from query params, with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the starting index of the records
    const startIndex = (page - 1) * limit;

    // Get total count of astrologers
    const total = await Astrologer.countDocuments();

    // Fetch astrologers with pagination and populate specialties
    const astrologers = await Astrologer.find().populate("specialties", "name").skip(startIndex).limit(limit);
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Send the response with pagination data
    res.status(200).json({ success: true, count: astrologers.length, totalPages, currentPage: page, data: astrologers, });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get single astrologer
// @route   GET /api/v1/astrologers/:id
// @access  Public
exports.getAstrologer = async (req, res, next) => {
  // console.log("DETAILS ASTROLOGER");
  const now = moment();
  const startOfMonth = now.clone().startOf('month').toDate();
  const endOfMonth = now.clone().endOf('month').toDate();

  try {
    const astrologer = await Astrologer.findById(req.params.id).populate("userId", "specialties name");
    // const callCount = await CallHistory.countDocuments({ astrologerId: req.params.id });
    const allCalls = await CallHistory.find({ astrologerId: req.params.id });

    const user = await User.findById(astrologer.userId).select("-password -__v");

    const monthlyCalls = await CallHistory.find({
      astrologerId: req.params.id,
      callStartTime: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let timeDay = 0;
    let timeNight = 0;

    allCalls.forEach((call) => {
      const startHour = moment(call.callStartTime).hour();
      const duration = call.callDuration || 0;

      if (startHour >= 6 && startHour < 18) {
        timeDay += duration;
      } else {
        timeNight += duration;
      }
    });


    if (!astrologer) {
      return res.status(404).json({ success: false, error: `Astrologer not found with id of ${req.params.id}`, });
    }

    res.status(200).json({ success: true, data: astrologer, callCount: allCalls.length, monthlyCallCount: monthlyCalls.length, timeDay, timeNight, packageUsed: user?.activePlan || 'Not implemented' });
  } catch (error) {
    console.log("error on getAstrologer:", error);

    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Create new astrologer
// @route   POST /api/v1/astrologers
// @access  Private/Admin
exports.createAstrologer = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.create(req.body);
    res.status(201).json({ success: true, data: astrologer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update astrologer
// @route   PUT /api/v1/astrologers/:id
// @access  Private/Admin
exports.updateAstrologer = async (req, res, next) => {
  try {
    let astrologer = await Astrologer.findById(req.params.id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        error: `Astrologer not found with id of ${req.params.id}`,
      });
    }

    astrologer = await Astrologer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: astrologer });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.updatedStatusAstro = async (req, res) => {
  const id = req.user?._id
  const online = req.body?.status
  try {
    const checkAstro = await User.findOne({ _id: id, role: "astrologer" })
    if (!checkAstro) {
      return res.status(404).json({ success: false, message: "Astrologer not found" });
    }
    checkAstro.online = online
    const result = await checkAstro.save()
    if (!result) {
      return res.status(404).json({ success: false, message: `Failed to ${online} Astrologer!` });
    }
    return res.status(200).json({ success: true, message: `Astrologer successfully ${online}.`, data: result });

  } catch (error) {
    console.log("error on updatedStatusAstro:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// @desc    Delete astrologer
// @route   DELETE /api/v1/astrologers/:id
// @access  Private/Admin
exports.deleteAstrologer = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.findByIdAndDelete(
      req.params.id
    ).populate("userId");
    const user = await User.findByIdAndDelete(astrologer.userId._id);
    if (!astrologer) {
      return res.status(404).json({
        success: false,
        error: `Astrologer not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, message: "Deleted Successful" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get astrologers by specialty
// @route   GET /api/v1/astrologers/specialty/:categoryId
// @access  Public
exports.getAstrologersBySpecialty = async (req, res, next) => {
  console.log("req.params: ", req.params);

  try {
    let filter = {};
    if (req.params.categoryId) {
      filter = { specialties: req.params.categoryId }
    }
    const astrologers = await Astrologer.find(filter).populate("specialties", "name");
    res.status(200).json({ success: true, count: astrologers.length, data: astrologers });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.liveAstrologers = async (req, res, next) => {

  try {
    const astrologers = await Astrologer.find({ isAvailable: true }).populate("specialties", "name");
    res.status(200).json({ success: true, count: astrologers.length, data: astrologers });
  } catch (error) {
    console.log("error on liveAstrologers:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get top rated astrologers
// @route   GET /api/v1/astrologers/top-rated
// @access  Public
exports.getTopRatedAstrologers = async (req, res, next) => {
  try {
    const astrologers = await Astrologer.find().sort({ rating: -1 }).limit(5).populate("specialties", "name");
    res.status(200).json({ success: true, count: astrologers.length, data: astrologers });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Toggle astrologer availability
// @route   PUT /api/v1/astrologers/:id/toggle-availability
// @access  Private/Astrologer
exports.toggleAstrologerAvailability = async (req, res, next) => {
  try {
    let astrologer = await Astrologer.findById(req.params.id);

    if (!astrologer) {
      return res.status(404).json({ success: false, error: `Astrologer not found with id of ${req.params.id}`, });
    }

    // Ensure the astrologer can only toggle their own availability
    if (
      astrologer.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ success: false, error: `User ${req.user.id} is not authorized to update this astrologer`, });
    }

    astrologer.isAvailable = !astrologer.isAvailable;
    await astrologer.save();

    res.status(200).json({ success: true, data: astrologer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
exports.toggleOnlineAstrologerAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id;

    console.log("userid: ", userId);


    // Fetch the astrologer document using the associated userId
    const astrologer = await Astrologer.findOne({ userId });

    if (!astrologer) {
      return res.status(404).json({ success: false, error: "Astrologer not found", });
    }

    // Toggle the availability status
    astrologer.isAvailable = !astrologer.isAvailable;
    await astrologer.save();

    return res.status(200).json({ success: true, data: astrologer, });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error", message: "Failed to go live!" });
  }
};


// @desc    Create new astrologer with user account
// @route   POST /api/v1/astrologers/create
// @access  Private/Admin
exports.createAstrologerWithAccount = async (req, res, next) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      specialties,
      experience,
      bio,
      profileImage,
      pricing,
    } = req.body;

    // Create user account
    const user = await User.create({
      email,
      password,
      role: "astrologer",
      firstName,
      lastName,
      phoneNumber,
      isVerified: true,
    });

    // Create astrologer profile
    const astrologer = await Astrologer.create({
      name: `${firstName} ${lastName}`,
      email,
      phoneNumber,
      specialties,
      experience,
      bio,
      profileImage,
      rating: 0, // Initial rating
      isAvailable: true,
      pricing,
      userId: user._id,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
        astrologer,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



// Controller to get today's earnings and chat count for an astrologer
// exports.getAstrologerTodayStats = async (req, res) => {
//   try {

//     const astrologerId = req.user._id; // Get the astrologer's ID from the token
//     const { todayStart, todayEnd } = getTodayDateRange();

//     // Get total earnings for today
//     const sessionsToday = await Session.find({
//       astrologerId,
//       startTime: { $gte: todayStart, $lte: todayEnd },
//       status: 'completed',
//     });

//     const totalEarnings = sessionsToday.reduce((acc, session) => acc + (session.totalCharge || 0), 0);

//     // Get the count of chats for today
//     const chatsTodayCount = await Chat.countDocuments({
//       sessionId: { $in: sessionsToday.map(session => session._id) },
//       sentAt: { $gte: todayStart, $lte: todayEnd },
//     });


//     res.status(200).json({
//       success: true,
//       data: {
//         totalEarnings,
//         totalCallsCount: 9,
//         chatsCount: chatsTodayCount,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message,
//     });
//   }
// };

// exports.getAstrologerTodayStats = async (req, res) => {
//   try {
//     const astrologerId = req.user._id; // Get the astrologer's ID from the token
//     const { todayStart, todayEnd } = getTodayDateRange(); // Utility function to get start and end of today

//     // Get total earnings for today
//     const sessionsToday = await Session.find({
//       astrologerId,
//       startTime: { $gte: todayStart, $lte: todayEnd },
//       status: 'completed',
//     });

//     const totalEarnings = sessionsToday.reduce((acc, session) => acc + (session.totalCharge || 0), 0);

//     // Get the count of chats for today
//     const chatsTodayCount = await Chat.countDocuments({
//       sessionId: { $in: sessionsToday.map(session => session._id) },
//       sentAt: { $gte: todayStart, $lte: todayEnd },
//     });

//     // Get today's distinct user count for calls
//     const todaysCallCount = await CallHistory.aggregate([
//       {
//         $match: {
//           astrologerId,
//           callStartTime: { $gte: todayStart, $lte: todayEnd },
//           callStatus: 'completed',
//         },
//       },
//       {
//         $group: {
//           _id: '$userId', // Group by user ID to get distinct users
//         },
//       },
//       {
//         $count: 'distinctUsers', // Count distinct user IDs
//       },
//     ]);

//     const totalCallUsers = todaysCallCount.length > 0 ? todaysCallCount[0].distinctUsers : 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         totalEarnings,
//         totalCallsCount: totalCallUsers,
//         chatsCount: chatsTodayCount,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message,
//     });
//   }
// };

exports.getAstrologerTodayStats = async (req, res) => {
  try {
    const astrologerId = req.user._id; // Get the astrologer's ID from the token
    const { todayStart, todayEnd } = getTodayDateRange(); // Utility function to get start and end of today

    // Get total earnings for today
    const sessionsToday = await Session.find({
      astrologerId,
      startTime: { $gte: todayStart, $lte: todayEnd },
      status: 'completed',
    });

    const totalEarnings = sessionsToday.reduce((acc, session) => acc + (session.totalCharge || 0), 0);

    // Get the count of chats for today
    const chatsTodayCount = await Chat.countDocuments({
      sessionId: { $in: sessionsToday.map((session) => session._id) },
      sentAt: { $gte: todayStart, $lte: todayEnd },
    });

    // Get today's distinct user count for calls
    const callUsersAggregation = await CallHistory.aggregate([
      {
        $match: {
          astrologerId: new mongoose.Types.ObjectId(astrologerId),
          callStartTime: { $gte: todayStart, $lte: todayEnd },
          callStatus: 'completed',
        },
      },
      {
        $group: {
          _id: '$clientId', // Group by client ID to get distinct users
        },
      },
    ]);

    const totalCallUsers = callUsersAggregation.length;

    res.status(200).json({ success: true, data: { totalEarnings, totalCallsCount: totalCallUsers, chatsCount: chatsTodayCount, }, });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message, });
  }
};


// Enable/Disable Chat
exports.enableDisableChat = async (req, res) => {
  try {
    const astrologerId = req.user._id; // Get astrologer ID from token (authentication middleware)
    const { isChatEnabled } = req.body;

    // Update the isChatEnabled field
    const updatedAstrologer = await Astrologer.findOneAndUpdate(
      { userId: astrologerId },
      { isChatEnabled },
      { new: true }
    );

    if (!updatedAstrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    res.status(200).json({ success: true, data: updatedAstrologer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Enable/Disable Call
exports.enableDisableCall = async (req, res) => {
  try {
    const astrologerId = req.user._id; // Get astrologer ID from token (authentication middleware)
    const { isCallEnabled } = req.body;

    // Update the isCallEnabled field
    const updatedAstrologer = await Astrologer.findOneAndUpdate(
      { userId: astrologerId },
      { isCallEnabled },
      { new: true }
    );

    if (!updatedAstrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    res.status(200).json({ success: true, data: updatedAstrologer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.enableDisableVideoCall = async (req, res) => {
  try {
    const astrologerId = req.user._id; // Get astrologer ID from token (authentication middleware)
    const { isVideoCallEnabled } = req.body;
    // console.log("req.body: ", req.body);

    // Update the isCallEnabled field
    const updatedAstrologer = await Astrologer.findOneAndUpdate(
      { userId: astrologerId },
      { isVideoCallEnabled },
      { new: true }
    );

    if (!updatedAstrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    res.status(200).json({ success: true, data: updatedAstrologer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get charge per minute for chat and call
exports.getAstrologerCharges = async (req, res) => {
  try {
    const astrologerId = req.user._id; // Get astrologer ID from token (authentication middleware)

    // Fetch the astrologer's charges
    const astrologer = await Astrologer.findOne({ userId: astrologerId }).select('chatChargePerMinute callChargePerMinute isChatEnabled isCallEnabled');

    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        chatChargePerMinute: astrologer.chatChargePerMinute,
        callChargePerMinute: astrologer.callChargePerMinute,
        isChatEnabled: astrologer.isChatEnabled,
        isCallEnabled: astrologer.isCallEnabled,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single astrologer
// @route   GET /api/v1/astrologers/get-astrologer
// @access  Public
exports.getAstrologerUsingToken = async (req, res, next) => {
  try {
    const astrologer = await Astrologer.findOne({ userId: req.user._id }).populate("userId", "firstName lastName email phoneNumber gender ");

    if (!astrologer) {
      return res.status(404).json({ success: false, error: `Astrologer not found with id of ${req.params.id}`, });
    }

    res.status(200).json({ success: true, data: astrologer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
// @desc    Get single astrologer
// @route   PUT /api/v1/astrologers/update-astrologer
// @access  Public
exports.updateAstrologerUsingToken = async (req, res, next) => {
  try {
    const updatedProfile = await Astrologer.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};