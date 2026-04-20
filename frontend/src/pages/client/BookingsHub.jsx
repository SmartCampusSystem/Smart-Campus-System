import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, PlusCircle, History, 
  CheckCircle2, Timer, XCircle, ArrowRight,
  TrendingUp, LayoutGrid, Loader2
} from 'lucide-react';
import api from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

const BookingsHub = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ active: 0, approved: 0, rejected: 0 });
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchBookingSummary = async () => {
      try {
        // Backend එකේ තියෙන්නේ @GetMapping("/my") නිසා මෙතන endpoint එක නිවැරදි කළා
        const response = await api.get('/bookings/my'); 
        const data = response.data; // මෙතැනට ලැබෙන්නේ List<Booking> එකක්
        
        if (Array.isArray(data)) {
          // 1. Stats ගණනය කිරීම (PENDING, APPROVED, REJECTED)
          const summary = {
            active: data.filter(b => b.status === 'PENDING').length,
            approved: data.filter(b => b.status === 'APPROVED').length,
            rejected: data.filter(b => b.status === 'REJECTED').length,
          };
          setStats(summary);

          // 2. ඉදිරි වැඩකටයුතු (Upcoming Agenda) පෙරා ගැනීම
          const now = new Date();
          const sorted = data
            .filter(b => b.status === 'APPROVED' && new Date(b.startTime) >= now) // අනුමත වූ සහ ඉදිරියට ඇති ඒවා පමණි
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
    fetchBookingSummary();
  }, []);

  // දිනය ලස්සනට පෙන්වීමට (උදා: May 01)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate().toString().padStart(2, '0');
    return { month, day };
  };

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
                <p className="text-white/50 text-[11px] font-medium leading-relaxed">Your requests are reviewed by the department. Typically responds within 24 hours.</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <TrendingUp className="text-[#e9c46a]" size={20} /> Upcoming Agenda
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Upcoming Approved</span>
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
                              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Scheduled</div>
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
                    <p className="text-xs text-slate-400 font-medium mt-1">Browse available departments and secure your slot.</p>
                </div>

                <div onClick={() => navigate('/my-bookings')} className="p-8 bg-white border border-slate-100 rounded-[32px] hover:shadow-xl transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-[#e9c46a]/10 rounded-2xl flex items-center justify-center text-[#e9c46a] mb-4 group-hover:scale-110 transition-transform">
                        <History size={24} />
                    </div>
                    <h5 className="font-black text-slate-900 uppercase tracking-tight">Booking Audit</h5>
                    <p className="text-xs text-slate-400 font-medium mt-1">Review your past activities and reservation logs.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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