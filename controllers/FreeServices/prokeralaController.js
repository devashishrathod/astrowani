// const axios = require("axios");
// const { getAccessToken } = require("../../helpers/accessToken");

// exports.getTodaysPanchang = async (req, res) => {
//   try {
//     const accessToken = await getAccessToken();
//     const { latitude, longitude, ayanamsa, language } = req.query;

//     if (!latitude || !longitude || !ayanamsa) {
//       return res
//         .status(400)
//         .json({ message: "Latitude, longitude, and ayanamsa are required" });
//     }

//     const datetime = new Date().toISOString();

//     const url = `https://api.prokerala.com/v2/astrology/panchang/advanced`;
//     const response = await axios.get(url, {
//       params: {
//         ayanamsa,
//         coordinates: `${latitude},${longitude}`,
//         datetime,
//         la: language,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching today's Panchang:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getJanamKundali = async (req, res) => {
//   try {
//     const accessToken = await getAccessToken();
//     const { latitude, longitude, ayanamsa, language } = req.query;

//     if (!latitude || !longitude || !ayanamsa) {
//       return res
//         .status(400)
//         .json({ message: "Latitude, longitude, and ayanamsa are required" });
//     }

//     const url = `https://api.prokerala.com/v2/astrology/kundli`;
//     const datetime = new Date().toISOString();

//     const response = await axios.get(url, {
//       params: {
//         ayanamsa,
//         coordinates: `${latitude},${longitude}`,
//         datetime,
//         la: language,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching Janam Kundali:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getKundaliMatch = async (req, res) => {
//   try {
//     const accessToken = await getAccessToken();
//     const { maleDetails, femaleDetails } = req.body;

//     const url = `https://api.prokerala.com/v2/astrology/kundli-matching/advanced`;

//     const response = await axios.get(url, {
//       params: {
//         ayanamsa: 1, // Assuming Lahiri, adjust as needed
//         boy_coordinates: `${maleDetails.location.latitude},${maleDetails.location.longitude}`,
//         boy_dob: `${maleDetails.date}T${maleDetails.time}:00Z`,
//         girl_coordinates: `${femaleDetails.location.latitude},${femaleDetails.location.longitude}`,
//         girl_dob: `${femaleDetails.date}T${femaleDetails.time}:00Z`,
//         la: "en", // Language, adjust as needed (optional)
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching Kundali Match:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getShubhMuhurat = async (req, res) => {
//   try {
//     const accessToken = await getAccessToken();
//     const { date, location } = req.body;

//     if (!location || !location.latitude || !location.longitude || !date) {
//       return res.status(400).json({
//         message: "Location (latitude, longitude) and date are required",
//       });
//     }

//     const datetime = `${date}T00:00:00Z`; // ISO 8601 date format
//     const coordinates = `${location.latitude},${location.longitude}`;

//     // Base URL for Prokerala API
//     const baseUrl = `https://api.prokerala.com/v2/astrology`;

//     // Define all the endpoints we will be calling
//     const endpoints = [
//       `${baseUrl}/choghadiya`,
//       `${baseUrl}/hora`,
//       `${baseUrl}/gowri-nalla-neram`,
//       `${baseUrl}/inauspicious-period`,
//     ];

//     // Fetch data from all endpoints concurrently using Promise.all
//     const [
//       choghadiyaResponse,
//       horaResponse,
//       gowriNallaResponse,
//       rahuKaalResponse,
//     ] = await Promise.all(
//       endpoints.map((endpoint) =>
//         axios.get(endpoint, {
//           params: {
//             ayanamsa: 1, // Lahiri ayanamsa (can adjust as needed)
//             coordinates: coordinates,
//             datetime: datetime,
//             la: "en", // Optional language parameter, set to 'en' (English)
//           },
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         })
//       )
//     );

//     // Combine the results into a single response
//     const responseData = {
//       choghadiya: choghadiyaResponse.data,
//       horaTiming: horaResponse.data,
//       gowriNallaNeram: gowriNallaResponse.data,
//       rahuKaal: rahuKaalResponse.data,
//     };

//     res.json(responseData);
//   } catch (error) {
//     console.error("Error fetching Shubh Muhurat details:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getVratUpvaas = async (req, res) => {
//   try {
//     const accessToken = await getAccessToken();
//     const { year, month } = req.query;

//     const url = `https://api.prokerala.com/v2/astrology/vrat-upvaas`;

//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       params: {
//         year: year,
//         month: month,
//       },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching Vrat and Upvaas:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.getDailyHoroscope = async (req, res) => {
//   try {
//     const accessToken = await getAccessToken();
//     const { sign } = req.query; // Expecting datetime and sign in the query parameters

//     const datetime = new Date().toISOString();

