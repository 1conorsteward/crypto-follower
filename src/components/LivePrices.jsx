/**
 * LivePrices Component
 * Conor Steward
 * 12/19/24
 * 1conorsteward@gmail.com
 * This file defines the LivePrices component, responsible for fetching and displaying
 * the live price of a cryptocurrency. The component uses an in-memory cache to reduce
 * redundant API requests and periodically refreshes the displayed price.
 * 
 * Features:
 * - Fetches live price data from the CoinGecko API
 * - Caches price data to minimize API calls and improve performance
 * - Handles errors gracefully with user-friendly messages
 * - Automatically updates prices every 30 seconds
 * 
 * Props:
 * - coinId (string, required): The ID of the cryptocurrency to fetch the price for
 * 
 * Styling:
 * - Tailwind CSS classes are used for styling, providing a clean and modern look.
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Constants
const CACHE_DURATION = 10 * 60 * 1000; // Cache duration: 10 minutes
const cache = {}; // In-memory cache object

/**
 * LivePrices Component
 * 
 * Displays the live price of a cryptocurrency by fetching data from the CoinGecko API.
 * Implements caching and periodic updates to enhance efficiency and user experience.
 * 
 * @param {Object} props - The component props
 * @param {string} props.coinId - The ID of the cryptocurrency to fetch the price for
 */
const LivePrices = ({ coinId }) => {
  // State variables to store the price and error state
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches the live price for the specified cryptocurrency.
     * Utilizes caching to minimize API requests and ensure timely updates.
     */
    const fetchLivePrice = async () => {
      // Check if the data is in the cache and still valid
      const cachedData = cache[coinId];
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        console.log(`Serving cached live price for ${coinId}`);
        setPrice(cachedData.price);
        return;
      }

      // Fetch new data from the CoinGecko API
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

        // Update the cache with the new data
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

    fetchLivePrice(); // Fetch price on component mount

    // Set an interval to periodically refresh the price
    const interval = setInterval(fetchLivePrice, 30000); // Update every 30 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [coinId]); // Re-run effect if coinId changes

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
      {/* Component Header */}
      <h2 className="text-xl font-semibold mb-2">
        {coinId.toUpperCase()} Live Price
      </h2>

      {/* Display price or error message */}
      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <p className="text-3xl font-bold">${price}</p>
      )}
    </div>
  );
};

// Define PropTypes for the component
LivePrices.propTypes = {
  coinId: PropTypes.string.isRequired, // coinId must be a string and is required
};

export default LivePrices;
