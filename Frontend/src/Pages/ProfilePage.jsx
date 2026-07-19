import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../Components/Sidebar";

const ProfilePage = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // On page load, ask the Controller for the current user's profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setFormData({
          fullname: response.data.fullname, // Look for fullname from the backend
          email: response.data.email,
          password: "", // We never fetch the password!
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // When the user clicks "Save", send the new data to the Controller
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          fullname: formData.fullname, // Send fullname to the backend
          email: formData.email,
          // Only send the password if they actually typed something new!
          ...(formData.password && { password: formData.password }),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Profile updated successfully!", {
        style: {
          background: "#374151",
          color: "#fff",
        },
      });
      setFormData((prev) => ({ ...prev, password: "" })); // Clear the password box
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile.",
        {
          style: {
            background: "#374151",
            color: "#fff",
          },
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-800">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto mt-10">
          {/* Glassmorphism Profile Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center gap-6 mb-8 border-b border-gray-700 pb-8">
              {/* Dynamically pull their fullname into the Avatar URL! */}
              <img
                src={`https://ui-avatars.com/api/?name=${formData.fullname || "User"}&background=2563eb&color=fff&size=100`}
                alt="Profile"
                className="w-24 h-24 rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-100">
                  Account Settings
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your profile details and security.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Security
                </h3>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  New Password{" "}
                  <span className="text-gray-500 font-normal">
                    (Leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg disabled:opacity-50"
                >
                  {isLoading ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
