import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" />;
  } else if (role !== "Admin") {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};

export default AdminRoutes;
