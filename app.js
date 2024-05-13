const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample data 
const locations = [
    { name: 'dha', latitude: 37.7749, longitude: -122.4194 },
    { name: 'johar', latitude: 34.0522, longitude: -118.2437 },
    { name: 'thk', latitude: 40.7128, longitude: -74.0060 },
    { name: 'gulshan', latitude: 41.8781, longitude: -87.6298 },
    { name: 'defence', latitude: 51.5074, longitude: -0.1278 },

    { name: 'korangi', latitude: 51.5074, longitude: -0.1278 }
];

// Middleware
app.use(bodyParser.json());

// Search endpoint
app.get('/search', (req, res) => {
    const { name, latitude, longitude } = req.query;

    if (!name && (!latitude || !longitude)) {
        return res.status(400).json({ error: 'Please provide either name or latitude and longitude.' });
    }

    let results = [];

    if (name) {
        // Search by name
        results = locations.filter(location => location.name.toLowerCase().includes(name.toLowerCase()));
    } else {
        // Search by location
        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Please provide both latitude and longitude for location-based search.' });
        }

        // Calculate distances using Haversine formula
        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        results = locations.filter(location => {
            const distance = calculateDistance(userLocation, { latitude: location.latitude, longitude: location.longitude });
            return distance <= 50; // You can adjust the distance threshold as needed
        });
    }

    res.json({ results });
});

// Function to calculate distance using Haversine formula
function calculateDistance(coord1, coord2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(coord2.latitude - coord1.latitude);
    const dLon = deg2rad(coord2.longitude - coord1.longitude);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coord1.latitude)) * Math.cos(deg2rad(coord2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


 /* Use the following cURL command to make a GET request to the search endpoint:

GET 'http://localhost:3000/search?name=dha'
This command will search for locations with the name "dha".

c.You can also test location-based search by providing latitude and longitude parameters:

 GET 'http://localhost:3000/search?latitude=37.7749&longitude=-122.4194'
This command will search for locations within a certain radius of the provided latitude and longitude coordinates.
*/
