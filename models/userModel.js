const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // required: [true, "Please provide an email"],
      // unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [
        function () {
          // Password is required only if the role is 'admin'
          return this.role === "admin";
        },
        "Password is required for admin users.",
      ],
      minlength: [6, "Password must be at least 6 characters long."],
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "astrologer"],
      default: "customer",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    maritalSatus: String,
    dateOfBirth: Date,
    timeOfBirth: Date,
    phoneNumber: String,
    profilePic: String,
    favoriteAstrologer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Astrologer",
      },
    ],
    address: {
      city: String,
      pinCode: Number,
      location: String,
      State: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    fcm: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    activePlan: {
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },
      startDate: Date,
      endDate: Date,
      remainingMessages: { type: Number, default: 0 },
      remainingSize: { type: Number, default: 0 }, // KB
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function (options = {}) {
  const { expiresIn, secret } = options;

  return jwt.sign({ id: this._id, role: this.role }, secret, { expiresIn });
};

module.exports = mongoose.model("User", UserSchema);
