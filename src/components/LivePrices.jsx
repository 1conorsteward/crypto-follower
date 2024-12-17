import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axios from "axios";

const LivePrices = ({ coinId }) => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/live/${coinId}`
        );

        setPrice(response.data[coinId]?.usd || "N/A");
        setError(null);
      } catch (err) {
        console.error("Error fetching live price:", err.message);
        setError("Failed to fetch live price");
      }
    };

    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval); // Cleanup
  }, [coinId]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-2">
        {coinId.toUpperCase()} Live Price
      </h2>
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <p className="text-3xl font-bold">${price}</p>
      )}
    </div>
  );
};

// Add PropTypes validation
LivePrices.propTypes = {
  coinId: PropTypes.string.isRequired, // coinId must be a string and is required
};

export default LivePrices;
