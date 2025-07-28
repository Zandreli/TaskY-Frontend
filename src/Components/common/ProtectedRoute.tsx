import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Box } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication status
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
        }}
      >
        <LoadingSpinner message="Checking authentication..." />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
