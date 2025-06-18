// src/components/ProtectedRoute.jsx (Corrected)
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // 1. First, check if the user is logged in at all.
  if (!user) {
    // If not, redirect them to the home page to log in.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Next, check if this route requires a specific role AND if the user has that role.
  // The 'allowedRoles' prop is an array like ['admin'] or ['admin', 'moderator'].
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // --- THIS IS THE FIX ---
    // If the user's role is not in the allowed list, they are not authorized.
    // Send them to the home page, which is a safe, accessible location.
    // This prevents the infinite redirect loop.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. If the user is logged in and has the correct role, show the page.
  return children;
};

export default ProtectedRoute;