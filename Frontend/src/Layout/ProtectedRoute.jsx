import React, { useContext } from "react";
// 1. Import Navigate instead of useNavigate
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  // 2. Return the <Navigate /> component!
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
