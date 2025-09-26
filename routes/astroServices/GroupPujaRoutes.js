const express = require("express");
const router = express.Router();
const groupPujaController = require("../../controllers/astroServices/groupPujaController");

router.get("/pujas", groupPujaController.getAllGroupPujas);
router.post("/pujas", groupPujaController.createGroupPuja);
router.put("/pujas/:id", groupPujaController.updateGroupPuja);
router.delete("/pujas/:id", groupPujaController.deleteGroupPuja);

module.exports = router;
