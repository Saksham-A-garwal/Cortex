import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { ShieldCheck, Users, Crown } from "lucide-react";

const LoginPage = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/Login`,
        { email: Email, password: Password }
      );

      toast.success("Welcome back!");
      setEmail("");
      setPassword("");
      setUser(response.data.user);
      setToken(response.data.token);
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Failed to log in";
      toast.error(errorMsg);
      console.error("Error logging in:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-6 relative">
      
      {/* Top Right Logo */}
      <div className="absolute top-8 right-8 font-extrabold text-2xl tracking-tighter flex items-center gap-2 text-white">
        <span className="text-3xl text-indigo-500">C</span> CortexAi
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        
        {/* LEFT SIDE - Brand & Benefits */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="max-w-lg mx-auto md:mx-0">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-white">
            Welcome Back!
          </h1>
          <p className="text-gray-400 mb-12 text-lg">
            Sign in to access your account, resume your chats, and enjoy personalized AI experiences at Cortex.
          </p>

          <div className="flex flex-col gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-gray-800 rounded-lg text-green-400 mt-1 border border-gray-700">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Secure Authentication</h3>
                <p className="text-gray-500 text-sm">Your data is protected with enterprise-grade security</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-gray-800 rounded-lg text-blue-400 mt-1 border border-gray-700">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Trusted by Thousands</h3>
                <p className="text-gray-500 text-sm">Join our community of satisfied users</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2 bg-gray-800 rounded-lg text-purple-400 mt-1 border border-gray-700">
                <Crown size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Premium Experience</h3>
                <p className="text-gray-500 text-sm">Access exclusive AI models and personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* RIGHT SIDE - Auth Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
          <div className="w-full max-w-[440px] bg-gray-800 p-8 lg:p-10 rounded-2xl shadow-2xl border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to CortexAi</h2>
            <p className="text-gray-400 text-sm">Welcome back! Please sign in to continue</p>
          </div>

          {/* Social Auth Buttons (TOP) */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`)}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`)}
              className="w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-semibold">Email address</label>
              <input
                name="email"
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                placeholder="Enter your email address"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-semibold">Password</label>
              <input
                name="password"
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Continue ➔"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
