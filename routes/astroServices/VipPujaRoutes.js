const express = require("express");
const {
  getAllVipPujas,
  getVipPujaById,
  createVipPuja,
  updateVipPuja,
  deleteVipPuja,
} = require("../../controllers/astroServices/vipPujaController");

const router = express.Router();

// Route to get all VIP Pujas
router.get("/vip-pujas", getAllVipPujas);

// Route to get a specific VIP Puja by ID
router.get("/vip-pujas/:id", getVipPujaById);

// Route to create a new VIP Puja
router.post("/vip-pujas", createVipPuja);

// Route to update a VIP Puja by ID
router.put("/vip-pujas/:id", updateVipPuja);

// Route to delete a VIP Puja by ID
router.delete("/vip-pujas/:id", deleteVipPuja);

module.exports = router;
