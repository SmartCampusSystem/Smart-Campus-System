import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance'; 
import { Users, ShieldCheck, UserCheck, TrendingUp } from 'lucide-react';

// Components
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import BookingManagement from './BookingManagement';
import ResourcesDashboard from './ResourcesDashboard';
import UserDirectory from './UserDirectory';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    sessionStorage.clear();
    navigate('/login'); 
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const ComingSoon = ({ title }) => (
    <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
      <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">{title} Module</h2>
      <p className="text-sm text-slate-300 font-bold mt-2">Access restricted or under maintenance.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafa] font-sans text-slate-900 overflow-hidden">
      
      <Sidebar location={location} handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        
        <AdminHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          fetchUsers={fetchUsers} 
          loading={loading} 
        />

        <main className="flex-1 overflow-y-auto p-12 space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Users size={20}/>} label="Active Users" value={users.length} accent="border-l-[#0c5252]" />
            <StatCard icon={<ShieldCheck size={20}/>} label="Admin Privileges" value="01" accent="border-l-[#e9c46a]" />
            <StatCard icon={<TrendingUp size={20}/>} label="System Load" value="98.2%" accent="border-l-emerald-500" />
            <StatCard icon={<UserCheck size={20}/>} label="Live Sessions" value="04" accent="border-l-blue-500" />
          </div>

          <Routes>
            <Route index element={<UserDirectory users={users} searchTerm={searchTerm} fetchUsers={fetchUsers} />} />
            <Route path="users" element={<UserDirectory users={users} searchTerm={searchTerm} fetchUsers={fetchUsers}/>} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="resources" element={<ResourcesDashboard />} />
            <Route path="overview" element={<ComingSoon title="Overview" />} />
            <Route path="tickets" element={<ComingSoon title="Support Tickets" />} />
            <Route path="notifications" element={<ComingSoon title="Notifications" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// StatCard helper can stay here as it's a small UI utility
function StatCard({ icon, label, value, accent }) {
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 border-l-[6px] ${accent} hover:shadow-xl transition-all duration-500`}>
      <div className="flex justify-between items-start mb-4 text-slate-200">{icon}</div>
      <h4 className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{value}</h4>
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3 leading-none">{label}</p>
    </div>
  );
}

export default AdminDashboard;