import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaPlus, FaUserCircle } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("loggedInUser")?.replace(/"/g, "");

  const fetchValue = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/holdings/stats", {
        headers: { Authorization: token },
      });
      setValue({ totalPortfolio: response.data.totalCurrentValue });
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    }
  };

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            price_change_percentage: "1h,24h,7d",
          },
        }
      );
      setCryptoData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching market data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValue();
    fetchCryptoData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handleAddFunds = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md">
        <div className="text-2xl font-bold text-yellow-400">Cryptex</div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-300">Hi, {username}</span>
          <FaUserCircle className="text-2xl" />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Portfolio Value */}
      <div className="p-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg flex justify-between items-center">
          <div>
            <h2 className="text-lg text-gray-400">Total Portfolio Value</h2>
            <p className="text-4xl font-bold text-green-400">
              {value ? `$${value.totalPortfolio.toLocaleString()}` : "$0.00"}
            </p>
          </div>
          <button
            onClick={handleAddFunds}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-md flex items-center gap-2"
          >
            <FaPlus />
            Add Funds
          </button>
        </div>
      </div>

      {/* Market Section */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Live Market</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-700 text-gray-300 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Coin</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">1h</th>
                <th className="py-3 px-4">24h</th>
                <th className="py-3 px-4">7d</th>
                <th className="py-3 px-4">Market Cap</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    Loading market data...
                  </td>
                </tr>
              ) : (
                cryptoData.map((coin, index) => (
                  <tr key={coin.id} className="hover:bg-gray-700 transition">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <span>{coin.name}</span>
                      <span className="text-gray-400 text-xs">({coin.symbol.toUpperCase()})</span>
                    </td>
                    <td className="py-3 px-4">${coin.current_price.toLocaleString()}</td>
                    <td className={`py-3 px-4 ${coin.price_change_percentage_1h_in_currency > 0 ? "text-green-400" : "text-red-400"}`}>
                      {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                    </td>
                    <td className={`py-3 px-4 ${coin.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}`}>
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td className={`py-3 px-4 ${coin.price_change_percentage_7d_in_currency > 0 ? "text-green-400" : "text-red-400"}`}>
                      {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4">${coin.market_cap.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
