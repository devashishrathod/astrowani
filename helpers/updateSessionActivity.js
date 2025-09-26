const User = require("../models/userModel");
const Session = require("../models/sessionModel");

exports.updateSessionActivity = async (sessionId, userId, messageSize) => {
  const session = await Session.findById(sessionId);
  const user = await User.findById(userId);

  if (!session || !user) return { success: false };

  // Update session usage
  session.totalMessages += 1;
  session.totalSize += messageSize;

  // Update user active plan
  user.activePlan.remainingMessages -= 1;
  user.activePlan.remainingSize -= messageSize;

  // Check if plan exceeded
  if (
    user.activePlan.remainingMessages <= 0 ||
    user.activePlan.remainingSize < 0
  ) {
    session.isPlanExceeded = true;
  }

  await session.save();
  await user.save();

  return { success: true, isPlanExceeded: session.isPlanExceeded };
};
