import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { 
  CheckCircle, XCircle, Trash2, Calendar as CalIcon, 
  Clock, MessageSquare, ChevronRight, 
  Activity, Filter, ShieldCheck, Fingerprint, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function BookingManagement() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, resourcesRes] = await Promise.all([
        api.get('/bookings/all'),
        api.get('/resources')
      ]);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setResources(Array.isArray(resourcesRes.data) ? resourcesRes.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getResourceName = (resourceId) => {
    const res = resources.find(r => (r.id === resourceId || r._id === resourceId));
    return res ? res.name : "Unknown Resource";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const loadingToast = toast.loading("Deleting record...");
      try {
        await api.delete(`/bookings/${id}`);
        // UI එකෙන් අදාළ item එක අයින් කිරීමේදී id සහ _id දෙකම පරීක්ෂා කරයි
        setBookings(prev => prev.filter(b => b.id !== id && b._id !== id));
        toast.success("Booking deleted successfully", { id: loadingToast });
      } catch (error) {
        toast.error("Delete failed!", { id: loadingToast });
        console.error("Delete error:", error);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus, reason = "") => {
    setIsProcessing(true);
    const loadingToast = toast.loading("Updating status...");
    try {
      await api.put(`/bookings/${id}/status`, null, {
        params: { status: newStatus, reason: reason }
      });
      
      setBookings(prev => prev.map(b => 
        (b.id === id || b._id === id)
          ? { 
              ...b, 
              status: newStatus, 
              rejectionReason: (newStatus === 'REJECTED' || newStatus === 'CANCELLED') ? reason : "" 
            } 
          : b
      ));

      setShowRejectModal(false);
      setRejectReason("");
      toast.dismiss(loadingToast);
      
      if(newStatus === 'APPROVED') toast.success("Booking approved successfully");
      else if(newStatus === 'REJECTED') toast.error("Booking rejected");
      else if(newStatus === 'CANCELLED') toast.error("Booking cancelled");

    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMsg = error.response?.data?.message || "Status update failed!";
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'APPROVED': return { 
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
        dot: 'bg-emerald-500' 
      };
      case 'REJECTED': return { 
        bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', 
        dot: 'bg-rose-500' 
      };
      case 'CANCELLED': return { 
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', 
        dot: 'bg-slate-400' 
      };
      default: return { 
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', 
        dot: 'bg-amber-500' 
      };
    }
  };

  const filteredBookings = activeFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#0c5252]/20 border-t-[#e9c46a] rounded-full animate-spin"></div>
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0c5252]" size={24} />
        </div>
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.5em] text-[#0c5252]/60 animate-pulse">Accessing Vault Records</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Reject/Cancel Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#062424]/90 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h4 className="text-2xl font-black text-[#0c5252] tracking-tighter uppercase italic">Reason <span className="text-rose-500 not-italic">Required</span></h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-6">State the reason for this status modification</p>
            
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold text-[#0c5252] focus:border-[#e9c46a] outline-none transition-all min-h-[120px] resize-none"
              placeholder="Enter justification here..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            
            <div className="flex gap-4 mt-8">
              <button onClick={() => {setShowRejectModal(false); setRejectReason("");}} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Abort</button>
              <button 
                onClick={() => {
                  const booking = bookings.find(b => (b.id === selectedBookingId || b._id === selectedBookingId));
                  handleUpdateStatus(selectedBookingId, booking?.status === 'APPROVED' ? 'CANCELLED' : 'REJECTED', rejectReason);
                }}
                disabled={!rejectReason.trim() || isProcessing}
                className="flex-[2] py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 disabled:opacity-30 shadow-lg shadow-rose-500/20 transition-all"
              >
                Confirm Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0c5252]"></div>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#e9c46a]/5 rounded-full"></div>
        
        <div className="space-y-4 text-center md:text-left z-10">
            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0c5252] animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Resource Control Hub</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Nexus <span className="text-[#0c5252] not-italic">Vault</span>
            </h1>
            <p className="text-slate-500 font-bold max-w-sm text-[11px] uppercase tracking-tight leading-relaxed">
                Centralized oversight for laboratory resources and reservations management.
            </p>
        </div>

        <div className="flex gap-6 z-10">
            <div className="bg-[#0c5252]/5 border border-[#0c5252]/10 p-8 rounded-[2rem] min-w-[170px] text-center">
                <p className="text-[9px] font-black text-[#0c5252]/60 uppercase tracking-[0.2em] mb-2">Total Records</p>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-6 bg-[#e9c46a] rounded-full"></div>
                    <p className="text-5xl font-black text-[#0c5252] tracking-tighter">
                        {bookings.length.toString().padStart(2, '0')}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2 mt-8">
        <div className="flex bg-[#0c5252]/5 p-2 rounded-[1.8rem] border border-[#0c5252]/10 overflow-x-auto no-scrollbar backdrop-blur-sm">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                        activeFilter === tab 
                        ? 'bg-[#0c5252] text-white shadow-xl shadow-[#0c5252]/30' 
                        : 'text-[#0c5252]/40 hover:text-[#0c5252]'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-[#e9c46a]/10 border border-[#e9c46a]/20 rounded-full">
            <Filter size={14} className="text-[#e9c46a]" />
            <span className="text-[9px] font-black text-[#0c5252] uppercase tracking-widest">Protocol Filter</span>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {filteredBookings.map((booking) => {
            const currentId = booking.id || booking._id;
            const status = getStatusConfig(booking.status);
            const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.userEmail)}&background=0c5252&color=fff&bold=true&rounded=true`;

            return (
                <div 
                  key={currentId} 
                  onClick={() => navigate(`/admin/bookings/${currentId}`)}
                  className="group cursor-pointer bg-white rounded-[2.8rem] border border-slate-100 p-8 hover:shadow-[0_40px_80px_-15px_rgba(12,82,82,0.15)] transition-all duration-500 flex flex-col relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-10">
                        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border ${status.bg}`}>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${status.dot}`}></div>
                            <span className="text-[9px] font-black uppercase tracking-widest">{booking.status}</span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(currentId); }}
                            className="p-3 text-slate-300 hover:text-white hover:bg-rose-500 rounded-xl transition-all border border-slate-50 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="space-y-6 flex-grow">
                        <div className="flex items-center gap-4">
                            <div className="relative group/avatar">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-slate-200 to-slate-50 p-[2px] shadow-sm group-hover:rotate-3 transition-transform duration-500">
                                    <div className="w-full h-full rounded-[1.4rem] bg-white overflow-hidden flex items-center justify-center border border-white">
                                        <img 
                                          src={booking.userPhoto || fallbackAvatar} 
                                          className="w-full h-full object-cover" 
                                          alt="User Profile" 
                                          onError={(e) => { e.target.src = fallbackAvatar }}
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div className="overflow-hidden">
                                <h3 className="font-black text-[#0c5252] text-base tracking-tight uppercase truncate">
                                  {getResourceName(booking.resourceId)}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Fingerprint size={10} className="text-[#e9c46a]" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{booking.userEmail}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 border border-slate-100 group-hover:bg-[#0c5252]/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100"><CalIcon size={14} className="text-[#e9c46a]" /></div>
                                <span className="text-sm font-black text-[#0c5252] tracking-tight">{booking.startTime?.split('T')[0]}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100"><Clock size={14} className="text-[#0c5252]" /></div>
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter flex items-center">
                                    {booking.startTime?.split('T')[1]?.substring(0,5)} 
                                    <ChevronRight size={14} className="mx-2 text-[#e9c46a]" />
                                    {booking.endTime?.split('T')[1]?.substring(0,5)}
                                </span>
                            </div>
                        </div>

                        {booking.rejectionReason && (
                            <div className="flex items-start gap-3 p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                                <MessageSquare size={12} className="text-rose-400 mt-0.5 shrink-0" />
                                <p className="text-[10px] font-bold text-rose-800 italic leading-relaxed line-clamp-2">"{booking.rejectionReason}"</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 flex gap-3">
                        {booking.status !== 'APPROVED' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(currentId, 'APPROVED', ""); }}
                                disabled={isProcessing}
                                className="flex-1 py-4 bg-[#0c5252] hover:bg-[#154646] text-white rounded-2xl shadow-xl shadow-[#0c5252]/10 flex items-center justify-center transition-all active:scale-95 group/btn"
                                title="Approve Booking"
                            >
                                <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="ml-2 text-[9px] font-black uppercase tracking-widest">Approve</span>
                            </button>
                        )}
                        {booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedBookingId(currentId); setShowRejectModal(true); }}
                                disabled={isProcessing}
                                className="flex-1 py-4 bg-white border-2 border-[#e9c46a]/30 text-[#e9c46a] hover:bg-[#e9c46a] hover:text-white rounded-2xl flex items-center justify-center transition-all active:scale-95 group/btn"
                                title="Modify Status"
                            >
                                <XCircle size={20} />
                                <span className="ml-2 text-[9px] font-black uppercase tracking-widest">Reject</span>
                            </button>
                        )}
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#e9c46a]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
            );
        })}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="bg-[#0c5252]/5 rounded-[4rem] border-2 border-dashed border-[#0c5252]/10 py-32 flex flex-col items-center justify-center mt-12">
            <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mb-8">
                <Fingerprint size={48} className="text-[#0c5252]/20" />
            </div>
            <h3 className="text-xl font-black text-[#0c5252] uppercase italic tracking-tighter mb-2">Matrix Empty</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0c5252]/40 text-center px-6">Zero transmission data found in current parameters</p>
        </div>
      )}

    </div>
  );
}

export default BookingManagement;