import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { 
  ArrowLeft, Calendar, Clock, User, Mail, 
  Info, ShieldCheck, Tag, Activity, CheckCircle, 
  XCircle, AlertCircle, MessageSquare, Fingerprint,
  ShieldAlert, History, Globe, HardDrive
} from 'lucide-react';
import { toast } from 'react-hot-toast';

function AdminBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (error) {
      toast.error("Failed to load booking details");
      navigate('/admin/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus, reason = "") => {
    setIsProcessing(true);
    const loadingToast = toast.loading(`Updating protocol to ${newStatus}...`);
    try {
      await api.put(`/bookings/${id}/status`, null, {
        params: { status: newStatus, reason: reason }
      });
      
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`, { id: loadingToast });
      setShowRejectModal(false);
      setActionReason("");
      fetchBookingDetails(); 
    } catch (error) {
      const msg = error.response?.data?.message || "Status update failed";
      toast.error(msg, { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
       <div className="relative">
          <div className="w-24 h-24 border-4 border-[#0c5252]/5 border-t-[#e9c46a] rounded-full animate-spin"></div>
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0c5252]" size={32} />
       </div>
       <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Decrypting Protocol Records...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 pb-40 animate-in fade-in duration-1000">
      
      {/* Reject/Cancel Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#062424]/80 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-white/20">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
              <ShieldAlert size={40} />
            </div>
            <h4 className="text-3xl font-black text-[#0c5252] tracking-tighter uppercase italic text-center">Status <span className="text-rose-500 not-italic">Override</span></h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 mb-8 text-center px-4">Provide a detailed justification for this protocol modification</p>
            
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-bold text-[#0c5252] focus:border-[#e9c46a] focus:bg-white outline-none transition-all min-h-[140px] resize-none"
              placeholder="Enter administrative reason here..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
            
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Abort</button>
              <button 
                onClick={() => handleUpdateStatus(booking.status === 'APPROVED' ? 'CANCELLED' : 'REJECTED', actionReason)}
                disabled={!actionReason.trim() || isProcessing}
                className="flex-[2] py-5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 disabled:opacity-30 shadow-xl shadow-rose-500/20 transition-all active:scale-95"
              >
                Execute Restriction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
        >
          <ArrowLeft size={18} className="text-[#0c5252] group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Exit Manifest</span>
        </button>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Clearance</span>
            <span className="text-[11px] font-bold text-[#0c5252]">L01 ADMINISTRATOR</span>
          </div>
          <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
          <div className={`px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${
            booking.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${booking.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            {booking.status}
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Detailed Content (LEFT/CENTER) */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(12,82,82,0.05)] border border-slate-100 overflow-hidden">
            
            {/* Redesigned Header */}
            <div className="relative p-10 md:p-20 bg-white border-b border-slate-50">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#0c5252]"></div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#e9c46a]/5 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-[#0c5252]/5 rounded-2xl text-[#0c5252]">
                    <Fingerprint size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#0c5252]/40 uppercase tracking-[0.4em] leading-none mb-1">Resource Manifest</p>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none italic uppercase">
                      Reservation <span className="text-[#0c5252] not-italic">Data.</span>
                    </h1>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</p>
                    <p className="text-sm font-bold text-[#0c5252]">#{booking?.id?.slice(-12).toUpperCase()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                    <p className="text-sm font-bold text-[#e9c46a]">ENCRYPTED</p>
                  </div>
                  <div className="space-y-1 text-right md:text-left md:col-span-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Modified</p>
                    <p className="text-sm font-bold text-slate-600">APRIL 24, 2026 - 03:46 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Info Blocks */}
            <div className="p-10 md:p-20 space-y-20">
              {/* Requester Profile */}
              <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#e9c46a] blur-2xl opacity-20 scale-110"></div>
                  <img 
                    src={booking?.userPhoto || `https://ui-avatars.com/api/?name=${booking?.userEmail}&background=0c5252&color=fff`} 
                    className="relative w-32 h-32 rounded-[3rem] object-cover border-8 border-white shadow-2xl z-10" 
                    alt="Identity" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl z-20 border border-slate-50">
                    <CheckCircle size={20} className="text-emerald-500" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                    <Globe size={12} className="text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Authorized Requesting Entity</span>
                  </div>
                  <h2 className="text-4xl font-black text-[#0c5252] tracking-tight leading-none uppercase">{booking?.userName || 'Standard User'}</h2>
                  <p className="text-lg font-bold text-slate-400 flex items-center gap-3 lowercase">
                    <Mail size={18} className="text-[#e9c46a]" /> {booking?.userEmail}
                  </p>
                </div>
              </div>

              {/* Data Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#e9c46a] shadow-sm mb-8 group-hover:scale-110 transition-transform">
                    <Calendar size={28} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Operation Date</p>
                  <p className="text-3xl font-black text-[#0c5252]">{booking?.startTime?.split('T')[0]}</p>
                  <div className="mt-6 h-[1px] w-full bg-slate-200"></div>
                  <p className="mt-4 text-[9px] font-bold text-slate-400 uppercase">ISO: Standard Gregorian</p>
                </div>

                <div className="group p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#0c5252] shadow-sm mb-8 group-hover:scale-110 transition-transform">
                    <Clock size={28} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Temporal Window</p>
                  <p className="text-3xl font-black text-[#0c5252]">
                    {booking?.startTime?.split('T')[1]?.substring(0,5)} <span className="text-[#e9c46a] mx-2 text-xl">-</span> {booking?.endTime?.split('T')[1]?.substring(0,5)}
                  </p>
                  <div className="mt-6 h-[1px] w-full bg-slate-200"></div>
                  <p className="mt-4 text-[9px] font-bold text-slate-400 uppercase">UTC+05:30 Regional Time</p>
                </div>
              </div>

              {/* Message Note Section */}
              {booking?.rejectionReason && (
                <div className="p-10 bg-rose-50/30 border border-rose-100 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-500">
                    <MessageSquare size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500">
                        <AlertCircle size={20} />
                      </div>
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Protocol Refusal Note</span>
                    </div>
                    <p className="text-2xl font-bold text-rose-950 italic leading-relaxed">"{booking.rejectionReason}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Components (RIGHT SIDE) */}
        <div className="w-full xl:w-96 space-y-8">
          {/* Asset Specs Sidebar */}
          <div className="bg-[#0c5252] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#e9c46a]/20 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <HardDrive size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Asset Profile</span>
              </div>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[9px] font-black text-[#e9c46a] uppercase tracking-widest mb-2">Resource Title</p>
                  <h4 className="text-3xl font-black uppercase italic leading-tight">{booking?.resourceName || 'System Asset'}</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter mb-1">Class</p>
                    <p className="text-xs font-black uppercase tracking-widest">{booking?.resourceType || 'General'}</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-tighter mb-1">Priority</p>
                    <p className="text-xs font-bold text-[#e9c46a] uppercase italic">Critical</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Verification</p>
                      <p className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                        <CheckCircle size={14} className="text-[#e9c46a]" /> Secure
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center italic font-black text-[10px] border border-white/20">
                      V.02
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Card */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                 <History size={18} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Integrity</span>
             </div>
             
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1 bg-[#e9c46a] rounded-full"></div>
                  <div>
                    <p className="text-[10px] font-black text-[#0c5252] uppercase">Protocol Generated</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Status: Success</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="text-[10px] font-black text-[#0c5252] uppercase">Security Scanned</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Status: Clear</p>
                  </div>
                </div>
             </div>
             
             <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">
                 Administrative approval is logged with timestamp for compliance.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar (FIXED & ANIMATED) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[95] w-full max-w-3xl px-6 animate-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-[#0c5252]/90 backdrop-blur-2xl rounded-[2.5rem] p-5 shadow-[0_30px_60px_-15px_rgba(12,82,82,0.6)] flex items-center gap-4 border border-white/20">
          
          <div className="hidden sm:flex items-center gap-4 px-6 border-r border-white/10 mr-2">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck size={20} className="text-[#e9c46a]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Auth Level</span>
              <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Admin L.01</span>
            </div>
          </div>

          <div className="flex-1 flex gap-4">
            {booking?.status !== 'APPROVED' && (
              <button 
                onClick={() => handleUpdateStatus('APPROVED', "")}
                disabled={isProcessing}
                className="flex-1 py-4 bg-[#e9c46a] hover:bg-white text-[#0c5252] rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group font-black uppercase text-[11px] tracking-widest shadow-xl"
              >
                <CheckCircle size={20} className="group-hover:rotate-12 transition-transform" />
                Authorize Protocol
              </button>
            )}

            {(booking?.status === 'PENDING' || booking?.status === 'APPROVED') && (
              <button 
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                className="flex-1 py-4 bg-white/5 hover:bg-rose-500 text-white rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group border border-white/10 font-black uppercase text-[11px] tracking-widest"
              >
                <XCircle size={20} className="group-hover:scale-110 transition-transform" />
                {booking.status === 'APPROVED' ? 'Terminate' : 'Refuse Access'}
              </button>
            )}
          </div>
          
          <button className="w-16 h-16 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl flex items-center justify-center transition-all group shrink-0">
            <Info size={24} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminBookingDetails;