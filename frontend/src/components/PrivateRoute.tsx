import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "../interfaces";

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const token = localStorage.getItem("token");

  if (!token || !userData.id) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userData.role as UserRole)) {
    switch (userData.role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin" />;
      case UserRole.COMPANY:
        return <Navigate to="/empresa" />;
      case UserRole.STUDENT:
        return <Navigate to="/estudante" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;
