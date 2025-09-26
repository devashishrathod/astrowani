const admin = require("firebase-admin");
const notificationService = require("../helpers/notificationService");
const Session = require("../models/sessionModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const CallHistory = require("../models/CallHistory");
const Astrologer = require("../models/astrologerModel");
const vcxroom = require("../enablex/vxroom");
// const generateAgoraToken = require("./agoraToken");

const creatToken = async (body) => {

  try {
    return new Promise((resolve, reject) => {
      vcxroom.getToken(body, (status, data) => {

        if (status && data) {
          resolve(data);
        } else {
          reject(new Error("Failed to get token"));
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching token");
  }
};

const creatRoomId = async () => {
  const newRoomObjec = {
    name: "Demo Room",
    settings: {
      description: `Voice-Calling`,
      scheduled: false,
      participants: "10",
      duration: "90",
      active_talker: true,
      auto_recording: false,
      adhoc: true,
      mode: "group",
      moderators: "4",
      quality: "SD",
      media_zone: "IN",
      knock: false,
      canvas: true,
      max_active_talkers: "6",
      screen_share: true,
      // audio_only: condition, //for true only audio and false so video
      abwd: true,
    },
    sip: {
      enabled: false,
    },
    data: {
      name: "Demo",
    },
    owner_ref: "Demo",
  };

  try {

    return new Promise((resolve, reject) => {
      vcxroom.createRoom(newRoomObjec, (status, data) => {
        if (status && data?.room?.room_id) {
          resolve(data?.room?.room_id);
        } else {
          reject(new Error("Failed to create room"));
        }
      });
    });

  } catch (error) {
    console.log("error on creatRoomId: ", error);
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating room" });
  }
};


// Initiate a call
const initiateCall = async (req, res) => {
  console.log("============================= initiateCall =============================");
  console.log("req.body: ", req.body);


  try {
    const { receiverId, callType } = req.body;
    const callerId = req.user._id;
    const callerRole = req.user.role;

    console.log("receiverId: ", receiverId);
    console.log("callType: ", callType);
    console.log("callerId: ", callerId);
    console.log("callerRole: ", callerRole);


    // Validate call type
    if (!["video", "voice"].includes(callType)) {
      return res.status(400).json({ success: false, message: "Call type must be either video or voice", });
    }

    // Determine astrologer and client based on caller's role
    let astrologerId, clientId;
    let astrologer;

    // const users = await Astrologer.find().sort({ createdAt: -1 })

    let callerUser

    if (callerRole === "customer") {
      clientId = callerId;
      astrologerId = receiverId;

      astrologer = await Astrologer.findOne({
        userId: receiverId,
        isAvailable: true,
      });

      callerUser = await User.findById(callerId)

      if (!astrologer) {
        return res.status(404).json({ success: false, message: "Astrologer not found or is currently unavailable", });
      }

      if (callType === "video" && !astrologer.isCallEnabled) {
        return res.status(400).json({ success: false, message: "Video calls are not enabled for this astrologer", });
      }

      if (callType === "voice" && !astrologer.isChatEnabled) {
        return res.status(400).json({ success: false, message: "Voice calls are not enabled for this astrologer", });
      }
    } else if (callerRole === "astrologer") {
      astrologerId = callerId;
      clientId = receiverId;

      const customer = await User.findOne({ _id: receiverId, role: "customer", });

      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found", });
      }

      astrologer = await Astrologer.findOne({ _id: callerId });
    } else {
      return res.status(403).json({ success: false, message: "Only customers and astrologers can initiate calls", });
    }

    // Check for active calls with proper error handling
    let activeCallerSession = await Session.findOne({
      $or: [{ clientId: callerId }, { astrologerId: callerId }],
      status: "ongoing",
      endTime: null,
    }).lean();

    let activeReceiverSession = await Session.findOne({
      $or: [{ clientId: receiverId }, { astrologerId: receiverId }],
      status: "ongoing",
      endTime: null,
    }).lean();

    // Auto-end any stale sessions that are more than 2 hours old
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    if (activeCallerSession && activeCallerSession.startTime < twoHoursAgo) {
      await Session.findByIdAndUpdate(activeCallerSession._id, {
        status: "completed",
        endTime: new Date(),
      });
      activeCallerSession = null;
    }

    if (activeReceiverSession && activeReceiverSession.startTime < twoHoursAgo) {
      await Session.findByIdAndUpdate(activeReceiverSession._id, { status: "completed", endTime: new Date(), });
      activeReceiverSession = null;
    }

    // Now check for active sessions after cleaning up stale ones
    if (activeCallerSession) {
      return res.status(400).json({ success: false, message: "You already have an active call", });
    }

    if (activeReceiverSession) {
      return res.status(400).json({ success: false, message: "Receiver is currently in another call", });
    }

    // Generate call credentials
    const credentials = {
      channelName: `${Date.now()}`,
      uid: `${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    };

    let roomId = await creatRoomId()
    // Generate Agora token
    // const token = generateAgoraToken(credentials.channelName, credentials.uid);
    // console.log("roomId: ", roomId);

    const data = {
      name: req.user.firstName || "Guest",
      role: "moderator",
      user_ref: callerId.toString(),
      roomId: roomId,
    };

    // console.log(" ===================================== data ========================================= ");
    // console.log("data: ", data);


    const token = await creatToken(data);
    // console.log("token: ", token);

    // Create session record
    const session = await Session.create({
      sessionType: callType === "video" ? "videoCall" : "audioCall",
      astrologerId,
      clientId,
      startTime: new Date(),
      status: "ongoing",
    });

    // console.log(" =============================== session ============================");
    // console.log("session: ", session);



    // Get receiver's FCM token
    const receiver = await User.findById(receiverId);
    /* if (!receiver?.fcm) {
      await Session.findByIdAndUpdate(session._id, { status: "failed", endTime: new Date(), });
      return res.status(400).json({ success: false, message: "Receiver is not available for calls", });
    } */

    // Send FCM notification
    const title = `Incoming ${callType} Call`;
    const message = `${req.user.firstName || "Someone"} is calling you`;

    /* await notificationService.sendCallMessage(title, message, receiver.fcm, {
      channelName: credentials.channelName,
      uid: credentials.uid,
      callType,
      sessionId: session._id.toString(),
      type: "call_invitation",
      callerName: req.user.firstName || "",
      callerRole: callerRole,
      roomId,
      receiverId,
      token: JSON.stringify(token),
      name: callerUser?.name?.toString(),
      role: callerUser?.role?.toString(),
      age: callerUser?.age?.toString(),
      image: callerUser?.pic?.toString(),
      distance: ""
    }); */

    // Create notification record
    await receiver.create({
      userId: receiverId,
      title,
      message,
      metadata: {
        sessionId: session._id,
        roomId
      },
    });
    console.log("============================= end initiateCall end =============================");
    res.status(200).json({ success: true, data: { ...credentials, callType, roomId, sessionId: session._id, receiver: { name: receiver.firstName, role: receiver.role, }, token, }, });
  } catch (error) {
    console.error("Call initiation error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to initiate call", });
  }
};

// End a call
/* const endCall = async (req, res) => {
  try {
    const { sessionId, duration, rating, feedback } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required", });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found", });
    }

    if (session.status !== "ongoing") {
      return res.status(400).json({ success: false, message: "Call is not ongoing", });
    }
    const astrologer = await Astrologer.findOne({
      userId: session.astrologerId,
    });
    // console.log(astrologer.callChargePerMinute);

    // Calculate call charges
    const callDuration = duration || Math.ceil((Date.now() - session.startTime) / 60000); // in minutes
    const totalCharge = callDuration * astrologer.callChargePerMinute;
    console.log(totalCharge);

    // Update session
    session.status = "completed";
    session.endTime = new Date();
    session.duration = callDuration;
    session.totalCharge = totalCharge;

    if (rating) session.rating = rating;
    if (feedback) session.feedback = feedback;
    await session.save();

    // Create call history record
    await CallHistory.create({
      astrologerId: session.astrologerId,
      clientId: session.clientId,
      callStartTime: session.startTime,
      callEndTime: session.endTime,
      callDuration,
      callStatus: "completed",
      rating,
      comments: feedback,
    });

    astrologer.callCount = astrologer.callCount + 1;

    await astrologer.save()

    // Notify users about call completion
    const users = await User.find({ _id: { $in: [session.astrologerId, session.clientId] }, });

    for (const user of users) {
      if (user.fcm) {
        const title = "Call Ended";
        const message = `Call duration: ${callDuration} minutes`;

        await notificationService.sendCallMessage(title, message, user.fcm, {
          type: "call_ended",
          sessionId: sessionId.toString(),
          duration: callDuration.toString(),
          totalCharge: totalCharge.toString(),
        });
      }
    }

    res.status(200).json({ success: true, data: { duration: callDuration, totalCharge, sessionId: session._id, }, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to end call", });
  }
}; */

/* const endCall = async (req, res) => {
  try {
    const { sessionId, duration, rating, feedback } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.status !== "ongoing") {
      return res.status(400).json({ success: false, message: "Call is not ongoing" });
    }

    const callDuration = duration || Math.ceil((Date.now() - session.startTime) / 60000); // in minutes

    const planSetting = await Plan.findOne();
    if (!planSetting) {
      return res.status(404).json({ success: false, message: "Plan settings not found" });
    }

    const callPlan = planSetting.voiceCall;
    const callerCharge = callDuration * callPlan.makeCallPoints;
    const receiverCharge = callDuration * callPlan.receiveCallPoints;
    const totalCharge = callerCharge + receiverCharge;

    const sender = await User.findById(session.senderId);
    const receiver = await User.findById(session.receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: "One or both users not found" });
    }

    // Check balance
    if (sender.points < callerCharge || receiver.points < receiverCharge) {
      return res.status(400).json({ success: false, message: "Insufficient balance for deduction" });
    }

    sender.points -= callerCharge;
    receiver.points -= receiverCharge;

    await sender.save();
    await receiver.save();

    session.status = "completed";
    session.endTime = new Date();
    session.duration = callDuration;
    session.totalCharge = totalCharge;
    if (rating) session.rating = rating;
    if (feedback) session.feedback = feedback;
    await session.save();

    await CallHistory.create({
      senderId: session.senderId,
      reciverId: session.receiverId,
      callStartTime: session.startTime,
      callEndTime: session.endTime,
      callDuration,
      callStatus: "completed",
      rating,
      comments: feedback,
    });

    // Send notification
    const users = await User.find({ _id: { $in: [session.senderId, session.receiverId] } });
    for (const user of users) {
      if (user.FCM) {
        await notificationService.sendCallMessage(
          "Call Ended",
          `Call duration: ${callDuration} minutes. Charges deducted.`,
          user.FCM,
          {
            type: "call_ended",
            sessionId: session._id.toString(),
            duration: callDuration.toString(),
            totalCharge: totalCharge.toString(),
          }
        );
      }
    }

    // OPTIONAL: End room on EnableX or other provider
    // Add user_ref if needed
    try {
      await endVideoRoom(session.videoRoomId, {
        user_ref: session.senderId.toString() // or receiverId depending on logic
      });
    } catch (apiError) {
      console.log("Failed to end video room:", apiError?.response?.data || apiError.message);
    }

    res.status(200).json({
      success: true,
      data: {
        duration: callDuration,
        totalCharge,
        sessionId: session._id,
        callerBalance: sender.points,
        receiverBalance: receiver.points,
      },
    });
  } catch (error) {
    console.log("Error on end call:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to end call" });
  }
}; */

const endCall = async (req, res) => {
  console.log(" ======================================== endCall ========================================= ");
  console.log("req.body: ", req.body);

  try {
    const { sessionId, duration, rating, feedback, roomId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    console.log("session: ", session);


    if (session.status !== "ongoing") {
      return res.status(400).json({ success: false, message: "Call is not ongoing" });
    }

    // Fetch astrologer info
    const astrologer = await Astrologer.findOne({ userId: session.astrologerId });
    if (!astrologer) {
      return res.status(404).json({ success: false, message: "Astrologer not found" });
    }

    // Calculate call duration and charges
    const callDuration = duration || Math.ceil((Date.now() - session.startTime) / 60000); // in minutes
    const totalCharge = callDuration * astrologer.callChargePerMinute;

    // Fetch client user to deduct balance
    const client = await User.findById(session.clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Check for sufficient balance
    if (client.wallet < totalCharge) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Deduct from client wallet
    client.wallet -= totalCharge;
    await client.save();

    // Update astrologer call count
    astrologer.callCount += 1;
    await astrologer.save();

    // Update session
    session.status = "completed";
    session.endTime = new Date();
    session.duration = callDuration;
    session.totalCharge = totalCharge;
    if (rating) session.rating = rating;
    if (feedback) session.feedback = feedback;
    await session.save();

    // Save call history
    const callhistory = await CallHistory.create({
      astrologerId: session.astrologerId,
      clientId: session.clientId,
      callStartTime: session.startTime,
      callEndTime: session.endTime,
      callDuration,
      callStatus: "completed",
      rating,
      comments: feedback,
    });

    console.log("CallHistory: ", callhistory);


    // Send FCM notifications
    const users = await User.find({ _id: { $in: [session.astrologerId, session.clientId] } });
    for (const user of users) {
      if (user.fcm) {
        const title = "Call Ended";
        const message = `Call duration: ${callDuration} minutes. Charges applied.`;

        await notificationService.sendCallMessage(title, message, user.fcm, {
          type: "call_ended",
          sessionId: sessionId.toString(),
          duration: callDuration.toString(),
          totalCharge: totalCharge.toString(),
        });
      }
    }
    console.log(" ======================================== end endCall end ========================================= ");
    return res.status(200).json({ success: true, data: { duration: callDuration, totalCharge, sessionId: session._id, clientBalance: client.wallet, }, });
  } catch (error) {
    console.error("Error in endCall:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to end call" });
  }
};



// Handle missed call
const handleMissedCall = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required", });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found", });
    }

    if (session.status !== "ongoing") {
      return res.status(400).json({ success: false, message: "Call is not ongoing", });
    }

    const astrologer = await Astrologer.findOne({
      userId: session.astrologerId,
    });

    // Update session
    session.status = "missed";
    session.endTime = new Date();
    await session.save();

    // Create call history record
    await CallHistory.create({
      astrologerId: session.astrologerId,
      clientId: session.clientId,
      callStartTime: session.startTime,
      callEndTime: session.endTime,
      callStatus: "missed",
    });

    astrologer.callCount = astrologer.callCount + 1;

    await astrologer.save()

    // Notify client about missed call
    const client = await User.findById(session.clientId);
    if (client?.fcm) {
      const title = "Missed Call";
      const message = "The astrologer was unavailable";
      await notificationService.sendCallMessage(title, message, client.fcm, { type: "missed_call", sessionId: sessionId.toString(), });
    }

    res.status(200).json({ success: true, message: "Missed call handled successfully", });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to handle missed call", });
  }
};

const acceptCall = async (req, res) => {
  console.log("============================= acceptCall =============================");
  const { sessionId, receiverId, roomId } = req.body;
  console.log("req.body: ", req.body);

  try {

    // Fetch session details
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found", });
    }

    // console.log("session: ", session);

    // Generate token for User 2
    /* const data = {
      name: req.user.firstName || "Guest",
      role: "participant",
      user_ref: receiverId?.toString(),
      roomId: roomId,
    }; */
    // Generate token for User 2
    const data = {
      name: req.user.firstName || "Guest",
      role: "moderator",
      user_ref: receiverId?.toString(),
      roomId: roomId,
    };
    console.log("data: ", data);

    const token = await creatToken(data);
    console.log("token: ", token);

    console.log("============================= end acceptCall end =============================");
    res.status(200).json({ success: true, data: { roomId, sessionId: session._id, token, }, });
  } catch (error) {
    console.error("Call acceptance error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to accept call", });
  }
};

module.exports = {
  initiateCall,
  acceptCall,
  endCall,
  handleMissedCall,
};
