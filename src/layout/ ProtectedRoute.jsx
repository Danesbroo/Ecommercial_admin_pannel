import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const token = Cookies.get("token"); // it check token is in cookies ?

  if (!token) {
    return <Navigate to="/"/>;
  }

  return children;
}
