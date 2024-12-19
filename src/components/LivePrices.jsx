import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CACHE_DURATION = 10 * 60 * 1000; // Cache duration: 10 minutes
const cache = {}; // In-memory cache

const LivePrices = ({ coinId }) => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivePrice = async () => {
      // Check cache
      const cachedData = cache[coinId];
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log(`Serving cached live price for ${coinId}`);
        setPrice(cachedData.price);
        return;
      }

      // Fetch new data from API
      try {
        console.log(`Fetching live price for ${coinId}`);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
        );

        if (!response.ok) {
          throw new Error(`API response error: ${response.status}`);
        }

        const data = await response.json();
        const fetchedPrice = data[coinId]?.usd || "N/A";

        // Update cache
        cache[coinId] = {
          price: fetchedPrice,
          timestamp: Date.now(),
        };

        setPrice(fetchedPrice);
        setError(null);
      } catch (err) {
        console.error("Error fetching live price:", err.message);
        setError("Failed to fetch live price");
      }
    };

    fetchLivePrice();

    // Set interval for periodic updates
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