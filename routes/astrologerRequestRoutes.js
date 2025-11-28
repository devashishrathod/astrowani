const express = require("express");
const router = express.Router();
const astrologerRequestController = require("../controllers/astrologerRequestController");

router.post("/", astrologerRequestController.createRequest);
router.get("/", astrologerRequestController.getAllRequests);
router.get("/:id", astrologerRequestController.getRequestById);
router.put("/:id", astrologerRequestController.updateRequest);
router.delete("/:id", astrologerRequestController.deleteRequest);

module.exports = router;
