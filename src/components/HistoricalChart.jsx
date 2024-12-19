import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const RATE_LIMIT_INTERVAL = 1200; // 1.2 seconds between API calls
let lastRequestTime = 0;

// Utility: Rate-limited fetch
const rateLimitedFetch = async (fetchFunction) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_INTERVAL) {
    console.log(`Rate limiting: Waiting ${RATE_LIMIT_INTERVAL - timeSinceLastRequest}ms`);
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_INTERVAL - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
  return fetchFunction();
};

// Utility: Fetch with cache
const fetchWithCache = async (key, fetchFunction) => {
  const cachedData = localStorage.getItem(key);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log(`Serving cached data for ${key}`);
      return data;
    }
  }

  const data = await fetchFunction();
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
};

// Utility: Calculate monthly averages
const calculateMonthlyAverages = (prices) => {
  const monthlyTotals = {};
  const monthlyCounts = {};

  prices.forEach(([timestamp, price]) => {
    const date = new Date(timestamp);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

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

const HistoricalChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [averageCost, setAverageCost] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [percentDifference, setPercentDifference] = useState(null);

  // Fetch historical data and calculate the average monthly cost
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        console.log(`Fetching historical data for coinId: ${coinId}`);
        const data = await fetchWithCache(coinId, async () => {
          const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`;
          console.log("Constructed URL for historical data:", url);

          const response = await rateLimitedFetch(() =>
            axios.get(url, {
              params: { vs_currency: "usd", days: "90", interval: "daily" },
            })
          );

          if (response.data) {
            console.log(`Received data for ${coinId}:`, response.data);
          }

          const { prices } = response.data;
          const monthlyAverages = calculateMonthlyAverages(prices);
          return { prices, monthlyAverages };
        });

        const labels = data.prices.map((price) => new Date(price[0]).toLocaleDateString());
        const dataPoints = data.prices.map((price) => price[1]);

        // Calculate overall average monthly cost
        const average = (
          dataPoints.reduce((sum, price) => sum + price, 0) / dataPoints.length
        ).toFixed(2);
        setAverageCost(average);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${coinId.toUpperCase()} Historical Prices (USD)`,
              data: dataPoints,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
        setError(null);
      } catch (err) {
        if (err.response) {
          console.error(`API Response Error for ${coinId}:`, err.response.data);
        } else {
          console.error(`Error fetching historical data for ${coinId}:`, err.message);
        }
        setError("Failed to fetch historical chart data");
      }
    };

    fetchHistoricalData();
  }, [coinId]);

  // Fetch the live price for the selected coin
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        console.log(`Fetching live price for ${coinId}`);
        const price = await fetchWithCache(`${coinId}_live`, async () => {
          const response = await rateLimitedFetch(() =>
            axios.get("https://api.coingecko.com/api/v3/simple/price", {
              params: { ids: coinId, vs_currencies: "usd" },
            })
          );
          return response.data[coinId]?.usd || null;
        });

        setCurrentPrice(price);

        // Calculate percent difference when averageCost is available
        if (averageCost && price) {
          const percent = (((price - averageCost) / averageCost) * 100).toFixed(2);
          setPercentDifference(percent);
        }
      } catch (err) {
        if (err.response) {
          console.error(`API Response Error for live price of ${coinId}:`, err.response.data);
        } else {
          console.error(`Error fetching live price for ${coinId}:`, err.message);
        }
      }
    };

    fetchCurrentPrice();
  }, [coinId, averageCost]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-4">
        {coinId.toUpperCase()} Historical Chart
      </h2>
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : chartData ? (
        <div>
          {/* Historical Chart */}
          <div className="w-full max-w-screen-lg mx-auto h-96 overflow-hidden mb-4">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          {/* Average Monthly Cost */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">
              Average Monthly Cost: <span className="text-blue-400">${averageCost}</span>
            </h3>
          </div>

          {/* Current Price vs Monthly Average */}
          {currentPrice && percentDifference && (
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Current Price: <span className="text-green-400">${currentPrice}</span>
              </h3>
              <p
                className={`text-xl font-bold ${
                  percentDifference >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {percentDifference >= 0
                  ? `${percentDifference}% ↑`
                  : `${Math.abs(percentDifference)}% ↓`}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// PropTypes validation
HistoricalChart.propTypes = {
  coinId: PropTypes.string.isRequired,
};

export default HistoricalChart;