const express = require('express');
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();



const port = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Load flight data from data.json
const flightData = require('./data.json');

// Define API endpoint to fetch flight prices
app.post('/flight-prices', (req, res) => {
    const { source, destination, date } = req.body;
  
    if (!source || !destination || !date) {
      return res.status(400).json({
        error: 'Please provide valid source, destination, and date in the request body.',
      });
    }
  
    const flight = flightData.flights.find(
      (flight) =>
        flight.source === source && flight.destination === destination
    );
  
    if (!flight) {
      return res.status(404).json({
        error: 'No flights found for the given source and destination.',
      });
    }
  
    const priceInfo = flight.prices.find((price) => price.date === date);
    if (!priceInfo) {
      return res.status(404).json({
        error: 'No flight prices found for the given date.',
      });
    }
  
    return res.json({
      indigo: `₹${priceInfo.indigo}`,
      airAsia: `₹${priceInfo.airAsia}`,
      vistara: `₹${priceInfo.vistara}`,
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});