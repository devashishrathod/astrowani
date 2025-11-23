const express = require("express");
const ngrok = require("ngrok");
const cors = require("cors");
const morgan = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const msg91 = require("msg91").default;
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4500;
const connectDB = require("./config/dbConnection.js");
const userModel = require("./models/userModel.js");
const Chat = require("./models/chatModel.js");

const userRoutes = require("./routes/userRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");
const astrologerRoutes = require("./routes/astrologerRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const supportRoutes = require("./routes/supportRoutes.js");
const callHistoryRoutes = require("./routes/callHistoryRoutes.js");
const favoriteAstrologerRoutes = require("./routes/favoriteAstrologerRoutes");
const vendorRoutes = require("./routes/vendorRoutes.js");
const sessionRoutes = require("./routes/sessionRoutes.js");
const appointmentRoutes = require("./routes/appointmentRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const walletRoutes = require("./routes/walletRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes");
const thoughtRoutes = require("./routes/thoughtRoutes.js");
const plansRoutes = require("./routes/plansRoutes");
const bannerRoutes = require("./routes/bannerRoutes.js");
const navgrahRoutes = require("./routes/navgrahRoutes.js");
const horoscopeRoutes = require("./routes/horoscopeRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const feedbackRoutes = require("./routes/feedbackRoutes.js");
const astrologerRequestRoutes = require("./routes/astrologerRequestRoutes.js");
const freeServicesRoutes = require("./routes/FreeServices/freeServicesRoutes.js");
const astroServicesRoutes = require("./routes/astroServices/astroServicesRoutes.js");
const audioVidedoCallingRoutes = require("./routes/audioVideoCallingRoute.js");
const enquiryRouter = require("./routes/enquiry.js");

const { socketAuthenticator } = require("./middleware/authMiddleware.js");
const log = require("./utils/logger/logger.js").logger;
const logger = log.getLogger("AppApi");

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
connectDB();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/astrologers", astrologerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favoriteAstrologer", favoriteAstrologerRoutes);
app.use("/api/free-services", freeServicesRoutes);
app.use("/api/astro-services", astroServicesRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/call", callHistoryRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/thoughts", thoughtRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/navgrah", navgrahRoutes);
app.use("/api/horoscopes", horoscopeRoutes);
app.use("/api/astrologer-requests", astrologerRequestRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/audiovideo", audioVidedoCallingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

app.get("/", async (req, res) => {
  res.send("WELCOME TO ASTROWANI SERVER🚀❤️");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `PORT ${PORT}`;
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = httpServer.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

logger.info(`Server started. Listening on Port ${PORT}`);
httpServer.on("error", onError);
httpServer.on("listening", onListening);

app.use(express.urlencoded({ extended: true }));

io.use((socket, next) => {
  socketAuthenticator(socket, next);
});

const generateRoomId = (user1, user2) => {
  return [user1, user2].sort().join("_");
};

msg91.initialize({ authKey: process.env.MSG91_AUTHKEY });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join_room", async (recipient) => {
    const userId = socket.user._id;
    console.log(userId, recipient, "rommmm Id");
    const roomId = generateRoomId(userId, recipient.receiverId);
    console.log("roomId: ", roomId);
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined users room-id ${roomId}`);
    // Fetch the user's role and details (assuming socket.user is set via authentication middleware)
    // const user = await userModel.findById(socket.user._id);
    // if (user) {
    //   if (user.role === "customer" || user.role === "user") {
    //     // Send Welcome Message
    //     const welcomeMessage = {
    //       sender: "System", // Can be replaced with a system bot ID or astrologer's ID
    //       message:
    //         "Welcome to Astrowani India! Our expert astrologers are here to guide you through the planets and nakshatras.",
    //       hindiMessage:
    //         "एस्ट्रो में आपका स्वागत है! हमारे विशेषज्ञ ज्योतिषी आपको ग्रहों व नक्षत्रों के माध्यम से मार्गदर्शन करने के लिए तैयार हैं।",
    //     };
    //     socket.to(roomId).emit("receiveMessage", welcomeMessage);
    //   }
    // }
  });
  socket.on("sendMessage", async ({ roomId, sessionId, receiver, message }) => {
    console.log("roomId: ", roomId);
    console.log("sessionId: ", sessionId);
    console.log("receiver: ", receiver);
    console.log("message: ", message);
    try {
      if (!receiver || !message) {
        console.log("rec chek");
        return socket.emit("error", { message: "Invalid receiver or message" });
      }
      const sender = await userModel
        .findById(socket.user._id)
        .populate("activePlan.planId");
      console.log("sen chek", sender);
      if (!sender) {
        return socket.emit("error", { message: "User not found" });
      }
      let userId = socket?.user?._id;
      console.log("old user", userId);
      if (sender.role === "customer") {
        if (!sender.activePlan || !sender.activePlan.planId) {
          console.log("plan errro");
          return socket.emit("error", {
            message:
              "No active plan found. Please purchase a plan to initiate chat.",
          });
        }
        const { remainingMessages } = sender.activePlan;
        console.log(
          "remamm",
          remainingMessages,
          sender.activePlan,
          sender.activePlan.remainingMessages
        );
        if (remainingMessages <= 0) {
          console.log("messssss error");
          return socket.emit("error", {
            message: "Your plan limit is exhausted. Please upgrade your plan.",
          });
        }
        sender.activePlan.remainingMessages -= 1;
        await sender.save();
      }
      console.log("now done", userId);
      let chat = await Chat.create({
        sessionId: sessionId,
        sender: userId,
        receiver: receiver,
        message: message,
      });
      console.log("chat", chat, "Yeh h chat mere bhai chat ki hai humne");
      socket.to(roomId).emit("receiveMessage", chat);
      // const sessionMessages = await Chat.countDocuments({ sessionId });
      // if (sessionMessages === 1 || sessionMessages % 5 === 0) {
      //   const thankYouMessage = {
      //     sender: "System",
      //     message:
      //       "Thank you for trusting us! We hope our astrology services have brought positivity and clarity to your life. Wishing you a brighter future!",
      //     hindiMessage:
      //       "हम पर विश्वास करने के लिए धन्यवाद! हमें आशा है कि हमारी ज्योतिष सेवाएं आपके जीवन में सकारात्मकता और स्पष्टता लाएंगी। आपका भविष्य उज्ज्वल हो!",
      //   };
      //   socket.to(roomId).emit("receiveMessage", thankYouMessage);
      // }
    } catch (error) {
      console.error("Error saving chat message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const handlePaymentCallback = async (req, res) => {
  try {
    const { merchantId, merchantTransactionId, transactionId } = req.body;
    console.log("Received payment callback:", req.body);
    if (merchantId !== process.env.MERCHANT_ID) {
      console.error("Invalid merchant ID:", merchantId);
      return res.status(400).json({ message: "Invalid merchant ID" });
    }
    const appointment = await Appointment.findById(merchantTransactionId);
    if (!appointment) {
      console.error("Appointment not found:", merchantTransactionId);
      return res.status(404).json({ message: "Appointment not found" });
    }
    const convertedId = `MID${merchantTransactionId}`;
    const checkStatusResponse = await checkPaymentStatus(
      merchantId,
      convertedId,
      appointment.createdBy.mobile
    );
    if (checkStatusResponse.success) {
      appointment.paymentStatus = checkStatusResponse.code;
      appointment.transactionId = transactionId;
      await appointment.save();
      res.json({ status: appointment.paymentStatus });
    } else {
      console.error("Payment verification failed:", checkStatusResponse);
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
};

const checkPaymentStatus = async (
  merchantId,
  merchantTransactionId,
  mobileNumber
) => {
  const saltKey = process.env.SALT_KEY;
  const saltIndex = process.env.SALT_INDEX;
  const endpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
  const stringToHash = `${endpoint}${saltKey}${mobileNumber}`;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const xVerify = `${sha256}###${saltIndex}`;
  try {
    const response = await axios.get(
      `https://api-preprod.phonepe.com/apis/pg-sandbox${endpoint}`,
      // `https://api.phonepe.com/apis/hermes/${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": merchantId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error checking payment status:",
      error.response?.data || error.message
    );
    throw new Error("Failed to check payment status with PhonePe");
  }
};

app.post("/api/payment-callback", handlePaymentCallback);

httpServer.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  if (process.env.ENABLE_NGROK === "true") {
    const url = await ngrok.connect({
      addr: PORT,
      authtoken: process.env.NGROK_AUTH_TOKEN,
      // subdomain: process.env.NGROK_SUBDOMAIN // must be set for custom subdomain
    });
    console.log(`Public URL: ${url}`);
  }
});
