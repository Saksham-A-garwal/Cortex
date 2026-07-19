import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/SignUp`,
        {
          fullname: FullName,
          email: Email,
          password: Password,
        },
      );

      console.log("Success", response.data);
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      // If they type a bad email or the server crashes, it will log here
      console.error(
        "Error signing up:",
        error.response?.data?.msg || error.message,
      );
    }
    console.log("Signing up with:", FullName, Email, Password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Create an Account
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          {/* Full Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400 font-semibold">
              Full Name
            </label>
            <input
              name="fullname"
              type="text"
              value={FullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="John Doe"
            />
          </div>

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
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
