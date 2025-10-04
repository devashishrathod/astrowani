const express = require("express");
const {
  createCallHistory,
  getCallHistory,
  updateCallHistory,
  deleteCallHistory,
  getCallHistoryByAstroId,
  getCallHistoryTOekn,
} = require("../controllers/callHistoryController");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  initiateCall,
  endCall,
  handleMissedCall,
  acceptCall,
} = require("../helpers/callHandlers");

const router = express.Router();

router.post("/initiate", protect, initiateCall);
router.post("/accept-call", protect, acceptCall);
router.post("/end", protect, endCall);
router.post("/missed", protect, handleMissedCall);

router.use(protect);

router.get(
  "/callHistoryByAstroId",
  protect,
  authorize("astrologer"),
  getCallHistoryTOekn
);
router.get("/callHistoryByAstroId/:id", getCallHistoryByAstroId);

router.route("/call-history").post(createCallHistory).get(getCallHistory);

router
  .route("/call-history/:id")
  .put(updateCallHistory)
  .delete(deleteCallHistory);
module.exports = router;
