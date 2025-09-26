// routes/prokeralaRoutes.js
const express = require("express");
const router = express.Router();
const prokeralaController = require("../../controllers/FreeServices/prokeralaController");

// Today's Panchang
router.post("/panchang", prokeralaController.getTodaysPanchang);

// Janam Kundali (Birth Chart)
router.post("/janam-kundali", prokeralaController.getJanamKundali);

// Kundali Match
router.post("/kundali-match", prokeralaController.getKundaliMatch);

// Shubh Muhurat
// router.post("/shubh-muhurat", prokeralaController.getShubhMuhurat);
// Routes for each astrology API 
router.post("/shubh-muhurat/choghadiya", prokeralaController.getChoghadiya);
router.post("/shubh-muhurat/hora-timing", prokeralaController.getHoraTiming);
router.post("/shubh-muhurat/gowri-nalla-neram", prokeralaController.getGowriNallaNeram);
router.post("/shubh-muhurat/rahu-kaal", prokeralaController.getRahuKaal);

// Vrat and Upvaas 
router.post("/vrat-upvaas", prokeralaController.getVratUpvaas);

// Horoscope for a specific zodiac sign
router.post("/horoscope", prokeralaController.getDailyHoroscope);

module.exports = router;
