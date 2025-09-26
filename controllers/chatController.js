const { updateSessionActivity } = require("../helpers/updateSessionActivity");
const Astrologer = require("../models/astrologerModel");
const Chat = require("../models/chatModel");
const Session = require("../models/sessionModel");
const userModel = require("../models/userModel");
const { logger } = require("../utils/logger/logger");

exports.getChatHistory = async (req, res) => {
  try {
    const { receiver } = req.query;
    const page = parseInt(req.query.page, 1) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const userId = req.user._id;
    // console.log("userId:", userId);
    const skip = (page - 1) * limit;

    const chatHistory = await Chat.find({ $or: [{ sender: userId, receiver }, { sender: receiver, receiver: userId },] }).sort({ createdAt: 1 }).skip(skip).limit(limit);
    const totalChats = await Chat.countDocuments({ $or: [{ sender: userId, receiver }, { sender: receiver, receiver: userId },] });
    res.status(200).json({ success: true, data: chatHistory, pagination: { totalChats, currentPage: page, totalPages: Math.ceil(totalChats / limit), }, });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ success: false, message: "Error fetching chat history" });
  }
};

exports.getChatHistoryUser = async (req, res) => {
  try {
    console.log("req.query: ", req.query);

    const { receiver, sessionId } = req.query;
    const userId = req.user._id;

    const matchCondition = {
      $or: [
        { sender: userId, receiver },
        { sender: receiver, receiver: userId }
      ]
    };

    if (sessionId) {
      matchCondition.sessionId = sessionId;
    }

    const chatHistory = await Chat.find(matchCondition).sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: chatHistory });
  } catch (error) {
    console.error("Error fetching chat getChatHistoryUser:", error);
    res.status(500).json({ success: false, message: "Error fetching chat history" });
  }
};


/* exports.getAllChatHistory = async (req, res) => {
  const astrologerId = req.user._id; // Assuming the logged-in astrologer's ID is in req.user._id
  console.log("astrologerId: ", astrologerId);

  try {
    // Find all chats where the astrologer is either the sender or receiver
    const chats = await Chat.find({ $or: [{ sender: astrologerId }, { receiver: astrologerId }], })
      .populate("sender", "name email firstName lastName profilePic") // Populate sender details
      .populate("receiver", "name email  firstName lastName profilePic") // Populate receiver details
      .exec();

    const uniqueUsers = Array.from(
      chats.reduce((map, chat) => {
        const otherUser = chat.sender?._id?.toString() === astrologerId?.toString() ? chat.receiver : chat.sender;
        // ✅ Handle null and undefined values
        if (otherUser && otherUser._id && !map.has(otherUser._id.toString())) {
          map.set(otherUser._id.toString(), otherUser);
        }

        return map;
      }, new Map()).values()
    );

    console.log("uniqueUsers: ", uniqueUsers);

    return res.status(200).json({ success: true, message: "Unique users chatting with astrologer retrieved successfully.", data: uniqueUsers, });
  } catch (error) {
    console.error("Error on getAllChatHistory:", error);
    res.status(500).json({ success: false, message: error.message, error });
  }
}; */
/* exports.getAllChatHistory = async (req, res) => {
  const astrologerId = req.user._id;

  try {
    const chats = await Chat.find({
      $or: [{ sender: astrologerId }, { receiver: astrologerId }]
    })
      .populate("sender", "name email firstName lastName profilePic")
      .populate("receiver", "name email firstName lastName profilePic")
      .sort({ createdAt: 1 })
      .exec();

    const chatMap = new Map();

    chats.forEach(chat => {
      // Skip if sender or receiver is null (defensive check)
      if (!chat.sender || !chat.receiver) return;

      const isSender = chat.sender._id.toString() === astrologerId.toString();
      const otherUser = isSender ? chat.receiver : chat.sender;

      if (!otherUser || !otherUser._id) return; // Ensure otherUser is valid

      const otherUserId = otherUser._id.toString();

      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          user: otherUser,
          messages: []
        });
      }

      chatMap.get(otherUserId).messages.push({
        _id: chat._id,
        sessionId: chat.sessionId,
        sender: chat.sender,
        receiver: chat.receiver,
        message: chat.message,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      });
    });

    const chatHistory = Array.from(chatMap.values());
    console.log("chatHistory: ", chatHistory);

    return res.status(200).json({
      success: true,
      message: "Chat history with users retrieved successfully.",
      data: chatHistory
    });
  } catch (error) {
    console.error("Error in getAllChatHistory:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}; */

exports.getAllChatHistory = async (req, res) => {
  const astrologerId = req.user._id;

  try {
    // Step 1: Get all ongoing chat sessions for this astrologer
    const checkAstrologer = await Astrologer.findOne({ userId: astrologerId });
    if (!checkAstrologer) {
      return res.status(404).json({ success: false, msg: 'Astrologer not found' })
    }
    const sessions = await Session.find({
      astrologerId: checkAstrologer?._id,
      sessionType: "chat",
      status: "ongoing"
    }).populate("clientId", "name email firstName lastName profilePic").sort({ updatedAt: -1 });

    // Step 2: Build user list with sessionId and socket roomId
    const chatUsers = sessions.map((session) => {
      return {
        user: session.clientId,
        sessionId: session._id,
        // roomId: `${session.astrologerId.toString()}_${session.clientId._id.toString()}`
        // roomId: `${session.clientId._id.toString()}_${session.astrologerId.toString()}`
        // roomId: `${session.clientId._id.toString()}_${astrologerId.toString()}`
        roomId: `${astrologerId.toString()}_${session.clientId._id.toString()}`
      };
    });
    /* const chatUsers = sessions.map((session) => {
      return {
        user: session.clientId,
        sessionId: session._id,
        roomId: `${session.clientId}_${session.astrologerId}` // or any unique socket room identifier
      };
    }); */

    // console.log("uniqueUsers: ", chatUsers);

    return res.status(200).json({ success: true, message: "Active chat users with sessions retrieved successfully.", data: chatUsers });

  } catch (error) {
    console.error("Error in getAllChatHistory:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.updateChatDetails = async (req, res, next) => {
  try {
    const { earnings, paid, status } = req.body;
    const chatId = req.params.chatId;

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { earnings, paid, status }, { new: true, runValidators: true });

    if (!updatedChat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: updatedChat, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.createChatMessage = async (req, res, next) => {
  const { sessionId, receiver, message } = req.body;
  const sender = req.user._id; // Assuming authenticated user's ID is the sender
  // const sender = "6728a2ab0729a58cf740fd74"
  try {
    const messageSize = message.length / 1024;
    const updateResult = await updateSessionActivity(sessionId, sender, messageSize);

    if (!updateResult.success) {
      return res.status(500).json({ message: "Failed to update session." });
    }

    if (updateResult.isPlanExceeded) {
      return res.status(403).json({ message: "Plan limits exceeded." });
    }
    // Fetch the receiver user by ID
    const user = await userModel.findById(receiver);
    if (!user) {
      return res.status(404).json({ success: false, message: "Receiver user not found", });
    }
    const newChat = await Chat.create({ sessionId, sender, receiver: user._id, message, });

    res.status(201).json({ success: true, data: newChat, });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
