// controllers/vendorController.js
const ChatHistory = require('../models/chatModel');
const Session = require('../models/sessionModel');
const User = require('../models/userModel');

// Get all customers for an astrologer
exports.getMyCustomers = async (req, res) => {
  try {
    const astrologerId = req.user.astrologerId; // Assuming middleware sets this
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || '';
    const sortBy = req.query.sortBy || 'lastInteraction'; // lastInteraction, totalSessions
    const sortOrder = req.query.sortOrder || 'desc';

    const query = {
      astrologer: astrologerId,
      status: { $ne: 'BLOCKED' }
    };

    // If there's a search query, look for matching customers
    if (searchQuery) {
      const customerIds = await User.find({
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      }).distinct('_id');

      query.customer = { $in: customerIds };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const totalCustomers = await ChatHistory.countDocuments(query);
    
    const customers = await ChatHistory.find(query)
      .populate('customer', 'firstName lastName email profilePic lastSeen')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCustomers / limit),
          totalCustomers,
          hasMore: page * limit < totalCustomers
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history with a specific customer
exports.getCustomerChatHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const astrologerId = req.user.astrologerId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const chatHistory = await ChatHistory.findOne({
      astrologer: astrologerId,
      customer: customerId
    }).populate('customer', 'firstName lastName email profilePic');

    if (!chatHistory) {
      return res.status(404).json({ message: "No chat history found" });
    }

    // Get messages for this customer-astrologer pair
    const messages = await Session.aggregate([
      {
        $match: {
          astrologer: mongoose.Types.ObjectId(astrologerId),
          client: mongoose.Types.ObjectId(customerId)
        }
      },
      {
        $lookup: {
          from: 'chatmessages',
          localField: '_id',
          foreignField: 'session',
          as: 'messages'
        }
      },
      { $unwind: '$messages' },
      {
        $sort: { 'messages.createdAt': -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      },
      {
        $group: {
          _id: '$_id',
          sessionType: { $first: '$sessionType' },
          startTime: { $first: '$startTime' },
          endTime: { $first: '$endTime' },
          messages: { 
            $push: {
              content: '$messages.content',
              sender: '$messages.sender',
              createdAt: '$messages.createdAt',
              messageType: '$messages.messageType'
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        customerInfo: chatHistory.customer,
        overview: {
          totalSessions: chatHistory.totalSessions,
          totalDuration: chatHistory.totalDuration,
          lastInteraction: chatHistory.lastInteraction,
          status: chatHistory.status
        },
        sessions: messages
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer session statistics
exports.getCustomerStats = async (req, res) => {
  try {
    const { customerId } = req.params;
    const astrologerId = req.user.astrologerId;

    const stats = await Session.aggregate([
      {
        $match: {
          astrologer: mongoose.Types.ObjectId(astrologerId),
          client: mongoose.Types.ObjectId(customerId),
          status: 'COMPLETED'
        }
      },
      {
        $group: {
          _id: '$sessionType',
          totalSessions: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          averageRating: { $avg: '$rating' },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get recent reviews
    const reviews = await Session.find({
      astrologer: astrologerId,
      client: customerId,
      review: { $exists: true, $ne: null }
    })
    .select('review rating createdAt sessionType')
    .sort('-createdAt')
    .limit(5);

    res.json({
      success: true,
      data: {
        sessionStats: stats,
        recentReviews: reviews
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer status (block/unblock)
exports.updateCustomerStatus = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status } = req.body;
    const astrologerId = req.user.astrologerId;

    const chatHistory = await ChatHistory.findOneAndUpdate(
      {
        astrologer: astrologerId,
        customer: customerId
      },
      { status },
      { new: true }
    );

    if (!chatHistory) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json({
      success: true,
      data: chatHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};