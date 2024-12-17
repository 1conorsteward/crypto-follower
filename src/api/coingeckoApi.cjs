const axios = require("axios");

// Fetch historical price data
const fetchHistoricalPrices = async (coinId, currency = "usd", days = "max") => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/${coinId}/market_chart`, // Proxy endpoint
      { params: { vs_currency: currency, days } }
    );
    return response.data.prices; // Returns array of [timestamp, price]
  } catch (error) {
    console.error("Error fetching historical prices:", error.message);
    throw error;
  }
};

// Export the function
module.exports = { fetchHistoricalPrices };
