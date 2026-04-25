import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard

import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/auth/LoginPage';
import Home from './pages/client/Home';
import Register from './pages/auth/Register';
import Resources from './pages/client/Resources';
import BookResource from './pages/client/BookResource';
import MyBookings from './pages/client/MyBookings';
import BookingsHub from './pages/client/BookingsHub';
import SupportPage from './pages/client/SupportPage';
import Tickets from './pages/client/Tickets';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import NotificationPage from './pages/client/NotificationPage';
import ProfilePage from './pages/client/ProfilePage';
import BookingDetails from './pages/client/BookingsDetails';
import AdminBookingDetails from './pages/admin/AdminBookingDetails';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* --- Admin Routes --- */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bookings/:id" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminBookingDetails />
            </ProtectedRoute>
          } 
        />

        {/* --- Technician Routes --- */}
        <Route 
          path="/technician/*" 
          element={
            <ProtectedRoute allowedRole="TECHNICIAN">
              <TechnicianDashboard />
            </ProtectedRoute>
          } 
        />

        {/* --- Client/User Protected Routes --- */}
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><BookResource /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsHub /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;