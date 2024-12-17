import { useState } from "react";
import HistoricalChart from "./components/HistoricalChart";
import LivePrices from "./components/LivePrices";

const Dashboard = () => {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Dashboard Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-400">Crypto Dashboard</h1>
      </header>

      {/* Tabs for Coin Selection */}
      <nav className="flex justify-center space-x-4 mb-6">
        {["bitcoin", "ethereum", "tellor"].map((coin) => (
          <button
            key={coin}
            onClick={() => setSelectedCoin(coin)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedCoin === coin
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {coin.charAt(0).toUpperCase() + coin.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto space-y-8">
        {/* Historical Chart for Selected Coin */}
        <section>
          <HistoricalChart coinId={selectedCoin} />
        </section>

        {/* Live Prices for Selected Coin */}
        <section>
          <LivePrices coinId={selectedCoin} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
