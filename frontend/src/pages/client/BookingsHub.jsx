"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, PlusCircle, History, 
  CheckCircle2, Timer, XCircle, ArrowRight,
  TrendingUp, LayoutGrid, Loader2, ShieldCheck, 
  Sparkles, Zap, Users, Globe, Award, MousePointer2,
  Command, Box, Activity
} from 'lucide-react';
import api from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

const BookingsHub = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({ active: 0, approved: 0, rejected: 0 });
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      fetchBookingSummary();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const fetchBookingSummary = async () => {
    try {
      const response = await api.get('/bookings/my'); 
      const data = response.data;
      
      if (Array.isArray(data)) {
        setStats({
          active: data.filter(b => b.status === 'PENDING').length,
          approved: data.filter(b => b.status === 'APPROVED').length,
          rejected: data.filter(b => b.status === 'REJECTED').length,
        });

        const now = new Date();
        const sorted = data
          .filter(b => b.status === 'APPROVED' && new Date(b.startTime) >= now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .slice(0, 3);
        setUpcoming(sorted);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate().toString().padStart(2, '0');
    return { month, day };
  };

  // --- RENDERING UNIQUE GUEST VIEW ---
  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] font-sans selection:bg-[#0c5252] selection:text-white overflow-hidden">
        <Navbar />
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#0c5252]/5 to-transparent -z-10"></div>
        <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-[#e9c46a]/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        
        <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
                <Command size={14} className="text-[#0c5252]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Resource Management</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                RESERVE <br/> 
                <span className="text-[#0c5252] italic font-light">EXCELLENCE.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                Streamlining your access to campus laboratories, creative studios, and technical assets with precision.
              </p>
            </div>

            {/* Feature Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <Box size={24} />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Asset Hub</h4>
                <p className="text-xs text-slate-400 mt-2 font-medium">Real-time inventory of all campus resources.</p>
              </div>

              <div className="p-8 bg-[#0c5252] rounded-[2.5rem] text-white flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500 shadow-2xl shadow-[#0c5252]/20">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Activity size={24} className="text-[#e9c46a]" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tighter text-xl">Live Flux</h4>
                  <p className="text-xs text-white/50 mt-2 font-medium">Instant synchronization with department schedules.</p>
                </div>
              </div>

              <div className="col-span-2 p-8 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between group cursor-pointer overflow-hidden relative shadow-lg shadow-slate-100" onClick={() => navigate('/login')}>
                <div className="relative z-10">
                  <h4 className="font-black text-slate-900 uppercase tracking-tighter text-2xl italic">Ready to deploy?</h4>
                  <p className="text-sm text-slate-400 font-medium">Authentication required to access booking engine.</p>
                </div>
                <div className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                  <ArrowRight size={24} />
                </div>
                <div className="absolute top-0 right-0 w-32 h-full bg-[#e9c46a]/5 -skew-x-12 translate-x-10"></div>
              </div>
            </div>
          </div>

          {/* Call to Action Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between p-2 bg-white border border-slate-100 rounded-[2rem] shadow-sm mb-20">
            <div className="flex items-center gap-6 px-6 py-4">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                <span className="text-[#0c5252]">50+</span> Resources Available Today
              </p>
            </div>
            <div className="flex gap-2 p-2 w-full md:w-auto">
              <button 
                onClick={() => navigate('/resources')}
                className="flex-1 px-8 py-4 bg-slate-50 text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
              >
                Browse Catalog
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="flex-1 px-10 py-4 bg-[#0c5252] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#0c5252]/20 hover:scale-[1.02] transition-all"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Social Proof / Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
             <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-black text-slate-900">99%</span>
                <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-slate-500">Uptime Rate</span>
             </div>
             <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-black text-slate-900">2.4k</span>
                <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-slate-500">Monthly Bookings</span>
             </div>
             <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-black text-slate-900">12</span>
                <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-slate-500">Departments</span>
             </div>
             <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-black text-slate-900">0.8s</span>
                <span className="text-[9px] font-bold uppercase tracking-widest mt-1 text-slate-500">Latency</span>
             </div>
          </div>
        </main>
      </div>
    );
  }

  // --- RENDERING USER VIEW (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-[#f8fafa] font-sans selection:bg-[#0c5252] selection:text-white">
      <Navbar />
      <div className="h-32"></div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[2px] bg-[#e9c46a]"></span>
              <span className="text-[10px] font-black text-[#0c5252] uppercase tracking-[0.3em]">Management Suite</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
              Booking <span className="text-[#0c5252] not-italic">Hub.</span>
            </h1>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/resources')}
              className="flex items-center gap-2 px-6 py-3 bg-[#0c5252] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#0c5252]/20 hover:scale-105 transition-all"
            >
              <PlusCircle size={16} /> New Reservation
            </button>
            <button 
              onClick={() => navigate('/my-bookings')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#0c5252] border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <History size={16} /> Full History
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <StatCard 
              label="Pending Approval" 
              value={stats.active} 
              icon={<Timer className="text-amber-500" />} 
              bgColor="bg-amber-50"
            />
            <StatCard 
              label="Confirmed Slots" 
              value={stats.approved} 
              icon={<CheckCircle2 className="text-emerald-500" />} 
              bgColor="bg-emerald-50"
            />
            <StatCard 
              label="Declined Logs" 
              value={stats.rejected} 
              icon={<XCircle className="text-rose-500" />} 
              bgColor="bg-rose-50"
            />

            <div className="mt-8 p-8 bg-gradient-to-br from-[#0c5252] to-[#1a3d3d] rounded-[32px] text-white relative overflow-hidden shadow-2xl">
                <LayoutGrid className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32 rotate-12" />
                <h4 className="text-lg font-black mb-2 uppercase tracking-tight leading-tight">Optimization in Progress</h4>
                <p className="text-white/50 text-[11px] font-medium leading-relaxed">Your requests are currently under review by the department. Typical response time is under 24 hours.</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <TrendingUp className="text-[#e9c46a]" size={20} /> Upcoming Agenda
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Live Schedule</span>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin mb-4 text-[#0c5252]" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fetching Logs...</span>
                </div>
              ) : upcoming.length > 0 ? (
                <div className="space-y-4">
                  {upcoming.map((item, idx) => {
                    const { month, day } = formatDate(item.startTime);
                    return (
                      <div key={idx} className="group flex items-center gap-6 p-6 rounded-[2rem] border border-slate-50 hover:bg-slate-50/80 transition-all cursor-default">
                        <div className="w-16 h-16 rounded-2xl bg-[#0c5252]/5 flex flex-col items-center justify-center text-[#0c5252]">
                           <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">{month}</span>
                           <span className="text-xl font-black">{day}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg group-hover:text-[#0c5252] transition-colors">{item.resourceName || "Academic Asset"}</h4>
                          <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                  <Clock size={12} className="text-[#e9c46a]" /> 
                                  {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Confirmed</div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all">
                          <ArrowRight size={20} className="text-slate-300" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                   <Calendar className="mx-auto text-slate-200 mb-4" size={40} />
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No Upcoming Reservations</p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div onClick={() => navigate('/resources')} className="p-8 bg-white border border-slate-100 rounded-[32px] hover:shadow-xl transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                        <PlusCircle size={24} />
                    </div>
                    <h5 className="font-black text-slate-900 uppercase tracking-tight">Need a Space?</h5>
                    <p className="text-xs text-slate-400 font-medium mt-1">Explore available campus facilities and book your next session.</p>
                </div>

                <div onClick={() => navigate('/my-bookings')} className="p-8 bg-white border border-slate-100 rounded-[32px] hover:shadow-xl transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-[#e9c46a]/10 rounded-2xl flex items-center justify-center text-[#e9c46a] mb-4 group-hover:scale-110 transition-transform">
                        <History size={24} />
                    </div>
                    <h5 className="font-black text-slate-900 uppercase tracking-tight">Activity Log</h5>
                    <p className="text-xs text-slate-400 font-medium mt-1">Review your booking history and current reservation status.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---
const StatCard = ({ label, value, icon, bgColor }) => (
  <div className="p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-all bg-white italic">
    <div className={`w-14 h-14 ${bgColor} rounded-[1.5rem] flex items-center justify-center`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 italic">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value.toString().padStart(2, '0')}</p>
    </div>
  </div>
);

export default BookingsHub;