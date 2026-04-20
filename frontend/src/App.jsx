import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/auth/LoginPage';
import Home from './pages/client/Home';
import Register from './pages/auth/Register';
import Resources from './pages/client/Resources';
import BookResource from './pages/client/BookResource';
import MyBookings from './pages/client/MyBookings';
import BookingsHub from './pages/client/BookingsHub';
import SupportPage from './pages/client/SupportPage';



function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/book/:id" element={<BookResource />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/bookings" element={<BookingsHub />} />
        <Route path="/support" element={<SupportPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;