//     if (!datetime || !sign) {
//       return res
//         .status(400)
//         .json({ message: "Datetime and sign are required" });
//     }

//     // Base URL for Prokerala API
//     const baseUrl = `https://api.prokerala.com/v2/horoscope/daily`;

//     // Fetch daily horoscope data
//     const horoscopeResponse = await axios.get(baseUrl, {
//       params: {
//         datetime,
//         sign: sign.toLowerCase(),
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     // Check if the response status is OK
//     if (horoscopeResponse.status === 200) {
//       res.json(horoscopeResponse.data);
//     } else {
//       res
//         .status(horoscopeResponse.status)
//         .json({ message: "Failed to fetch horoscope data" });
//     }
//   } catch (error) {
//     console.error("Error fetching daily horoscope:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
//=======================================================================
const axios = require("axios");
const { getAccessToken } = require("../../helpers/accessToken");

const BASE_URL = process.env.PROKERALA_API_BASE_URL;

// const makeApiRequest = async (endpoint, params) => {
//   try {
//     const token = await getAccessToken();
//     // console.log("token: ", token);

//     const response = await axios.get(`${BASE_URL}${endpoint}`, {
//       params,
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching data from ${endpoint}:`, error.message);
//     if (error.response) {
//       throw new Error(
//         `API Error: ${error.response.status} - ${error.response.data.message || "Unknown error"
//         }`
//       );
//     }
//     throw new Error("Internal Server Error");
//   }
// };

const makeApiRequest = async (endpoint, params) => {
  try {
    const token = await getAccessToken();
    // console.log("Access Token:", token);
    // console.log("Request Params:", params);

    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error.message);
    if (error.response) {
      console.error("API Response Error:", error.response.data);
      throw new Error(
        `API Error: prokerla ${error.response.status} - ${JSON.stringify(error.response.data) || "Unknown error"}`
      );
    }
    throw new Error("Internal Server Error");
  }
};


const handleApiRequest = async (req, res, apiCall) => {
  // console.log("============================= API request =============================");

  try {
    const data = await apiCall();
    // console.log("========================== data ========================");

    res.json(data);
  } catch (error) {
    console.log("error handleApiRequest: ", error);

    console.error(error);
    res.status(error.message.startsWith("API Error") ? 400 : 500).json({ message: error.message });
  }
};

// exports.getTodaysPanchang = async (req, res) => {
//   const { latitude, longitude, ayanamsa, language } = req.query;

//   if (!latitude || !longitude || !ayanamsa) {
//     return res
//       .status(400)
//       .json({ message: "Latitude, longitude, and ayanamsa are required" });
//   }

//   const params = {
//     ayanamsa,
//     coordinates: `${latitude},${longitude}`,
//     datetime: new Date().toISOString(),
//     la: language,
//   };

//   await handleApiRequest(req, res, () =>
//     makeApiRequest("/astrology/panchang/advanced", params)
//   );
// };

exports.getTodaysPanchang = async (req, res) => {
  const { latitude, longitude, ayanamsa, language } = req.query;

  // Validate required parameters
  if (!latitude || !longitude || !ayanamsa) {
    return res.status(400).json({ message: "Latitude, longitude, and ayanamsa are required" });
  }

  // Construct parameters for the API request
  const params = {
    ayanamsa,
    coordinates: `${latitude},${longitude}`,
    datetime: new Date().toISOString(), // Current date and time in ISO format
    la: language,
  };

  try {
    // Make the API request
    await handleApiRequest(req, res, () => makeApiRequest("/astrology/panchang/advanced", params));
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching Panchang", error: error.message, });
  }
};


exports.getJanamKundali = async (req, res) => {
  const { latitude, longitude, ayanamsa, language } = req.query;

  if (!latitude || !longitude || !ayanamsa) {
    return res.status(400).json({ message: "Latitude, longitude, and ayanamsa are required" });
  }

  const params = {
    ayanamsa,
    coordinates: `${latitude},${longitude}`,
    datetime: new Date().toISOString(),
    la: language,
  };

  await handleApiRequest(req, res, () => makeApiRequest("/astrology/kundli", params));
};

exports.getKundaliMatch = async (req, res) => {
  const { maleDetails, femaleDetails } = req.body;

  // const params = {
  //   ayanamsa: 1,
  //   boy_coordinates: `${maleDetails.location.latitude},${maleDetails.location.longitude}`,
  //   boy_dob: `${maleDetails.date}T${maleDetails.time}:00Z`,
  //   girl_coordinates: `${femaleDetails.location.latitude},${femaleDetails.location.longitude}`,
  //   girl_dob: `${femaleDetails.date}T${femaleDetails.time}:00Z`,
  //   la: "en",
  // };

  const params = {
    ayanamsa: 1,
    boy_name: maleDetails?.name || "", // optional
    boy_coordinates: `${maleDetails?.location?.latitude},${maleDetails?.location?.longitude}`,
    boy_dob: `${maleDetails?.dob}`,
    girl_name: femaleDetails?.name || "", // optional
    girl_coordinates: `${femaleDetails?.location?.latitude},${femaleDetails?.location?.longitude}`,
    girl_dob: `${femaleDetails?.dob}`,
    la: "en",
  };
  await handleApiRequest(req, res, () => makeApiRequest("/astrology/kundli-matching", params));
};

