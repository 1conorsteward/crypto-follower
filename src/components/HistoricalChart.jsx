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
        const response = await axios.get(
          `https://crypto-follower.onrender.com/api/historical/${coinId}`
        );
        const prices = response.data.prices;

        const labels = prices.map((price) =>
          new Date(price[0]).toLocaleDateString()
        );
        const dataPoints = prices.map((price) => price[1]);

        // Calculate the average monthly cost
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
        console.error("Error fetching historical data:", err.message);
        setError("Failed to fetch historical chart data");
      }
    };

    fetchHistoricalData();
  }, [coinId]);

  // Fetch the live price for the selected coin
  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(
          `https://crypto-follower.onrender.com/api/live/${coinId}`
        );
        const price = response.data[coinId]?.usd || null;
        setCurrentPrice(price);

        // Calculate percent difference when averageCost is available
        if (averageCost && price) {
            const percent = (((price - averageCost) / averageCost) * 100).toFixed(2);
          setPercentDifference(percent);
        }
      } catch (err) {
        console.error("Error fetching live price:", err.message);
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
              Average Monthly Cost:{" "}
              <span className="text-blue-400">${averageCost}</span>
            </h3>
          </div>

          {/* Current Price vs Monthly Average */}
          {currentPrice && percentDifference && (
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Current Price:{" "}
                <span className="text-green-400">${currentPrice}</span>
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
