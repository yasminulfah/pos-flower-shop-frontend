import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth(); 

  if (loading) return <div>Loading...</div>;

  if (!userRole) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("Role not allowed, redirecting to home");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;