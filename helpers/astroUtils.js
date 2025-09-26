// const MILLISECONDS_PER_DAY = 86400000;
// const J2000 = 2451545.0;
// const SHAKA_EPOCH = 78; // Shaka Samvat epoch starts in AD 78

// // Helper functions
// function toJulianDay(date) {
//   return date.getTime() / MILLISECONDS_PER_DAY + 2440587.5;
// }

// function fromJulianDay(jd) {
//   return new Date((jd - 2440587.5) * MILLISECONDS_PER_DAY);
// }

// function deg2rad(deg) {
//   return (deg * Math.PI) / 180;
// }

// function rad2deg(rad) {
//   return (rad * 180) / Math.PI;
// }

// function formatTime(date) {
//   return date.toTimeString().slice(0, 5);
// }

// // Calculate Shaka Samvat year
// function getShakaSamvatYear(date) {
//   const currentYear = date.getFullYear();
//   return currentYear - SHAKA_EPOCH;
// }

// // Simplified astronomical calculations
// function calculateSunPosition(jd) {
//   const T = (jd - J2000) / 36525;
//   const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
//   const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;
//   const e = 0.016708634 - 0.000042037 * T;
//   const C =
//     (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(deg2rad(M)) +
//     (0.019993 - 0.000101 * T) * Math.sin(deg2rad(2 * M));
//   const sunLongitude = (L0 + C) % 360;
//   return sunLongitude;
// }

// function calculateMoonPosition(jd) {
//   const T = (jd - J2000) / 36525;
//   const L0 = (134.96298 + 13.064993 * T) % 360;
//   const M = (357.52911 + 35999.05029 * T) % 360;
//   const moonLongitude = (L0 + 6.28875 * Math.sin(deg2rad(M))) % 360;
//   return moonLongitude;
// }

// // Calculate sunrise and sunset
// function calculateSunriseSunset(date, latitude, longitude) {
//   // Simplified calculation, actual calculation is more complex
//   const jd = toJulianDay(date);
//   const sunPos = calculateSunPosition(jd);
//   const hourAngle = rad2deg(
//     Math.acos(-Math.tan(deg2rad(latitude)) * Math.tan(deg2rad(sunPos)))
//   );
//   const sunrise = fromJulianDay(jd - (hourAngle / 360) * 24);
//   const sunset = fromJulianDay(jd + (hourAngle / 360) * 24);
//   return {
//     sunrise,
//     sunset,
//   };
// }

// // Calculate moonrise and moonset
// function calculateMoonriseMoonset(date, latitude, longitude) {
//   // Simplified calculation, actual calculation is more complex
//   const jd = toJulianDay(date);
//   const moonPos = calculateMoonPosition(jd);
//   const hourAngle = rad2deg(
//     Math.acos(-Math.tan(deg2rad(latitude)) * Math.tan(deg2rad(moonPos)))
//   );
//   const moonrise = fromJulianDay(jd - (hourAngle / 360) * 24);
//   const moonset = fromJulianDay(jd + (hourAngle / 360) * 24);
//   return {
//     moonrise,
//     moonset,
//   };
// }

// // Calculate lunar phase
// function calculateLunarPhase(jd) {
//   const sunPos = calculateSunPosition(jd);
//   const moonPos = calculateMoonPosition(jd);
//   const phase = (moonPos - sunPos + 360) % 360;
//   return phase / 360; // Returns a value between 0 and 1
// }

// // Calculate tithi
// function calculateTithi(sunLong, moonLong) {
//   const diff = (moonLong - sunLong + 360) % 360;
//   return Math.floor(diff / 12) + 1;
// }

// // Calculate nakshatra
// function calculateNakshatra(moonLong) {
//   return Math.floor(moonLong / 13.333333) + 1;
// }

// // Calculate yoga
// function calculateYoga(sunLong, moonLong) {
//   return (Math.floor((sunLong + moonLong) / 13.333333) % 27) + 1;
// }

