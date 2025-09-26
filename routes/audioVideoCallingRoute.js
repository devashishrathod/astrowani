const express = require("express");
const router = express.Router();

const { getAllRomes, getRoomByName, creatToken, creatRoomId, creatMultiRoomId, } = require("../controllers/audioVideoController.js");

// Application Server Route Definitions - These functions communicate with EnableX Server API
// Route: To get liist of all Rooms in your Application
router.get("/get-all-rooms", getAllRomes);

// Application Server Route Definitions - These functions communicate with EnableX Server API
// Route: To get information of a given room.
router.get("/get-room/:roomName", getRoomByName);

// Route: To get Token for a Room
router.post("/create-token/", creatToken);

// Route: To create a Room (1to1)
router.post("/create-room", creatRoomId);

// Route: To create a Room (multiparty)
router.post("/room/multi/", creatMultiRoomId);

module.exports = router;
