"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { 
  Wrench, Activity, ArrowUpRight, Globe, CalendarCheck, 
  Ticket, CheckCircle, Clock, AlertCircle, MessageSquare,
  User, LogOut, Menu, X, Edit, Save, Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Components
import TechnicianSidebar from './TechnicianSidebar';
import TechnicianHeader from './TechnicianHeader';
import TechnicianTickets from './TechnicianTickets';
import TechnicianInProgress from './TechnicianInProgress';
import TechnicianResolved from './TechnicianResolved';
import TechnicianClose from './TechnicianClose';

function TechnicianDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [technicianName, setTechnicianName] = useState('Technician');
  const [graphData, setGraphData] = useState([
    { name: 'Mon', tickets: 0 }, { name: 'Tue', tickets: 0 },
    { name: 'Wed', tickets: 0 }, { name: 'Thu', tickets: 0 },
    { name: 'Fri', tickets: 0 }, { name: 'Sat', tickets: 0 },
    { name: 'Sun', tickets: 0 },
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setTechnicianName(user.name || user.email?.split('@')[0] || 'Technician');
    }
  }, []);

  const fetchTechnicianData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch tickets first
      const ticketsRes = await api.get('/tickets/assigned', { headers });
      setTickets(Array.isArray(ticketsRes.data) ? ticketsRes.data : []);
      
      // Try to fetch weekly data, but don't fail if it doesn't work
      try {
        const weeklyRes = await api.get('/tickets/weekly', { headers });
        console.log('Weekly API response:', weeklyRes);
        
        if (weeklyRes.data && Array.isArray(weeklyRes.data) && weeklyRes.data.length > 0) {
          console.log('Setting graph data from API:', weeklyRes.data);
          setGraphData(weeklyRes.data);
        } else {
          console.log('Weekly API returned no data, generating from tickets');
          // Generate weekly data from assigned tickets
          generateWeeklyDataFromTickets(ticketsRes.data);
        }
      } catch (weeklyError) {
        console.log('Weekly API failed, generating from tickets:', weeklyError);
        // Generate weekly data from assigned tickets
        generateWeeklyDataFromTickets(ticketsRes.data);
      }
    } catch (error) {
      console.error('Error fetching technician data:', error);
      toast.error('Failed to load dashboard data');
      // Set fallback data with specific example (5 vs 10 tickets) to test exact proportional scaling
      setGraphData([
        { name: 'Mon', tickets: 2 }, { name: 'Tue', tickets: 5 },
        { name: 'Wed', tickets: 3 }, { name: 'Thu', tickets: 5 },
        { name: 'Fri', tickets: 10 }, { name: 'Sat', tickets: 1 },
        { name: 'Sun', tickets: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyDataFromTickets = (tickets) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const currentDayIndex = now.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
    const mondayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1; // Adjust to make Monday=0
    
    const weeklyData = days.map((day, index) => {
      // Calculate the actual date for this day of the week
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - mondayIndex + index);
      
      // Count tickets created on this specific day
      const dayTickets = tickets.filter(ticket => {
        if (!ticket.createdAt) return false;
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate.toDateString() === dayDate.toDateString();
      }).length;
      
      return { name: day, tickets: dayTickets };
    });
    console.log('Generated weekly data from actual tickets:', weeklyData);
    setGraphData(weeklyData);
  };

  useEffect(() => {
    fetchTechnicianData();
  }, []);

  // Refresh chart data whenever tickets are updated
  useEffect(() => {
    if (tickets.length > 0) {
      // Re-generate weekly data when tickets change
      generateWeeklyDataFromTickets(tickets);
    }
  }, [tickets]);

  const DashboardOverview = () => (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* Upper Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest">v2.4.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{technicianName}'s Dashboard</h2>
          <p className="text-slate-400 text-sm font-medium">Manage assigned tickets and resolution workflows.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl p-2 rounded-[2rem] border border-white/60 shadow-sm">
          <div className="flex -space-x-3 ml-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0c5252] flex items-center justify-center text-[10px] font-bold text-white">
              {technicianName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <button className="flex items-center gap-2 bg-[#0c5252] text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-[1.02] transition-all">
            <Activity size={14}/> Active Tickets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Assigned Tickets" 
              value={tickets.length.toString().padStart(2, '0')} 
              percent="Active" 
              icon={<Ticket size={20}/>} 
              variant="dark" 
            />
            <StatCard 
              label="In Progress" 
              value={tickets.filter(t => t.status === 'IN_PROGRESS').length.toString().padStart(2, '0')} 
              percent="Working" 
              icon={<Clock size={20}/>} 
              variant="white" 
            />
            <StatCard 
              label="Resolved" 
              value={tickets.filter(t => t.status === 'RESOLVED').length.toString().padStart(2, '0')} 
              percent="Complete" 
              icon={<CheckCircle size={20}/>} 
              variant="white" 
            />
            <StatCard 
              label="Close" 
              value={tickets.filter(t => t.status === 'CLOSED').length.toString().padStart(2, '0')} 
              percent="Review" 
              icon={<AlertCircle size={20}/>} 
              variant="white" 
            />
          </div>

          {/* Chart Section */}
          <div className="group relative bg-white border border-slate-100 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Ticket Trends</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Weekly Ticket Distribution</p>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <div className="flex items-end justify-between h-full px-4">
                {console.log('Rendering chart with graphData:', graphData)}
                {graphData.map((item, index) => {
                  const maxTickets = Math.max(...graphData.map(d => d.tickets), 1);
                  // Use absolute pixel heights for dramatic visual differences
                  const maxHeight = 280; // Maximum height in pixels
                  const exactHeight = (item.tickets / maxTickets) * maxHeight;
                  
                  console.log(`Bar ${item.name}: tickets=${item.tickets}, max=${maxTickets}, height=${exactHeight.toFixed(1)}px`);
                  console.log(`Example: If max=${maxTickets}, then 5 tickets = ${(5/maxTickets*maxHeight).toFixed(1)}px, 10 tickets = ${(10/maxTickets*maxHeight).toFixed(1)}px`);
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-[#0c5252] to-emerald-400 rounded-t-lg transition-all hover:from-emerald-500 hover:to-emerald-300"
                        style={{ 
                          height: `${exactHeight}px`, // Absolute pixel height for clear visual differences
                          minHeight: item.tickets > 0 ? '8px' : '0px' // Minimum visible height
                        }}
                        title={`${item.name}: ${item.tickets} tickets (${exactHeight.toFixed(1)}px)`}
                      ></div>
                      <span className="text-xs text-slate-600 mt-2">{item.name}</span>
                      <span className="text-xs font-bold text-emerald-600">{item.tickets}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <TechnicianTickets 
            tickets={tickets} 
            setTickets={setTickets}
            searchTerm={searchTerm}
            loading={loading}
            fetchTickets={fetchTechnicianData}
          />
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-3 space-y-8">
          <div className="relative bg-[#0c5252] p-8 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/40">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300">Work Status</h4>
                <div className="flex gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <span className="w-1 h-1 rounded-full bg-emerald-400/30"></span>
                </div>
              </div>
              <div className="space-y-6">
                <ModernHealthBar label="Active Tickets" value={tickets.filter(t => t.status === 'IN_PROGRESS').length.toString()} color="from-emerald-400 to-teal-400" />
                <ModernHealthBar label="Close Review" value={tickets.filter(t => t.status === 'CLOSED').length.toString()} color="from-yellow-400 to-orange-400" />
                <ModernHealthBar label="Completed Today" value={tickets.filter(t => t.status === 'RESOLVED' && new Date(t.updatedAt).toDateString() === new Date().toDateString()).length.toString()} color="from-blue-400 to-indigo-400" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Activity</h4>
              <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</button>
            </div>
            <div className="space-y-2">
              {tickets.slice(-4).reverse().map((ticket, idx) => (
                <MinimalActivityItem 
                  key={idx}
                  title={ticket.title} 
                  time={ticket.status} 
                  color={ticket.status === 'RESOLVED' ? "bg-emerald-500" : ticket.status === 'IN_PROGRESS' ? "bg-blue-500" : "bg-amber-500"} 
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
      <TechnicianSidebar 
        location={location} 
        handleLogout={() => { 
          localStorage.clear(); 
          navigate('/login'); 
        }} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TechnicianHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          fetchTickets={fetchTechnicianData} 
          loading={loading}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="tickets" element={<TechnicianTickets 
              tickets={tickets} 
              setTickets={setTickets}
              searchTerm={searchTerm}
              loading={loading}
              fetchTickets={fetchTechnicianData}
            />} />
            <Route path="in-progress" element={<TechnicianInProgress 
              tickets={tickets} 
              setTickets={setTickets}
              searchTerm={searchTerm}
              loading={loading}
              fetchTickets={fetchTechnicianData}
            />} />
            <Route path="resolved" element={<TechnicianResolved 
              tickets={tickets} 
              setTickets={setTickets}
              searchTerm={searchTerm}
              loading={loading}
              fetchTickets={fetchTechnicianData}
            />} />
            <Route path="close" element={<TechnicianClose 
              tickets={tickets} 
              setTickets={setTickets}
              searchTerm={searchTerm}
              loading={loading}
              fetchTickets={fetchTechnicianData}
            />} />
            <Route path="/*" element={<DashboardOverview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

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

function ModernHealthBar({ label, value, color }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100/40">{label}</span>
        <span className="text-xs font-black text-white tracking-tighter">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${Math.min(parseInt(value) * 10, 100)}%` }}></div>
      </div>
    </div>
  );
}

function MinimalActivityItem({ title, time, color }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{title}</span>
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase">{time}</span>
    </div>
  );
}

export default TechnicianDashboard;
