import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }

    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", JSON.stringify(name));
        handleSuccess(message);
        setTimeout(() => navigate("/home"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Login failed");
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-gray-900 text-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          Sign in
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={loginInfo.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={loginInfo.password}
              onChange={handleChange}
              className="mt-1 w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition duration-200 shadow"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