// exports.getShubhMuhurat = async (req, res) => {
//   const { date, location } = req.body;

//   if (!location || !location.latitude || !location.longitude || !date) {
//     return res.status(400).json({
//       message: "Location (latitude, longitude) and date are required",
//     });
//   }

//   const params = {
//     ayanamsa: 1,
//     coordinates: `${location.latitude},${location.longitude}`,
//     datetime: `${date}T00:00:00Z`,
//     la: "en",
//   };

//   const endpoints = [
//     "/astrology/choghadiya",
//     "/astrology/hora",
//     "/astrology/gowri-nalla-neram",
//     "/astrology/inauspicious-period",
//   ];

//   await handleApiRequest(req, res, async () => {
//     const results = await Promise.all(
//       endpoints.map((endpoint) => makeApiRequest(endpoint, params))
//     );
//     const [choghadiya, horaTiming, gowriNallaNeram, rahuKaal] = results;
//     return { choghadiya, horaTiming, gowriNallaNeram, rahuKaal };
//   });
// };

// Choghadiya Controller
exports.getChoghadiya = async (req, res) => {
  const { date, location } = req.body;

  if (!location || !location.latitude || !location.longitude || !date) {
    return res.status(400).json({ message: "Location (latitude, longitude) and date are required", });
  }

  const params = {
    ayanamsa: 1,
    coordinates: `${location.latitude},${location.longitude}`,
    datetime: `${date}T00:00:00Z`,
    la: "en",
  };

  await handleApiRequest(req, res, async () => {
    const choghadiya = await makeApiRequest("/astrology/choghadiya", params);
    return { choghadiya };
  });
};

// Hora Timing Controller
exports.getHoraTiming = async (req, res) => {
  const { date, location } = req.body;

  if (!location || !location.latitude || !location.longitude || !date) {
    return res.status(400).json({ message: "Location (latitude, longitude) and date are required", });
  }

  const params = {
    ayanamsa: 1,
    coordinates: `${location.latitude},${location.longitude}`,
    datetime: `${date}T00:00:00Z`,
    la: "en",
  };

  await handleApiRequest(req, res, async () => {
    const horaTiming = await makeApiRequest("/astrology/hora", params);
    return { horaTiming };
  });
};

// Gowri Nalla Neram Controller
exports.getGowriNallaNeram = async (req, res) => {
  const { date, location } = req.body;

  if (!location || !location.latitude || !location.longitude || !date) {
    return res.status(400).json({ message: "Location (latitude, longitude) and date are required", });
  }

  // Format the datetime to ISO 8601
  const datetime = new Date(`${date}T00:00:00Z`).toISOString();
  const params = {
    ayanamsa: 1,
    coordinates: `${location.latitude},${location.longitude}`,
    datetime,
    la: "en",
  };

  await handleApiRequest(req, res, async () => {
    const gowriNallaNeram = await makeApiRequest("/astrology/gowri-nalla-neram", params);
    return { gowriNallaNeram };
  });
};

// Rahu Kaal (Inauspicious Period) Controller
exports.getRahuKaal = async (req, res) => {
  const { date, location } = req.body;

  if (!location || !location.latitude || !location.longitude || !date) {
    return res.status(400).json({ message: "Location (latitude, longitude) and date are required", });
  }

  const params = {
    ayanamsa: 1,
    coordinates: `${location.latitude},${location.longitude}`,
    datetime: `${date}T00:00:00Z`,
    la: "en",
  };

  await handleApiRequest(req, res, async () => {
    const rahuKaal = await makeApiRequest("/astrology/inauspicious-period", params);
    return { rahuKaal };
  });
};

exports.getVratUpvaas = async (req, res) => {
  const { year, month } = req.query;
  await handleApiRequest(req, res, () => makeApiRequest("/astrology/vrat-upvaas", { year, month }));
};

exports.getDailyHoroscope = async (req, res) => {
  // console.log("========================= req,res =================================");

  const { sign } = req.query;
  // console.log("sign:", sign);

  if (!sign) {
    return res.status(400).json({ message: "Sign is required" });
  }

  const params = {
    datetime: new Date().toISOString(),
    sign: sign.toLowerCase(),
  };

  await handleApiRequest(req, res, () => makeApiRequest("/horoscope/daily", params));
  // console.log("========================= END =================================");
};