// // Calculate karana
// function calculateKarana(sunLong, moonLong) {
//   const diff = (moonLong - sunLong + 360) % 360;
//   return (Math.floor(diff / 6) % 60) + 1;
// }

// // Calculate auspicious times
// function calculateAuspiciousTimes(date, latitude, longitude) {
//   const jd = toJulianDay(date);
//   const { sunrise, sunset } = calculateSunriseSunset(date, latitude, longitude);
//   const dayDuration = sunset - sunrise;
//   const muhurta = dayDuration / 30;
//   const abhijitStart = new Date(sunrise.getTime() + 23 * muhurta);
//   const abhijitEnd = new Date(sunrise.getTime() + 24 * muhurta);
//   const amritKalamStart = new Date(sunset.getTime() - 2 * 3600000);
//   const amritKalamEnd = new Date(sunset.getTime() - 48 * 60000);

//   return {
//     abhijitMuhurat: `${formatTime(abhijitStart)} - ${formatTime(abhijitEnd)}`,
//     amritKalam: `${formatTime(amritKalamStart)} - ${formatTime(amritKalamEnd)}`,
//   };
// }

// // Calculate inauspicious times
// function calculateInauspiciousTimes(date, latitude, longitude) {
//   const jd = toJulianDay(date);
//   const { sunrise, sunset } = calculateSunriseSunset(date, latitude, longitude);
//   const dayDuration = sunset - sunrise;
//   const muhurta = dayDuration / 8;
//   const rahukalam = new Date(sunrise.getTime() + dayOfWeek(date) * muhurta);
//   const yamaganda = new Date(
//     sunrise.getTime() + ((dayOfWeek(date) + 5) % 7) * muhurta
//   );
//   const gulikai = new Date(
//     sunrise.getTime() + ((dayOfWeek(date) + 6) % 8) * muhurta
//   );

//   return {
//     rahukalam: `${formatTime(rahukalam)} - ${formatTime(
//       new Date(rahukalam.getTime() + muhurta)
//     )}`,
//     yamaganda: `${formatTime(yamaganda)} - ${formatTime(
//       new Date(yamaganda.getTime() + muhurta)
//     )}`,
//     gulikai: `${formatTime(gulikai)} - ${formatTime(
//       new Date(gulikai.getTime() + muhurta)
//     )}`,
//   };
// }

// function dayOfWeek(date) {
//   return (date.getDay() + 1) % 7;
// }

// // Get zodiac sign
// function getZodiacSign(longitude) {
//   const signs = [
//     "Aries",
//     "Taurus",
//     "Gemini",
//     "Cancer",
//     "Leo",
//     "Virgo",
//     "Libra",
//     "Scorpio",
//     "Sagittarius",
//     "Capricorn",
//     "Aquarius",
//     "Pisces",
//   ];
//   return signs[Math.floor(longitude / 30)];
// }

// // Name mapping functions
// function getTithiName(tithiNumber) {
//   const tithis = [
//     "Pratipada",
//     "Dwitiya",
//     "Tritiya",
//     "Chaturthi",
//     "Panchami",
//     "Shashti",
//     "Saptami",
//     "Ashtami",
//     "Navami",
//     "Dashami",
//     "Ekadashi",
//     "Dwadashi",
//     "Trayodashi",
//     "Chaturdashi",
//     "Purnima",
//     "Amavasya",
//   ];
//   return tithis[(tithiNumber - 1) % 30] || "Unknown Tithi";
// }

// function getNakshatraName(nakshatraNumber) {
//   const nakshatras = [
//     "Ashwini",
//     "Bharani",
//     "Krittika",
//     "Rohini",
//     "Mrigashira",
//     "Ardra",
//     "Punarvasu",
//     "Pushya",
//     "Ashlesha",
//     "Magha",
//     "Purva Phalguni",
//     "Uttara Phalguni",
//     "Hasta",
//     "Chitra",
//     "Swati",
//     "Vishakha",
//     "Anuradha",
//     "Jyeshtha",
//     "Mula",
//     "Purva Ashadha",
//     "Uttara Ashadha",
//     "Shravana",
//     "Dhanishtha",
//     "Shatabhisha",
//     "Purva Bhadrapada",
//     "Uttara Bhadrapada",
//     "Revati",
//   ];
//   return nakshatras[nakshatraNumber - 1] || "Unknown Nakshatra";
// }

