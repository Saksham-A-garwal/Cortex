import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "../Store/settingsSlice";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const SettingsPage = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/Login", { replace: true });
  };

  const currentSettings = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    model: currentSettings.model,
    systemPrompt: currentSettings.systemPrompt,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    dispatch(
      updateSettings({
        model: formData.model,
        systemPrompt: formData.systemPrompt,
      }),
    );

    toast.success("Settings saved successfully! Cortex is now updated.", {
      style: {
        background: "#18181b",
        color: "#fff",
      },
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-900">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto mt-6">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚙️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-50">
                  AI Settings
                </h1>
                <p className="text-secondary-text mt-1">
                  Customize the model and behavior of Cortex.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div>
                <label className="block text-lg font-semibold text-neutral-50 mb-2">
                  AI Model
                </label>
                <p className="text-sm text-secondary-text mb-4">
                  Select the language model that powers Cortex.
                </p>

                <div className="relative">
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-white appearance-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent cursor-pointer"
                  >
                    <option value="gemini-flash-latest">
                      Google Gemini Flash (Most Stable)
                    </option>
                    <option value="gemini-3.5-flash">
                      Google Gemini 3.5 Flash (Cutting Edge)
                    </option>
                    <option value="llama-3.1-8b-instant">
                      Groq: Llama 3.1 (Lightning Fast)
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-secondary-text">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="block text-lg font-semibold text-neutral-50 mb-2">
                  System Prompt
                </label>
                <p className="text-sm text-secondary-text mb-4">
                  Give Cortex a specific persona, rules, or instructions. (e.g.,
                  "You are a senior developer. Only reply with Python code.")
                </p>

                <textarea
                  name="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={handleChange}
                  rows="5"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none transition-all"
                  placeholder="You are Cortex..."
                ></textarea>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-accent hover:opacity-90 text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-lg text-lg"
                >
                  Save AI Settings
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-lg font-semibold text-neutral-50 mb-4">
                Account Actions
              </h3>
              <p className="text-sm text-secondary-text mb-4">
                Securely log out of your session on this device.
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Log Out of Cortex
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
