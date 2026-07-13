import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-900">
      {/* The Sidebar is fixed on the left for EVERY page inside this layout */}
      <Sidebar />

      {/* The Outlet is the "portal". 
          If you are on /settings, the Settings UI will appear here.
          If you are on /, the ChatArea will appear here. 
      */}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