// function getYogaName(yogaNumber) {
//   const yogas = [
//     "Vishkumbha",
//     "Priti",
//     "Ayushman",
//     "Saubhagya",
//     "Shobhana",
//     "Atiganda",
//     "Sukarma",
//     "Dhriti",
//     "Shula",
//     "Ganda",
//     "Vriddhi",
//     "Dhruva",
//     "Vyaghata",
//     "Harshana",
//     "Vajra",
//     "Siddhi",
//     "Vyatipata",
//     "Variyan",
//     "Parigha",
//     "Shiva",
//     "Siddha",
//     "Sadhya",
//     "Shubha",
//     "Shukla",
//     "Brahma",
//     "Indra",
//     "Vaidhriti",
//   ];
//   return yogas[yogaNumber - 1] || "Unknown Yoga";
// }

// function getKaranaName(karanaNumber) {
//   const karanas = [
//     "Bava",
//     "Balava",
//     "Kaulava",
//     "Taitila",
//     "Gara",
//     "Vanija",
//     "Vishti",
//     "Shakuni",
//     "Chatushpada",
//     "Naga",
//     "Kimstughna",
//   ];
//   return karanas[(karanaNumber - 1) % 11] || "Unknown Karana";
// }

// // Main function to calculate daily panchang
// async function getPanchang(date, latitude, longitude) {
//   const jd = toJulianDay(date);

//   const sunPosition = calculateSunPosition(jd);
//   const moonPosition = calculateMoonPosition(jd);

//   const tithi = calculateTithi(sunPosition, moonPosition);
//   const nakshatra = calculateNakshatra(moonPosition);
//   const yoga = calculateYoga(sunPosition, moonPosition);
//   const karana = calculateKarana(sunPosition, moonPosition);

//   const { sunrise, sunset } = calculateSunriseSunset(date, latitude, longitude);
//   const { moonrise, moonset } = calculateMoonriseMoonset(
//     date,
//     latitude,
//     longitude
//   );

//   const auspiciousTimes = calculateAuspiciousTimes(date, latitude, longitude);
//   const inauspiciousTimes = calculateInauspiciousTimes(
//     date,
//     latitude,
//     longitude
//   );

//   return {
//     date: date.toISOString().split("T")[0],
//     location: { latitude, longitude },
//     panchang: {
//       tithi: getTithiName(tithi),
//       nakshatra: getNakshatraName(nakshatra),
//       yoga: getYogaName(yoga),
//       karana: getKaranaName(karana),
//     },
//     celestial: {
//       sunSign: getZodiacSign(sunPosition),
//       moonSign: getZodiacSign(moonPosition),
//       lunarMonth: getLunarMonth(tithi, moonPosition),
//       paksha: tithi <= 15 ? "Shukla" : "Krishna",
//     },
//     timings: {
//       sunrise: formatTime(sunrise),
//       sunset: formatTime(sunset),
//       moonrise: formatTime(moonrise),
//       moonset: formatTime(moonset),
//     },
//     auspiciousTimes,
//     inauspiciousTimes,
//     additionalInfo: {
//       shakaSamvat: `${getShakaSamvatYear(date)} Krodhi`,
//     },
//   };
// }

// // Helper function to get lunar month
// function getLunarMonth(tithi, moonLongitude) {
//   const months = [
//     "Chaitra",
//     "Vaishakha",
//     "Jyeshtha",
//     "Ashadha",
//     "Shravana",
//     "Bhadrapada",
//     "Ashwina",
//     "Kartika",
//     "Margashirsha",
//     "Pausha",
//     "Magha",
//     "Phalguna",
//   ];
//   const monthIndex = Math.floor(moonLongitude / 30);
//   return months[monthIndex];
// }

