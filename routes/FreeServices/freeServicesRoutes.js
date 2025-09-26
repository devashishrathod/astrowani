const express = require("express");
const router = express.Router();
const prokeralaRoutes = require("./prokeralaRoutes");

// Use Panchang and Horoscope routes
router.use("/", prokeralaRoutes);

module.exports = router;
