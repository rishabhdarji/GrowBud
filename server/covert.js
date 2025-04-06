const fs = require('fs');

// Update with your actual image path
const imagePath = 'image.jpg';
const imageData = fs.readFileSync(imagePath);
const base64String = imageData.toString('base64');

// Create the payload object (using raw base64)
const payload = {
  image: base64String,
  location: { city: "New York" },
  userType: "Working Professional"
};

// Write the payload to payload.json
fs.writeFileSync('payload.json', JSON.stringify(payload));
console.log('Payload written to payload.json');