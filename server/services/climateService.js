const axios = require('axios');

module.exports = async function getClimate(location, ip) {
  let lat, lon;

  // If coordinates are provided, use them.
  if (location.lat && location.lon) {
    lat = location.lat;
    lon = location.lon;
  } 
  // If a city is provided, you might have to use a geocoding service.
  // For demonstration, we'll hardcode New York's coordinates.
  else if (location.city) {
    if (location.city.toLowerCase() === "new york") {
      lat = 40.7128;
      lon = -74.0060;
    } else {
      // Optionally, you could integrate a free geocoding API here.
      throw new Error("City not recognized. Please provide coordinates.");
    }
  } 
  // If no location is provided, use the mobile device's IP address to determine location
  else if (ip) {
    try {
      // Use ip-api.com which is a free service to get location from IP
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      
      if (response.data && response.data.status === 'success') {
        lat = response.data.lat;
        lon = response.data.lon;
        console.log(`Location determined from IP: ${response.data.city}, ${response.data.country}`);
      } else {
        throw new Error("Could not determine location from IP address");
      }
    } catch (error) {
      console.error("Error determining location from IP:", error.message);
      throw new Error("Failed to get location from IP address");
    }
  }
  // Fall back to ipapi for geolocation if no IP is provided.
  else {
    console.log("No location or IP provided. Using ipapi to determine location.");
    const ipapiUrl = `https://ipapi.co/json/`;
    const ipResponse = await axios.get(ipapiUrl);
    lat = ipResponse.data.latitude;
    lon = ipResponse.data.longitude;
  }

  // Use Open-Meteo to fetch current weather (no API key required)
  // Documentation: https://open-meteo.com/en/docs
  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  console.log("Calling Open-Meteo API:", openMeteoUrl);
  
  const weatherResponse = await axios.get(openMeteoUrl);
  const currentWeather = weatherResponse.data.current_weather;
  console.log("Open-Meteo API call successful");

  // Note: Open-Meteo's free API returns current_weather with temperature (°C) and windspeed.
  // It doesn't provide humidity or a detailed condition description.
  return {
    temperature: currentWeather.temperature, // in Celsius
    wind_speed: currentWeather.windspeed,
    condition: "Not specified",  // You can add mapping if you use weather codes from Open-Meteo
    humidity: null,  // Not provided in the current_weather endpoint
  };
};