const sendMessage = (user, messageType) => {
    const messages = {
      welcome: {
        en: "Welcome to Astrowani India! Our expert astrologers are here to guide you through the planets and nakshatras.",
        hi: "ओहम एस्ट्रो में आपका स्वागत है! हमारे विशेषज्ञ ज्योतिषी आपको ग्रहों व नक्षत्रों के माध्यम से मार्गदर्शन करने के लिए तैयार हैं।",
      },
      thanks: {
        en: "Thank you for trusting us! We hope our astrology services have brought positivity and clarity to your life. Wishing you a brighter future!",
        hi: "हम पर विश्वास करने के लिए धन्यवाद! हमें आशा है कि हमारी ज्योतिष सेवाएं आपके जीवन में सकारात्मकता और स्पष्टता लाएंगी। आपका भविष्य उज्ज्वल हो!",
      },
    };
  
    const userLanguage = user.language || "en"; // Assume user has a preferred language setting
    const message = messages[messageType]?.[userLanguage];
  
    if (!message) {
      throw new Error("Invalid message type or language.");
    }
  
    // Mock send function (replace with actual notification logic, e.g., email, push notification)
    console.log(`Message to ${user.email || user.phoneNumber}: ${message}`);
  };
  
  module.exports = sendMessage;
  