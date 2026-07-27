import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  // 2. Return the <Navigate /> component!
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
