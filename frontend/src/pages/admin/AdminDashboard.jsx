"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance'; 
import { ShieldCheck, Activity, ArrowUpRight, Globe, CalendarCheck, Layers, TicketCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Components
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import BookingManagement from './BookingManagement';
import ResourcesDashboard from './ResourcesDashboard';
import UserDirectory from './UserDirectory';
import SupportTickets from './SupportTickets';
import AdminNotificationPanel from './AdminNotificationPanel';

const graphData = [
  { name: 'Tue', income: 210 }, { name: 'Wed', income: 380 },
  { name: 'Thu', income: 320 }, { name: 'Fri', income: 480 },
  { name: 'Sat', income: 590 }, { name: 'Sun', income: 510 },
  { name: 'Mon', income: 680 },
];

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // <-- මේක අඩුවෙලා තිබුණේ
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, bookingsRes, resourcesRes] = await Promise.all([
        api.get('/users', { headers }),
        api.get('/bookings/all', { headers }),
        api.get('/resources', { headers })
      ]);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setResources(Array.isArray(resourcesRes.data) ? resourcesRes.data : []);

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const DashboardOverview = () => (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* Upper Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest">v2.4.0 Live</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h2>
          <p className="text-slate-400 text-sm font-medium">Monitoring system performance and real-time user flow.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl p-2 rounded-[2rem] border border-white/60 shadow-sm">
          <div className="flex -space-x-3 ml-2">
             {users.slice(0, 4).map((user, i) => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                 {user.name?.charAt(0) || 'U'}
               </div>
             ))}
          </div>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <button className="flex items-center gap-2 bg-[#0c5252] text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-[1.02] transition-all">
            <Globe size={14}/> Live Traffic
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Bookings" value={bookings.length.toString().padStart(2, '0')} percent="Live" icon={<CalendarCheck size={20}/>} variant="dark" />
            <StatCard label="Active Resources" value={resources.length.toString().padStart(2, '0')} percent="Total" icon={<Layers size={20}/>} variant="white" />
            <StatCard label="Pending Actions" value={bookings.filter(b => b.status === 'PENDING').length.toString().padStart(2, '0')} percent="Review" icon={<TicketCheck size={20}/>} variant="white" />
            <StatCard label="Node Status" value="Online" percent="100%" icon={<ShieldCheck size={20}/>} variant="white" />
          </div>

          {/* Chart Section */}
          <div className="group relative bg-white border border-slate-100 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Growth Trajectory</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Resource Utilization Trends</p>
              </div>
            </div>
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: '700', fill: '#cbd5e1'}} dy={20}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: '700', fill: '#cbd5e1'}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0c5252', borderRadius: '16px', border: 'none', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'}}
                    itemStyle={{color: '#fff', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={5} fill="url(#premiumGradient)" dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-3 space-y-8">
          <div className="relative bg-[#0c5252] p-8 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/40">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">Core Vitals</h4>
                <div className="flex gap-1"><span className="w-1 h-1 rounded-full bg-emerald-400"></span><span className="w-1 h-1 rounded-full bg-emerald-400/30"></span></div>
              </div>
              <div className="space-y-6">
                <ModernHealthBar label="Database" value="Active" color="from-emerald-400 to-teal-400" isText />
                <ModernHealthBar label="API Sync" value="98%" color="from-blue-400 to-indigo-400" />
                <ModernHealthBar label="System Load" value="24%" color="from-yellow-400 to-orange-400" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Bookings</h4>
              <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</button>
            </div>
            <div className="space-y-2">
              {bookings.slice(-4).reverse().map((b, idx) => (
                <MinimalActivityItem 
                  key={idx}
                  title={`${b.userEmail?.split('@')[0]} reserved ${b.resourceId?.substring(0,5)}`} 
                  time={b.status} 
                  color={b.status === 'APPROVED' ? "bg-emerald-500" : "bg-amber-500"} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      <Sidebar location={location} handleLogout={() => { localStorage.clear(); navigate('/login'); }} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} fetchUsers={fetchDashboardData} loading={loading} />
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="/*" element={<DashboardOverview />} />
            <Route path="users" element={<UserDirectory users={users} searchTerm={searchTerm} fetchUsers={fetchDashboardData}/>} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="resources" element={<ResourcesDashboard />} />
            <Route path="tickets" element={<SupportTickets />} />
            <Route path="notifications" element={<AdminNotificationPanel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// --- Sub-Components ---
function StatCard({ label, value, percent, icon, variant }) {
  const isDark = variant === 'dark';
  return (
    <div className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 ${isDark ? 'bg-[#0c5252] border-[#0c5252] shadow-2xl shadow-emerald-900/20' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-8">
        <div className={`p-3 rounded-2xl ${isDark ? 'bg-white/10 text-emerald-400' : 'bg-slate-50 text-[#0c5252]'}`}>{icon}</div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isDark ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>{percent}</span>
      </div>
      <h4 className={`text-3xl font-black tracking-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</h4>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-emerald-200/50' : 'text-slate-400'}`}>{label}</p>
    </div>
  );
}

function ModernHealthBar({ label, value, color, isText }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100/40">{label}</span>
        <span className="text-xs font-black text-white tracking-tighter">{value}</span>
      </div>
      {!isText && (
        <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: value }}></div>
        </div>
      )}
    </div>
  );
}

function MinimalActivityItem({ title, time, color }) {
  return (
    <div className="flex items-center gap-4 bg-white/50 p-4 rounded-[1.5rem] border border-slate-50 group hover:border-emerald-100 transition-all cursor-pointer">
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.1)] group-hover:scale-125 transition-transform`}></div>
      <div className="flex-1">
        <h5 className="text-[11px] font-bold text-slate-800 leading-none truncate max-w-[120px]">{title}</h5>
        <p className="text-[9px] font-medium text-slate-400 mt-1">{time}</p>
      </div>
      <ArrowUpRight size={12} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
    </div>
  );
}

export default AdminDashboard;