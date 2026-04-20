import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
    Calendar, Clock, Package, AlertCircle, CheckCircle2, 
    XCircle, Timer, Sparkles, Box, ShieldCheck, 
    ArrowRight, ArrowLeft 
} from 'lucide-react';
import api from '../../api/axiosInstance';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const getStatusStyles = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-emerald-700 bg-emerald-100/50 border-emerald-200 ring-emerald-500/10';
            case 'PENDING': return 'text-amber-700 bg-amber-100/50 border-amber-200 ring-amber-500/10';
            case 'REJECTED': return 'text-rose-700 bg-rose-100/50 border-rose-200 ring-rose-500/10';
            case 'CANCELLED': return 'text-slate-500 bg-slate-100 border-slate-200';
            default: return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 size={14} className="text-emerald-600" />;
            case 'PENDING': return <Timer size={14} className="animate-spin-slow text-amber-600" />;
            case 'REJECTED': return <XCircle size={14} className="text-rose-600" />;
            default: return <AlertCircle size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-[#0c5252] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#0c5252] rounded-full"></div>
                    </div>
                </div>
                <p className="text-slate-500 font-semibold tracking-tight animate-pulse text-sm">Syncing your reservations...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-5 md:p-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* Back Button */}
            <button 
                onClick={() => window.history.back()} 
                className="group flex items-center gap-2 mb-8 text-slate-400 hover:text-[#0c5252] transition-all duration-300"
            >
                <div className="p-2 rounded-full bg-slate-50 group-hover:bg-[#0c5252]/10 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Back to Dashboard</span>
            </button>

            {/* Header Section */}
            <header className="mb-12 relative">
                <div className="flex items-center gap-3 mb-3">
                    <span className="h-[2px] w-10 bg-[#0c5252] rounded-full"></span>
                    <span className="text-xs font-black text-[#0c5252] uppercase tracking-[0.3em]">Institutional Hub</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
                            My <span className="text-[#0c5252] italic font-serif">Reservations</span>
                        </h1>
                        <p className="text-slate-500 text-base font-medium max-w-md">
                            Monitor the status of your equipment and facility requests in real-time.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Cloud Synchronized</span>
                    </div>
                </div>
            </header>

            {bookings.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center group hover:border-[#0c5252]/30 transition-all duration-500 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300 group-hover:scale-110 group-hover:bg-[#0c5252]/5 transition-all duration-500">
                        <Box size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">No Reservations Found</h3>
                    <p className="text-slate-400 text-sm mt-3 max-w-xs mx-auto font-medium leading-relaxed">
                        Your booking history is currently empty. Start by reserving a resource from the catalog.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="p-7 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource Details</th>
                                    <th className="p-7 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                                    <th className="p-7 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-[#fafbfc] transition-all duration-300">
                                        <td className="p-7">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[#0c5252] group-hover:bg-[#0c5252] group-hover:text-white transition-all duration-500">
                                                        <Package size={26} strokeWidth={1.5} />
                                                    </div>
                                                    {booking.status === 'APPROVED' && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                                            <Sparkles size={10} className="text-white fill-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-[13px] font-extrabold text-slate-800 uppercase tracking-tight leading-none group-hover:text-[#0c5252] transition-colors">
                                                        {booking.resourceName || "Resource Asset"}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[9px] font-bold font-mono tracking-tighter border border-slate-200 uppercase">
                                                            REF: {booking.id.toString().slice(-8).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-7">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2.5 text-slate-700">
                                                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                                                        <Calendar size={14} />
                                                    </div>
                                                    <span className="text-[13px] font-bold tracking-tight">
                                                        {new Date(booking.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-slate-400">
                                                    <div className="p-1.5 bg-transparent rounded-lg">
                                                        <Clock size={14} />
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        <ArrowRight size={10} className="text-slate-300" />
                                                        {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-7">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className={`flex items-center gap-2.5 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm transition-all duration-300 ${getStatusStyles(booking.status)}`}>
                                                    {getStatusIcon(booking.status)}
                                                    {booking.status}
                                                </div>
                                                {booking.rejectionReason && (
                                                    <div className="max-w-[180px] text-center">
                                                        <p className="text-[10px] font-semibold text-rose-500 bg-rose-50/50 px-3 py-1.5 rounded-lg border border-rose-100/50 italic leading-snug">
                                                            " {booking.rejectionReason} "
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <footer className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-300/30"></div>
                                ))}
                            </div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Totaling {bookings.length} reservations
                            </span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.1em]">Verified End-to-End</span>
                        </div>
                    </footer>
                </div>
            )}
        </div>
    );
};

export default MyBookings;