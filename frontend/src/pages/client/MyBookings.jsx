"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for redirection
import { toast } from 'react-hot-toast';
import { 
    Calendar, Clock, Package, AlertCircle, CheckCircle2, 
    XCircle, Timer, Sparkles, Box, ShieldCheck, 
    ArrowLeft, Search, Hash, ChevronRight
} from 'lucide-react';
import api from '../../api/axiosInstance';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    
    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings/my');
            if (Array.isArray(response.data)) {
                setBookings(response.data);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else {
                toast.error("Failed to load booking data.");
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchesSearch = b.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                b.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = activeFilter === "ALL" || b.status === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [bookings, searchTerm, activeFilter]);

    const stats = {
        total: bookings.length,
        approved: bookings.filter(b => b.status === 'APPROVED').length,
        pending: bookings.filter(b => b.status === 'PENDING').length
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100';
            case 'PENDING': return 'text-amber-700 bg-amber-50 border-amber-200 shadow-sm shadow-amber-100';
            case 'REJECTED': return 'text-rose-700 bg-rose-50 border-rose-200 shadow-sm shadow-rose-100';
            case 'CANCELLED': return 'text-slate-500 bg-slate-50 border-slate-200 shadow-sm shadow-slate-100';
            default: return 'text-slate-500 bg-slate-50 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-[#fcfcfd]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-[#0c5252] rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em] animate-pulse">Syncing Timeline</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">Fetching secure data assets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 selection:bg-[#0c5252] selection:text-white">
            <div className="max-w-7xl mx-auto p-6 md:p-12">
                
                {/* Header & Stat Cards */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
                    <div className="space-y-6">
                        <button onClick={() => window.history.back()} className="group flex items-center gap-3 text-slate-400 hover:text-[#0c5252] transition-all">
                            <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:bg-[#0c5252] group-hover:text-white transition-all duration-300">
                                <ArrowLeft size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Dashboard</span>
                        </button>
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0c5252] via-emerald-600 to-teal-500 italic">Timeline</span>
                        </h1>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                        <StatBox label="Total Assets" value={stats.total} icon={<Hash size={16}/>} color="emerald" />
                        <StatBox label="Approved" value={stats.approved} icon={<CheckCircle2 size={16}/>} color="emerald" />
                        <StatBox label="Awaiting" value={stats.pending} icon={<Timer size={16}/>} color="amber" />
                    </div>
                </div>

                {/* Glass Filter Bar */}
                <div className="bg-white/80 backdrop-blur-md p-3 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/60 mb-12 flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by resource name or reference code..." 
                            className="w-full pl-16 pr-6 py-4.5 bg-slate-50/50 border-none rounded-[1.8rem] text-sm font-bold focus:ring-2 focus:ring-[#0c5252]/10 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/50 rounded-[1.8rem] w-full lg:w-auto overflow-x-auto no-scrollbar">
                        {/* CANCELLED filter added here */}
                        {["ALL", "APPROVED", "PENDING", "REJECTED", "CANCELLED"].map((f) => (
                            <button 
                                key={f} 
                                onClick={() => setActiveFilter(f)} 
                                className={`px-8 py-3.5 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === f ? 'bg-[#0c5252] text-white shadow-lg shadow-[#0c5252]/30' : 'text-slate-400 hover:text-slate-600 hover:bg-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Bookings List */}
                    <div className="lg:col-span-8 space-y-6">
                        {filteredBookings.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3.5rem] p-32 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Box size={40} className="text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">No records found</h3>
                                <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Try adjusting your search filters</p>
                            </div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <div 
                                    key={booking.id} 
                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                    className="group cursor-pointer relative bg-white rounded-[2.8rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5"
                                >
                                    <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                                        
                                        {/* Status Icon Indicator */}
                                        <div className="relative shrink-0">
                                            <div className="w-24 h-24 rounded-[2.2rem] bg-slate-50 flex items-center justify-center text-[#0c5252] group-hover:bg-[#0c5252] group-hover:text-white transition-all duration-700 shadow-inner">
                                                <Package size={40} strokeWidth={1.2} />
                                            </div>
                                            <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${booking.status === 'APPROVED' ? 'bg-emerald-500' : booking.status === 'PENDING' ? 'bg-amber-500' : booking.status === 'REJECTED' ? 'bg-rose-500' : 'bg-slate-400'}`}>
                                                {booking.status === 'APPROVED' ? <CheckCircle2 size={14} className="text-white" /> : booking.status === 'PENDING' ? <Timer size={14} className="text-white" /> : booking.status === 'REJECTED' ? <XCircle size={14} className="text-white" /> : <XCircle size={14} className="text-white" />}
                                            </div>
                                        </div>

                                        {/* Information Section */}
                                        <div className="flex-1 text-center md:text-left space-y-4">
                                            <div>
                                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                                    <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight uppercase group-hover:text-[#0c5252] transition-colors">
                                                        {booking.resourceName || "Unidentified Asset"}
                                                    </h4>
                                                    <span className={`w-fit mx-auto md:mx-0 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusStyles(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                                                        <Hash size={14} className="text-emerald-500"/> 
                                                        REF-{booking.id.toString().slice(-8).toUpperCase()} 
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                                                        <span className="opacity-60">Booked by:</span> {booking.userEmail}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                                <InfoPill icon={<Calendar size={14}/>} text={new Date(booking.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} />
                                                <InfoPill icon={<Clock size={14}/>} text={`${new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
                                            </div>
                                        </div>

                                        <div className="hidden md:block">
                                            <div className="p-3 rounded-2xl bg-slate-50 text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                                <ChevronRight size={24} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rejection/Cancellation Reason Overlay */}
                                    {(booking.status === 'REJECTED' || booking.status === 'CANCELLED') && booking.rejectionReason && (
                                        <div className="mx-8 mb-8 p-5 bg-rose-50/50 rounded-[2rem] border border-rose-100 flex items-start gap-4">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                                <AlertCircle size={18} className="text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Feedback</p>
                                                <p className="text-sm font-bold text-rose-800 italic leading-relaxed">
                                                    "{booking.rejectionReason}"
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right Sticky Panel */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-12 space-y-8">
                            {/* Schedule Summary Card */}
                            <div className="bg-[#0c5252] p-10 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(12,82,82,0.3)] relative overflow-hidden text-white">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Sparkles size={120} />
                                </div>
                                <h4 className="text-emerald-300 text-[11px] font-black uppercase tracking-[0.4em] mb-10">Upcoming Schedule</h4>
                                <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                                    {filteredBookings.filter(b => b.status === 'APPROVED').slice(0, 3).map((b, idx) => (
                                        <div key={idx} className="relative pl-10 group/item cursor-pointer" onClick={() => navigate(`/bookings/${b.id}`)}>
                                            <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-[#0c5252] border-4 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] group-hover/item:scale-125 transition-transform"></div>
                                            <p className="text-sm font-black leading-tight truncate group-hover/item:text-emerald-300 transition-colors">{b.resourceName}</p>
                                            <p className="text-emerald-300/50 text-[10px] font-bold mt-1.5 uppercase tracking-widest">
                                                {new Date(b.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}
                                    {filteredBookings.filter(b => b.status === 'APPROVED').length === 0 && (
                                        <div className="pl-10">
                                            <p className="text-white/40 text-[11px] font-bold uppercase italic tracking-widest leading-relaxed">No active allocations found in your timeline</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Trust Badge */}
                            <div className="bg-white p-8 rounded-[2.8rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-colors">
                                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform duration-500"><ShieldCheck size={24}/></div>
                                <div>
                                    <h4 className="text-slate-800 text-[12px] font-black uppercase tracking-widest mb-1">Secure Protocol</h4>
                                    <p className="text-slate-400 text-[11px] font-semibold leading-relaxed">Audit-ready records locked with end-to-end verification.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, icon, color }) => (
    <div className="bg-white px-8 py-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 cursor-default">
        <div className={`p-4 rounded-2xl bg-slate-50 transition-all duration-500 group-hover:scale-110 ${color === 'emerald' ? 'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 'text-amber-600 group-hover:bg-amber-600 group-hover:text-white'}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">{value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        </div>
    </div>
);

const InfoPill = ({ icon, text }) => (
    <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold text-[11px] hover:bg-white hover:shadow-sm transition-all duration-300">
        <span className="text-[#0c5252]">{icon}</span>
        <span className="uppercase tracking-wide">{text}</span>
    </div>
);

export default MyBookings;