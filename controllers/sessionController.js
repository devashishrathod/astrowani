// sessionController.js
const Session = require('../models/sessionModel');
const Chat = require('../models/chatModel');
const CallHistory = require('../models/CallHistory');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// // Session management
// const sessionController = {
//   // Start a new session (chat/call/video)
//   async startSession(req, res) {
//     try {
//       const { sessionType, astrologerId, clientId, chargePerMinute } = req.body;

//       // Verify astrologer availability
//       const astrologer = await User.findOne({
//         _id: astrologerId,
//         role: 'astrologer',
//       });

//       if (!astrologer) {
//         return res.status(404).json({ message: 'Astrologer not found' });
//       }

//       // Create new session
//       const session = await Session.create({
//         sessionType,
//         astrologerId,
//         clientId,
//         startTime: new Date(),
//         chargePerMinute,
//         status: 'ongoing'
//       });

//       // If it's a chat session, create initial chat room
//       if (sessionType === 'chat') {
//         await Chat.create({
//           sessionId: session._id,
//           sender: clientId,
//           message: 'Session started',
//         });
//       }

//       res.status(201).json({
//         success: true,
//         data: session
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // End ongoing session
//   async endSession(req, res) {
//     try {
//       const { sessionId } = req.params;
//       const session = await Session.findById(sessionId);

//       if (!session) {
//         return res.status(404).json({ message: 'Session not found' });
//       }

//       // Calculate duration and charges
//       const endTime = new Date();
//       const duration = Math.ceil((endTime - session.startTime) / (1000 * 60)); // in minutes
//       const totalCharge = duration * session.chargePerMinute;

//       // Update session
//       session.endTime = endTime;
//       session.duration = duration;
//       session.totalCharge = totalCharge;
//       session.status = 'completed';
//       await session.save();

//       // Create call history for audio/video calls
//       if (['audioCall', 'videoCall', 'liveVideo'].includes(session.sessionType)) {
//         await CallHistory.create({
//           astrologerId: session.astrologerId,
//           clientId: session.clientId,
//           callStartTime: session.startTime,
//           callEndTime: endTime,
//           callDuration: duration,
//           callStatus: 'completed'
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: session
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // Add chat message to session
//   async addChatMessage(req, res) {
//     try {
//       const { sessionId } = req.params;
//       const { senderId, message } = req.body;

//       const session = await Session.findById(sessionId);
//       if (!session || session.status !== 'ongoing') {
//         return res.status(404).json({ message: 'Active session not found' });
//       }

//       const chat = await Chat.create({
//         sessionId,
//         sender: senderId,
//         message
//       });

//       res.status(201).json({
//         success: true,
//         data: chat
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // Get session history
//   async getSessionHistory(req, res) {
//     try {
//       const { userId, role, type } = req.query;
//       const query = {};

//       // Filter based on user role
//       if (role === 'astrologer') {
//         query.astrologerId = userId;
//       } else {
//         query.clientId = userId;
//       }

//       // Filter by session type if specified
//       if (type) {
//         query.sessionType = type;
//       }

//       const sessions = await Session.find(query)
//         .sort({ createdAt: -1 })
//         .populate('astrologerId', 'firstName lastName')
//         .populate('clientId', 'firstName lastName');

//       res.status(200).json({
//         success: true,
//         data: sessions
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // Get chat history for a session
//   async getChatHistory(req, res) {
//     try {
//       const { sessionId } = req.params;
//       const messages = await Chat.find({ sessionId })
//         .sort({ sentAt: 1 })
//         .populate('sender', 'firstName lastName role');

//       res.status(200).json({
//         success: true,
//         data: messages
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // Add rating and feedback
//   async addFeedback(req, res) {
//     try {
//       const { sessionId } = req.params;
//       const { rating, feedback } = req.body;

//       const session = await Session.findByIdAndUpdate(
//         sessionId,
//         { rating, feedback },
//         { new: true }
//       );

//       if (!session) {
//         return res.status(404).json({ message: 'Session not found' });
//       }

//       res.status(200).json({
//         success: true,
//         data: session
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

// //    // Get list of unique clients connected to an astrologer
// //    async getConnectedClients(req, res) {
// //     try {
// //       const astrologerId = req.user._id; // Assuming astrologerId is obtained from the authentication middleware
// // console.log("astroloderid",astrologerId);

// //       // Find all sessions with the astrologer
// //       const sessions = await Session.find({ astrologerId }).distinct('customerId');
// // console.log(sessions);

// //       // Populate client information
// //       const clients = await User.find({ _id: { $in: sessions } }, 'firstName lastName email profilePic');

// //       res.status(200).json({
// //         success: true,
// //         data: clients,
// //       });
// //     } catch (error) {
// //       res.status(500).json({
// //         success: false,
// //         message: error.message,
// //       });
// //     }
// //   },


