import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Ye component protected pages ko secure karta hai
// Agar token nahi hai to login page par bhej dega

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;