// module.exports = {
//   getPanchang,
//   getZodiacSign,
//   calculateLunarPhase,
// };
//===============================================================
const MILLISECONDS_PER_DAY = 86400000;
const J2000 = 2451545.0;
const SHAKA_EPOCH = 78; // Shaka Samvat epoch starts in AD 78

// Convert date to Julian Day
function toJulianDay(date) {
  return date.getTime() / MILLISECONDS_PER_DAY + 2440587.5;
}

// Convert Julian Day to Date
function fromJulianDay(jd) {
  return new Date((jd - 2440587.5) * MILLISECONDS_PER_DAY);
}

// Convert degrees to radians
function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

// Convert radians to degrees
function rad2deg(rad) {
  return (rad * 180) / Math.PI;
}

// Format time as HH:MM
function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}

// Calculate Shaka Samvat year
function getShakaSamvatYear(date) {
  const currentYear = date.getFullYear();
  return currentYear - SHAKA_EPOCH;
}

// Simplified astronomical calculations
function calculateSunPosition(jd) {
  const T = (jd - J2000) / 36525;
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360;
  const e = 0.016708634 - 0.000042037 * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(deg2rad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(deg2rad(2 * M));
  const sunLongitude = (L0 + C) % 360;
  return sunLongitude;
}

function calculateMoonPosition(jd) {
  const T = (jd - J2000) / 36525;
  const L0 = (134.96298 + 13.064993 * T) % 360;
  const M = (357.52911 + 35999.05029 * T) % 360;
  const moonLongitude = (L0 + 6.28875 * Math.sin(deg2rad(M))) % 360;
  return moonLongitude;
}

// Calculate sunrise and sunset
function calculateSunriseSunset(date, latitude, longitude) {
  // Simplified calculation, actual calculation is more complex
  const jd = toJulianDay(date);
  const sunPos = calculateSunPosition(jd);
  const hourAngle = rad2deg(
    Math.acos(-Math.tan(deg2rad(latitude)) * Math.tan(deg2rad(sunPos)))
  );
  const sunrise = fromJulianDay(jd - (hourAngle / 360) * 24);
  const sunset = fromJulianDay(jd + (hourAngle / 360) * 24);
  return {
    sunrise,
    sunset,
  };
}

// Calculate moonrise and moonset
function calculateMoonriseMoonset(date, latitude, longitude) {
  // Simplified calculation, actual calculation is more complex
  const jd = toJulianDay(date);
  const moonPos = calculateMoonPosition(jd);
  const hourAngle = rad2deg(
    Math.acos(-Math.tan(deg2rad(latitude)) * Math.tan(deg2rad(moonPos)))
  );
  const moonrise = fromJulianDay(jd - (hourAngle / 360) * 24);
  const moonset = fromJulianDay(jd + (hourAngle / 360) * 24);
  return {
    moonrise,
    moonset,
  };
}

// Calculate lunar phase
function calculateLunarPhase(jd) {
  const sunPos = calculateSunPosition(jd);
  const moonPos = calculateMoonPosition(jd);
  const phase = (moonPos - sunPos + 360) % 360;
  return phase / 360; // Returns a value between 0 and 1
}

// Calculate tithi
function calculateTithi(sunLong, moonLong) {
  const diff = (moonLong - sunLong + 360) % 360;
  return Math.floor(diff / 12) + 1;
}

// Calculate nakshatra
function calculateNakshatra(moonLong) {
  return Math.floor(moonLong / 13.333333) + 1;
}

// Calculate yoga
function calculateYoga(sunLong, moonLong) {
  return (Math.floor((sunLong + moonLong) / 13.333333) % 27) + 1;
}

// Calculate karana
function calculateKarana(sunLong, moonLong) {
  const diff = (moonLong - sunLong + 360) % 360;
  return (Math.floor(diff / 6) % 11) + 1;
}

// Calculate auspicious times
function calculateAuspiciousTimes(date, latitude, longitude) {
  const jd = toJulianDay(date);
  const { sunrise, sunset } = calculateSunriseSunset(date, latitude, longitude);
  const dayDuration = sunset - sunrise;
  const muhurta = dayDuration / 30;
  const abhijitStart = new Date(sunrise.getTime() + 23 * muhurta);
  const abhijitEnd = new Date(sunrise.getTime() + 24 * muhurta);
  const amritKalamStart = new Date(sunset.getTime() - 2 * 3600000);
  const amritKalamEnd = new Date(sunset.getTime() - 48 * 60000);

  return {
    abhijitMuhurat: `${formatTime(abhijitStart)} - ${formatTime(abhijitEnd)}`,
    amritKalam: `${formatTime(amritKalamStart)} - ${formatTime(amritKalamEnd)}`,
  };
}

// Calculate inauspicious times
function calculateInauspiciousTimes(date, latitude, longitude) {
  const jd = toJulianDay(date);
  const { sunrise, sunset } = calculateSunriseSunset(date, latitude, longitude);
  const dayDuration = sunset - sunrise;
  const muhurta = dayDuration / 8;
  const rahukalam = new Date(sunrise.getTime() + dayOfWeek(date) * muhurta);
  const yamaganda = new Date(
    sunrise.getTime() + ((dayOfWeek(date) + 5) % 7) * muhurta
  );
  const gulikai = new Date(
    sunrise.getTime() + ((dayOfWeek(date) + 6) % 8) * muhurta
  );

  return {
    rahukalam: `${formatTime(rahukalam)} - ${formatTime(
      new Date(rahukalam.getTime() + muhurta)
    )}`,
    yamaganda: `${formatTime(yamaganda)} - ${formatTime(
      new Date(yamaganda.getTime() + muhurta)
    )}`,
    gulikai: `${formatTime(gulikai)} - ${formatTime(
      new Date(gulikai.getTime() + muhurta)
    )}`,
    varjyamKalam: "", // Placeholder, calculation needed
    durMuhurtam: "", // Placeholder, calculation needed
    gulikaiKalam: "", // Placeholder, calculation needed
  };
}

function dayOfWeek(date) {
  return (date.getDay() + 1) % 7;
}

// Get zodiac sign
function getZodiacSign(longitude) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return signs[Math.floor(longitude / 30)];
}

