import React, { useState , useContext } from "react";
import { Link } from "react-router-dom"; // So we can link to the Signup page
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const {setUser, setToken} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/Login",
        {
          email: Email,
          password: Password,
        },
      );

      // console.log("Success", response.data);
      setEmail("");
      setPassword("");
      //Set user and token in global context
      setUser(response.data.user);
      setToken(response.data.token);

      navigate("/");
    } catch (error) {
      // If they type a bad email or the server crashes, it will log here
      console.error(
        "Error signing up:",
        error.response?.data?.msg || error.message,
      );
    }

    // console.log("Logging in with:", Email, Password);
  };

  return (
    // Background container
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      {/* The Login Card */}
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-semibold">Email</label>
            <input
              name="email"
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-semibold">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
