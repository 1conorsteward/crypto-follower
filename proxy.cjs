const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const cache = {};
const CACHE_DURATION = 10 * 60 * 1000; // Cache duration: 10 minutes

// Function to calculate monthly average costs
const calculateMonthlyAverages = (prices) => {
  const monthlyTotals = {};
  const monthlyCounts = {};

  prices.forEach(([timestamp, price]) => {
    const date = new Date(timestamp);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // e.g., "2023-12"

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
      monthlyCounts[month] = 0;
    }

    monthlyTotals[month] += price;
    monthlyCounts[month] += 1;
  });

  const monthlyAverages = {};
  Object.keys(monthlyTotals).forEach((month) => {
    monthlyAverages[month] = (monthlyTotals[month] / monthlyCounts[month]).toFixed(2);
  });

  return monthlyAverages;
};

// Function to fetch and cache historical data
const fetchHistoricalData = async (coinId) => {
  if (cache[coinId] && Date.now() - cache[coinId].timestamp < CACHE_DURATION) {
    console.log(`Serving cached historical data for ${coinId}`);
    return cache[coinId].data;
  }

  console.log(`Fetching historical data for ${coinId}...`);
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: "90", // Fetch 90 days of data
          interval: "daily",
        },
      }
    );

    const prices = response.data.prices;
    const monthlyAverages = calculateMonthlyAverages(prices);

    const data = {
      prices,
      monthlyAverages,
    };

    // Cache the response
    cache[coinId] = {
      data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error.message);
    throw error;
  }
};

// Function to fetch and cache live prices for multiple coins
const fetchLivePrices = async () => {
  const livePriceKey = "livePrices";

  if (cache[livePriceKey] && Date.now() - cache[livePriceKey].timestamp < CACHE_DURATION) {
    console.log("Serving cached live prices");
    return cache[livePriceKey].data;
  }

  console.log("Fetching live prices from CoinGecko...");
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "bitcoin,ethereum,tellor",
          vs_currencies: "usd",
        },
      }
    );

    // Cache the response
    cache[livePriceKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    console.error("Error fetching live prices:", error.message);
    throw error;
  }
};

// Route to fetch historical data and monthly average costs
app.get("/api/historical/:coinId", async (req, res) => {
  const { coinId } = req.params;

  try {
    const data = await fetchHistoricalData(coinId);
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch historical data",
      details: error.message,
    });
  }
});

// Route to fetch live prices for all coins
app.get("/api/live", async (req, res) => {
  try {
    const data = await fetchLivePrices();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch live prices",
      details: error.message,
    });
  }
});

// Route to fetch live price for a single coin
app.get("/api/live/:coinId", async (req, res) => {
  const { coinId } = req.params;
  const livePriceKey = `livePrice_${coinId}`;

  if (
    cache[livePriceKey] &&
    Date.now() - cache[livePriceKey].timestamp < CACHE_DURATION
  ) {
    console.log(`Serving cached live price for ${coinId}`);
    return res.json(cache[livePriceKey].data);
  }

  try {
    console.log(`Fetching live price for ${coinId}...`);
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: coinId,
          vs_currencies: "usd",
        },
      }
    );

    // Cache the response
    cache[livePriceKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching live price for ${coinId}:`, error.message);
    res.status(500).json({
      error: "Failed to fetch live price",
      details: error.message,
    });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