// Name mapping functions
function getTithiName(tithiNumber) {
  const tithis = [
    "Pratipada",
    "Dwitiya",
    "Tritiya",
    "Chaturthi",
    "Panchami",
    "Shashti",
    "Saptami",
    "Ashtami",
    "Navami",
    "Dashami",
    "Ekadashi",
    "Dwadashi",
    "Trayodashi",
    "Chaturdashi",
    "Purnima",
    "Amavasya",
  ];
  return tithis[(tithiNumber - 1) % 30] || "Unknown Tithi";
}

function getNakshatraName(nakshatraNumber) {
  const nakshatras = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
  ];
  return nakshatras[(nakshatraNumber - 1) % 27] || "Unknown Nakshatra";
}

function getYogaName(yogaNumber) {
  const yogas = [
    "Vishkumbh",
    "Preeti",
    "Ayushman",
    "Saubhagya",
    "Sukarma",
    "Dhruti",
    "Shoola",
    "Ganda",
    "Vridhhi",
    "Dhriti",
    "Shukla",
    "Shukra",
    "Chara",
    "Shula",
    "Chara",
    "Vishkumbh",
    "Preeti",
    "Ayushman",
    "Saubhagya",
    "Sukarma",
    "Dhruti",
    "Shoola",
    "Ganda",
    "Vridhhi",
    "Dhriti",
    "Shukla",
    "Shukra",
  ];
  return yogas[(yogaNumber - 1) % 27] || "Unknown Yoga";
}

