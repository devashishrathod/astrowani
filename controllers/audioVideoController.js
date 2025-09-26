const vcxroom = require("../enablex/vxroom");

const getAllRomes = (req, res) => {
  try {
    vcxroom.getAllRooms((data) => {
      res.status(200).send(data);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error getting all rooms" });
  }
};

const getRoomByName = (req, res) => {
  const { roomName } = req.params;
  try {
    vcxroom.getRoom(roomName, (status, data) => { res.status(200).send(data); });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error getting room info" });
  }
};

const creatToken = (req, res) => {
  try {
    const { type, userId, counselorId, serviceType, ...rest } = req.body;
    console.log(rest, req.body);
    vcxroom.getToken(rest, async (status, data) => {
      console.log(data, "token data");
      res.status(200).send(data);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const creatRoomId = (req, res) => {
  const { condition } = req.body;

  // const roomObj = {
  //   name: `room for one-to-one ${
  //     condition ? "voice Calling" : "video meeting"
  //   }`,
  //   owner_ref: "github sample",
  //   settings: {
  //     description: `${condition ? "Voice-Calling" : "Video-Conferencing"}`,
  //     scheduled: false,
  //     adhoc: true,
  //     participants: "2", // Default to 2 participants
  //     duration: "120", // Default to 30 minutes
  //     quality: "SD",
  //     auto_recording: false,
  //     audio_only: condition, //for true only audio and false so video
  //   },
  // };

  /* const newRoomObjec = {
    name: "Demo Room",
    settings: {
      description: `${condition ? "Voice-Calling" : "Video-Conferencing"}`,
      scheduled: false,
      participants: "10",
      duration: "90",
      active_talker: true,
      auto_recording: false,
      adhoc: true,
      mode: "group",
      moderators: "4",
      quality: "SD",
      media_zone: "IN",
      knock: false,
      canvas: true,
      max_active_talkers: "6",
      screen_share: true,
      // audio_only: condition, //for true only audio and false so video
      abwd: true,
    },
    sip: {
      enabled: false,
    },
    data: {
      name: "Demo",
    },
    owner_ref: "Demo",
  }; */
  try {
    const newRoomObjec = {
      name: "Demo Room",
      settings: {
        description: `${condition ? "Voice-Calling" : "Video-Conferencing"}`,
        scheduled: false,
        participants: "10",
        duration: "90",
        active_talker: true,
        auto_recording: false,
        adhoc: true,
        mode: "group",
        moderators: "4",
        quality: "SD",
        media_zone: "IN",
        knock: false,
        canvas: true,
        max_active_talkers: "6",
        screen_share: true,
        // audio_only: condition, //for true only audio and false so video
        abwd: true,
      },
      sip: {
        enabled: false,
      },
      data: {
        name: "Demo",
      },
      owner_ref: "Demo",
    };
    vcxroom.createRoom(newRoomObjec, (status, data) => {
      console.log(" ================================= createRoom ================================= ");
      console.log("status: ", status);
      console.log("data: ", data);

      console.log(data, data?.room?.room_id);

      res.status(200).send(data);
    });
  } catch (error) {
    console.error("error on createRoomId: ", error);
    res.status(500).json({ success: false, message: "Error creating room" });
  }
};

const creatMultiRoomId = (req, res) => {
  try {
    vcxroom.createRoomMulti((status, data) => {
      res.status(200).send(data);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating Multi room" });
  }
};

module.exports = {
  getAllRomes,
  getRoomByName,
  creatToken,
  creatRoomId,
  creatMultiRoomId,
};
