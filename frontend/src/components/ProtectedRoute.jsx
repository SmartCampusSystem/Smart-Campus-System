import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  // Login වී නැත්නම් login page එකට redirect කරයි
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role එකක් බලාපොරොත්තු වන අතර එය ගැලපෙන්නේ නැත්නම් Home එකට redirect කරයි
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;