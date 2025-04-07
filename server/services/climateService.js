const axios = require('axios');

module.exports = async function getClimate(location) {
  let lat, lon;

  // If coordinates are provided, use them.
  // if (location.lat && location.lon) {
  //   lat = location.lat;
  //   lon = location.lon;
  // } 
  // If a city is provided, you might have to use a geocoding service.
  // For demonstration, we'll hardcode New York's coordinates.
  // else
   if (location.city) {

    const city = encodeURIComponent(location.city);
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    console.log("Geocoding city via:", geoUrl);

    const geoResp = await axios.get(geoUrl);
    const results = geoResp.data.results;
    if (!results || results.length === 0) {
      throw new Error(`Could not geocode city: ${location.city}`);
    }

    lat = results[0].latitude;
    lon = results[0].longitude;
    console.log(`Geocoded ${location.city} → lat:${lat}, lon:${lon}`);
  } 
  // If no location is provided, fall back to ipapi for geolocation.
  else {
    console.log("No location provided. Using ipapi to determine location.");
    const ipapiUrl = `https://ipapi.co/json/`;
    console.log("Calling weather api.....")
    const ipResponse = await axios.get(ipapiUrl);
    lat = ipResponse.data.latitude;
    lon = ipResponse.data.longitude;
  }

  // Use Open-Meteo to fetch current weather (no API key required)
  // Documentation: https://open-meteo.com/en/docs
  console.log("Using Open-Meteo API for weather data.");
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