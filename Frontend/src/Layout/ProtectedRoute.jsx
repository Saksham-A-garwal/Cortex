import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

const ProtectedRoute = () => {
  const { token, bootstrapped } = useContext(AuthContext);

  if (!bootstrapped) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
