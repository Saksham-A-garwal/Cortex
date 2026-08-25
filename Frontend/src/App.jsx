import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import LibraryPage from "./pages/LibraryPage";
import DashboardLayout from "./layout/DashboardLayout";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./layout/ProtectedRoute";
import OAuthCallback from "./pages/OAuthCallback";
import ErrorBoundary from "./components/ErrorBoundary";

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
            <Route path="/profile" element={<Navigate to="/settings?tab=profile" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
