const express = require("express");
const { createCallHistory, getCallHistory, updateCallHistory, deleteCallHistory, getCallHistoryByAstroId, getCallHistoryTOekn, } = require("../controllers/callHistoryController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { initiateCall, endCall, handleMissedCall, acceptCall, } = require("../helpers/callHandlers");

const router = express.Router();

router.post("/initiate", protect, initiateCall);
router.post("/accept-call", protect, acceptCall);
router.post("/end", protect, endCall);
router.post("/missed", protect, handleMissedCall);

router.use(protect);

router.get("/callHistoryByAstroId", protect, authorize("astrologer"), getCallHistoryTOekn)
router.get("/callHistoryByAstroId/:id", getCallHistoryByAstroId)

router.route("/call-history").post(createCallHistory) // POST: Create call history
  .get(getCallHistory); // GET: Get call history

router.route("/call-history/:id").put(updateCallHistory) // PUT: Update call history
  .delete(deleteCallHistory); // DELETE: Delete call history

module.exports = router;
