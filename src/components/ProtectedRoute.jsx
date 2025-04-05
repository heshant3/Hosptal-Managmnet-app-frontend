import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (currentUser.role === "doctor") {
      return <Navigate to="/doctor" replace />;
    } else if (currentUser.role === "patient") {
      return <Navigate to="/patient" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
