import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem("token");
  const userData = sessionStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch (error) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;