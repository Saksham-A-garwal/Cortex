import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./Pages/LoginPage";
import ChatPage from "./Pages/ChatPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import LibraryPage from "./Pages/LibraryPage";
import DashboardLayout from "./Layout/DashboardLayout";
import NotFoundPage from "./Pages/NotFoundPage";
import ProtectedRoute from "./Layout/ProtectedRoute";
import OAuthCallback from "./Pages/OAuthCallback";
import ErrorBoundary from "./Components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/signup" element={<Navigate to="/Login" replace />} />

        <Route path="/oauth-callback" element={<OAuthCallback />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<ChatPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/documents" element={<Navigate to="/library" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
