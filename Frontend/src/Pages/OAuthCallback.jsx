import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AuthContext);

  useEffect(() => {
    // 1. Grab the token from the URL query string
    const token = searchParams.get("token");

    if (token) {
      // 2. Save the token to Context/LocalStorage
      setToken(token);

      // 3. Fetch the user's profile data using the new token
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          toast.success("Successfully logged in!", { id: "oauth-login" });
          navigate("/"); // Teleport to home!
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          toast.error("Failed to fetch profile");
          navigate("/login");
        });
    } else {
      toast.error("Authentication failed");
      navigate("/login");
    }
  }, [searchParams, navigate, setToken, setUser]);

  // Show a loading screen while it processes the token
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h2 className="text-xl font-bold">Completing Login...</h2>
      </div>
    </div>
  );
};

export default OAuthCallback;
