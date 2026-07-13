import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import ChatPage from "./Pages/ChatPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import DashboardLayout from "./Layout/DashboardLayout";
import NotFoundPage from "./Pages/NotFoundPage";
import SignupPage from "./Pages/SignupPage";
import ProtectedRoute from "./Layout/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<ChatPage />} />
          <Route path="/chat/:chatId" element = {<ChatPage/>} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