// module.exports = sessionController;

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res, next) => {
  const { sessionType, astrologerId, /* clientId, */ startTime, chargePerMinute, } = req.body;

  // const sessionType = "chat"
  // const astrologerId = "6728a2ab0729a58cf740fd74"
  // const clientId = "674d7ffc4dcf1303e99467cd"
  // const startTime = new Date()
  // const chargePerMinute = 1
  try {
    const newSession = await Session.create({ sessionType, astrologerId, clientId: req.user?._id, startTime, chargePerMinute, status: "ongoing", });

    res.status(201).json({ success: true, data: newSession, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// @desc    Get session history for an astrologer or client
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, sessionType } = req.query;
    const filter = {};

    if (req.user.role === "astrologer") {
      filter.astrologerId = req.user._id;
    } else if (req.user.role === "customer") {
      filter.clientId = req.user._id;
    } else {
      return res.status(403).json({
        success: false,
        message: "User role is not authorized to access this route",
      });
    }

    if (sessionType) filter.sessionType = sessionType;

    const sessions = await Session.find(filter)
      .populate("astrologerId", "firstName lastName email")
      .populate("clientId", "firstName lastName email")
      .skip(Number(offset))
      .limit(Number(limit))
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update a session's details (e.g., mark as completed)
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res, next) => {
  const { endTime, status, isPaid } = req.body;
  const sessionId = req.params.id;

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Update session details
    session.endTime = endTime || session.endTime;
    session.status = status || session.status;
    session.isPaid = isPaid !== undefined ? isPaid : session.isPaid;

    // Calculate duration and total charge if session is completed
    if (session.endTime && session.status === "completed") {
      session.duration = (new Date(session.endTime) - new Date(session.startTime)) / 60000; // in minutes
      session.totalCharge = session.duration * session.chargePerMinute;
      session.earnings = session.totalCharge; // You can adjust this if there's a commission
    }

    const updatedSession = await session.save();

    res.status(200).json({ success: true, data: updatedSession, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getConnectedClients = async (req, res) => {
  try {
    const astrologerId = req.user._id; // Assuming astrologerId is obtained from the authentication middleware
    console.log("astrologerId", astrologerId);

    // Aggregate sessions and join with client details
    const sessionsWithClientDetails = await Session.aggregate([
      {
        $match: { astrologerId: astrologerId } // Filter sessions for the given astrologer
      },
      {
        $lookup: {
          from: 'users', // Assuming your users collection is named 'users'
          localField: 'customerId',
          foreignField: '_id',
          as: 'clientDetails'
        }
      },
      {
        $unwind: '$clientDetails' // Unwind to flatten the array of client details
      },
      {
        $project: {
          sessionId: '$_id',
          sessionType: 1,
          duration: 1,
          status: 1,
          startTime: 1,
          endTime: 1,
          price: 1,
          clientId: '$customerId',
          firstName: '$clientDetails.firstName',
          lastName: '$clientDetails.lastName',
          email: '$clientDetails.email',
          profilePic: '$clientDetails.profilePic'
        }
      }
    ]);

    res.status(200).json({ success: true, data: sessionsWithClientDetails, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
}

exports.getConnectedAstrologers = async (req, res) => {
  try {
    const clientId = req.user._id; // Assuming clientId is obtained from the authentication middleware
    console.log("clientId", clientId);

    // Aggregate sessions and join with astrologer details
    const sessionsWithAstrologerDetails = await Session.aggregate([
      {
        $match: { customerId: clientId } // Filter sessions for the given client
      },
      {
        $lookup: {
          from: 'users', // Assuming your users collection is named 'users'
          localField: 'astrologerId',
          foreignField: '_id',
          as: 'astrologerDetails'
        }
      },
      {
        $unwind: '$astrologerDetails' // Unwind to flatten the array of astrologer details
      },
      {
        $project: {
          sessionId: '$_id',
          sessionType: 1,
          duration: 1,
          status: 1,
          startTime: 1,
          endTime: 1,
          price: 1,
          astrologerId: '$astrologerId',
          firstName: '$astrologerDetails.firstName',
          lastName: '$astrologerDetails.lastName',
          email: '$astrologerDetails.email',
          profilePic: '$astrologerDetails.profilePic'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: sessionsWithAstrologerDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all sessions by clientId with optional pagination
exports.getSessionsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params; // Client ID from request parameters
    const { page = 1, limit = 10 } = req.query; // Pagination parameters (default: page 1, limit 10)

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({ error: "Client ID is required." });
    }

    // Fetch sessions from the database
    const sessions = await Session.find({ clientId })
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip((page - 1) * limit) // Pagination: skip items
      .limit(parseInt(limit)) // Limit the number of items
      .populate("astrologerId", "name") // Populate astrologer details (optional)
      .populate("clientId", "name") // Populate client details (optional)
      .exec();

    // Count total sessions for pagination metadata
    const totalSessions = await Session.countDocuments({ clientId });

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSessions / limit),
        totalSessions,
      },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