function getKaranaName(karanaNumber) {
  const karanas = [
    "Bava",
    "Balava",
    "Kaulava",
    "Taitila",
    "Garaja",
    "Vanija",
    "Vishti",
    "Shakuni",
    "Chatushpad",
    "Naga",
    "Kshaya",
    "Aadya",
    "Adhika",
  ];
  return karanas[(karanaNumber - 1) % 11] || "Unknown Karana";
}

/**
 * Convert a 24-hour time format to a 12-hour format with AM/PM.
 * @param {string} time24 - Time in 24-hour format (e.g., "18:01").
 * @returns {string} Time in 12-hour format (e.g., "6:01 PM").
 */
// Convert 24-hour time to 12-hour time with AM/PM
const convertTo12HourFormat = (time) => {
  if (!time) return "Not Available"; // Handle undefined or null time values

  const [hours, minutes] = time.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) return "Invalid Time";

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12; // Convert hour to 12-hour format
  return `${hour12}:${minutes < 10 ? "0" : ""}${minutes} ${period}`;
};

/**
 * Format Panchang data with 12-hour time format.
 * @param {Object} panchang - Panchang data object.
 * @returns {Object} Formatted Panchang data with 12-hour time format.
 */
function formatPanchangWith12HourTimes(panchang) {
  return {
    ...panchang,
    sunrise: convertTo12HourFormat(panchang.sunrise),
    sunset: convertTo12HourFormat(panchang.sunset),
    moonrise: convertTo12HourFormat(panchang.moonrise),
    moonset: convertTo12HourFormat(panchang.moonset),
    auspiciousTimes: {
      abhijitMuhurat: panchang.auspiciousTimes.abhijitMuhurat
        .split(" - ")
        .map(convertTo12HourFormat)
        .join(" - "),
      amritKalam: panchang.auspiciousTimes.amritKalam
        .split(" - ")
        .map(convertTo12HourFormat)
        .join(" - "),
    },
    inauspiciousTimes: {
      rahukalam: panchang.inauspiciousTimes.rahukalam
        .split(" - ")
        .map(convertTo12HourFormat)
        .join(" - "),
      yamaganda: panchang.inauspiciousTimes.yamaganda
        .split(" - ")
        .map(convertTo12HourFormat)
        .join(" - "),
      gulikai: panchang.inauspiciousTimes.gulikai
        .split(" - ")
        .map(convertTo12HourFormat)
        .join(" - "),
      varjyamKalam: panchang.inauspiciousTimes.varjyamKalam
        ? panchang.inauspiciousTimes.varjyamKalam
            .split(" - ")
            .map(convertTo12HourFormat)
            .join(" - ")
        : "",
      durMuhurtam: panchang.inauspiciousTimes.durMuhurtam
        ? panchang.inauspiciousTimes.durMuhurtam
            .split(" - ")
            .map(convertTo12HourFormat)
            .join(" - ")
        : "",
      gulikaiKalam: panchang.inauspiciousTimes.gulikaiKalam
        ? panchang.inauspiciousTimes.gulikaiKalam
            .split(" - ")
            .map(convertTo12HourFormat)
            .join(" - ")
        : "",
    },
  };
}

module.exports = {};

module.exports = {
  toJulianDay,
  fromJulianDay,
  deg2rad,
  rad2deg,
  formatTime,
  getShakaSamvatYear,
  calculateSunPosition,
  calculateMoonPosition,
  calculateSunriseSunset,
  calculateMoonriseMoonset,
  calculateLunarPhase,
  calculateTithi,
  calculateNakshatra,
  calculateYoga,
  calculateKarana,
  calculateAuspiciousTimes,
  calculateInauspiciousTimes,
  getZodiacSign,
  getTithiName,
  getNakshatraName,
  getYogaName,
  getKaranaName,
  convertTo12HourFormat,
  formatPanchangWith12HourTimes,
};
