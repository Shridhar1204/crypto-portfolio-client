import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const [holdings, setHoldings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [newQuantity, setQuantity] = useState("");

  const fetchHoldings = async () => {
    try {
      const token = localStorage.getItem("token");

      const holdingResponse = await axios.get(
        // "http://localhost:8080/holdings/get"
        "https://crypto-portfolio-server.onrender.com/holdings/get",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHoldings(holdingResponse.data.holdings);

      const statsResponse = await axios.get(
        // "http://localhost:8080/holdings/stats"
        "https://crypto-portfolio-server.onrender.com/holdings/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats({
        totalValue: statsResponse.data.totalCurrentValue,
        profitLoss: statsResponse.data.totalProfitLoss,
        totalHoldings: statsResponse.data.portfolioDetails.length,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error: ", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const handleAddHolding = (newHolding) => {
    setHoldings((prev) => [...prev, newHolding]);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // await axios.delete(`http://localhost:8080/holdings/${id}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      await axios.delete(
        `https://crypto-portfolio-server.onrender.com/holdings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHoldings((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete holding");
    }
  };

  const handleUpdateClick = (holding) => {
    setEditId(holding._id);
    setQuantity(holding.quantity);
  };

  const handleSaveClick = async (id) => {
    try {
      const token = localStorage.getItem("token");
      // const res = await axios.put(
      //   `http://localhost:8080/holdings/${id}`,
      //   { quantity: newQuantity },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      const res = await axios.put(
        `https://crypto-portfolio-server.onrender.com/holdings/${id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setEditId(null);
        fetchHoldings();
      }
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
        <div className="text-2xl font-bold text-yellow-400">Cryptex</div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoHome}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaHome />
            Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Add Holding Form */}
        <AddHoldingForm onAdd={handleAddHolding} />

        {/* Stats */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow text-center">
            <p className="text-lg text-gray-400">Total Value</p>
            <p className="text-3xl font-bold text-green-400">
              ${stats.totalValue}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow text-center">
            <p className="text-lg text-gray-400">Profit / Loss</p>
            <p className="text-3xl font-bold text-yellow-400">
              ${stats.profitLoss}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow text-center">
            <p className="text-lg text-gray-400">Total Holdings</p>
            <p className="text-3xl font-bold text-blue-400">
              {stats.totalHoldings}
            </p>
          </div>
        </section>

        {/* Holdings List */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Holdings</h2>
          {holdings.length === 0 ? (
            <p className="text-gray-400">No holdings yet. Add some crypto!</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {holdings.map((holding) => (
                <div
                  key={holding._id}
                  className="bg-gray-800 p-4 rounded-xl shadow-md"
                >
                  <p>
                    <strong>Coin:</strong> {holding.coinName}
                  </p>
                  {editId === holding._id ? (
                    <input
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-2 w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                    />
                  ) : (
                    <p>Amount: {holding.quantity}</p>
                  )}
                  <p>Buy Price: ${holding.buyPrice}</p>
                  <div className="flex gap-3 mt-3">
                    {editId === holding._id ? (
                      <button
                        onClick={() => handleSaveClick(holding._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md flex items-center gap-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateClick(holding)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1 rounded-md flex items-center gap-2"
                      >
                        <FaEdit />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(holding._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md flex items-center gap-2"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// Add Holding Form
const AddHoldingForm = ({ onAdd }) => {
  const [coinName, setCoinName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        // "http://localhost:8080/holdings/add"
        "https://crypto-portfolio-backend.onrender.com/holdings/add",
        {
          coinName,
          quantity,
          buyPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onAdd(response.data);
      setCoinName("");
      setQuantity("");
      setBuyPrice("");
    } catch (err) {
      console.error("Error while adding holding:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">Add Holding</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <input
          type="text"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value)}
          placeholder="Coin Name"
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
          required
        />
        <input
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          placeholder="Buy Price"
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition"
      >
        <FaPlus className="inline mr-2" />
        Add Holding
      </button>
    </form>
  );
};

export default Dashboard;
