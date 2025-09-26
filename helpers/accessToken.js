let accessToken = null;
let tokenExpirationTime = null;

exports.getAccessToken = async () => {
  const clientId = process.env.PROKERALA_CLIENT_ID;
  const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
  const tokenUrl = "https://api.prokerala.com/token";

  // Check if token exists and is still valid
  const currentTime = Date.now();
  if (accessToken && tokenExpirationTime && currentTime < tokenExpirationTime) {
    return accessToken;
  }

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const data = await response.json();
    accessToken = data.access_token;

    // console.log("Access token: ", accessToken);

    // console.log("response: ", response);


    // Set the expiration time (current time + token lifetime in milliseconds)
    tokenExpirationTime = currentTime + data.expires_in * 1000; // expires_in is in seconds

    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    throw new Error("Failed to get access token");
  }
};
