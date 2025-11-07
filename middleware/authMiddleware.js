const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config/config");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log("token: ", token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log("decoded: ", decoded);
    req.user = await User.findById(decoded.id);
    console.log("req.user: ", req.user);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "User role is not authorized to access this route",
      });
    }
    next();
  };
};

exports.socketAuthenticator = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const postToken = socket.handshake.headers.auth;
    console.log("postToken: ", postToken);
    /*  if (!token) {
       return next(new Error('Authentication error: No token provided'));
     } */
    const decoded = jwt.verify(token || postToken, config.JWT_SECRET);
    console.log("decoded token user: ", decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }
    socket.user = user;
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    if (error.name === "JsonWebTokenError") {
      return next(new Error("Authentication error: Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new Error("Authentication error: Token expired"));
    }
    return next(new Error("Authentication error"));
  }
};
