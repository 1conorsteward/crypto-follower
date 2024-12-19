/**
 * Crypto Dashboard Component
 * Conor Steward
 * 12/19/24
 * 1conorsteward@gmail.com
 * This file defines the main dashboard component for a cryptocurrency monitoring application.
 * The dashboard allows users to select between different cryptocurrencies and view historical
 * price charts as well as live price updates for the selected coin.
 * 
 * Features:
 * - Dynamic coin selection via tabs
 * - Integration with HistoricalChart and LivePrices components
 * - Responsive and visually appealing design
 * 
 * Components:
 * - HistoricalChart: Displays historical data for the selected cryptocurrency
 * - LivePrices: Shows real-time price updates for the selected cryptocurrency
 * 
 * Styling:
 * - Tailwind CSS is used for styling, ensuring a modern and responsive UI.
 */

import { useState } from "react";
import HistoricalChart from "./components/HistoricalChart";
import LivePrices from "./components/LivePrices";

/**
 * Dashboard Component
 * 
 * This is the main functional component for the cryptocurrency dashboard.
 * It manages state for the selected cryptocurrency and renders child components
 * for displaying historical charts and live prices.
 */
const Dashboard = () => {
  // State to manage the currently selected cryptocurrency (default: Bitcoin)
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Dashboard Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-400">Crypto Dashboard</h1>
      </header>

      {/* Tabs for Coin Selection */}
      <nav className="flex justify-center space-x-4 mb-6">
        {/* Render a button for each coin */}
        {["bitcoin", "ethereum", "tellor"].map((coin) => (
          <button
            key={coin} // Unique key for each button
            onClick={() => setSelectedCoin(coin)} // Update selected coin state on click
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedCoin === coin
                ? "bg-blue-500 text-white" // Active button styling
                : "bg-gray-700 text-gray-300 hover:bg-gray-600" // Inactive button styling
            }`}
          >
            {/* Capitalize the first letter of the coin name */}
            {coin.charAt(0).toUpperCase() + coin.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto space-y-8">
        {/* Historical Chart for Selected Coin */}
        <section>
          {/* Render HistoricalChart component with the selected coin as a prop */}
          <HistoricalChart coinId={selectedCoin} />
        </section>

        {/* Live Prices for Selected Coin */}
        <section>
          {/* Render LivePrices component with the selected coin as a prop */}
          <LivePrices coinId={selectedCoin} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
