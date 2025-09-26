// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config/config");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log("1");
  console.log("token: ", token);

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }
  try {
    // console.log(token);

    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log("decoded: ", decoded);
    // console.log("Token issued at:", new Date(decoded.iat * 1000).toISOString());
    // console.log(
    //   "Token expires at:",
    //   new Date(decoded.exp * 1000).toISOString()
    // );
    req.user = await User.findById(decoded.id);
    // console.log("req.user: ", req.user);

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized to access this route", });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized to access this route" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user.role);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "User role is not authorized to access this route", });
    }
    next();
  };
};

exports.socketAuthenticator = async (socket, next) => {
  try {
    // console.log(" =================== socketAuthenticator =================== ");
    // console.log("socket.handshake.headers: ", socket.handshake);


    // Get the token from socket handshake auth
    // const token = socket.handshake.headers.auth?.split(' ')[1];
    const token = socket.handshake.auth.token;

    // console.log("token: ", token);
    const postToken = socket.handshake.headers.auth
    console.log("postToken: ", postToken);

    /*  if (!token) {
       return next(new Error('Authentication error: No token provided'));
     } */

    // Verify the token
    // const decoded = jwt.verify(token, config.JWT_SECRET);
    const decoded = jwt.verify(token || postToken, config.JWT_SECRET);
    // console.log("decoded: ", decoded);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach the user to the socket
    socket.user = user;

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return next(new Error('Authentication error: Invalid token'));
    }

    if (error.name === 'TokenExpiredError') {
      return next(new Error('Authentication error: Token expired'));
    }

    return next(new Error('Authentication error'));
  }
};