// src/components/admin/ProtectedAdminRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // --- ROBUST AUTHORIZATION LOGIC ---
  // This version handles both the new `role` property and the old `isAdmin` property
  // for backward compatibility.

  // 1. Check if a user object exists. If not, deny access.
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Check for the new `role` based system.
  const allowedRoles = ['admin', 'moderator'];
  if (user.role && allowedRoles.includes(user.role)) {
    return children; // Access granted based on role
  }

  // 3. (Fallback) Check for the old `isAdmin` system if `role` check fails.
  if (user.isAdmin === true) {
    return children; // Access granted based on old isAdmin flag
  }
  
  // 4. If neither check passes, deny access.
  return <Navigate to="/" state={{ from: location }} replace />;
  // --- END OF ROBUST LOGIC ---
};

export default ProtectedAdminRoute;