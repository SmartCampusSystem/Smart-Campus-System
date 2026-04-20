import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { CheckCircle, XCircle, Trash2, Calendar as CalIcon, Loader2, Clock, Hash, MessageSquare } from 'lucide-react';

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

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
      try {
        await api.delete(`/bookings/${id}`);
        setBookings(prev => prev.filter(b => b.id !== id));
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  // මූලික වෙනස සිදු කළ Function එක
  const handleUpdateStatus = async (id, newStatus, reason = "") => {
    try {
      // Backend එකට දත්ත යැවීම
      await api.put(`/bookings/${id}/status`, null, {
        params: { status: newStatus, reason: reason }
      });
      
      // Frontend State එක Update කිරීම
      setBookings(prev => prev.map(b => 
        b.id === id 
          ? { 
              ...b, 
              status: newStatus, 
              // මෙතැනදී status එක APPROVED නම් reason එක හිස් කරයි
              rejectionReason: newStatus === 'REJECTED' ? reason : "" 
            } 
          : b
      ));

      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      alert("Status update failed!");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/10';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100 ring-rose-500/10';
      default: return 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[2.5rem] border border-slate-100">
        <Loader2 className="w-10 h-10 text-[#0c5252] animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Reservation Matrix</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 relative">
      
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Rejection Reason</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-balance">Please provide a brief explanation for declining this request.</p>
            
            <textarea 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all min-h-[120px]"
              placeholder="e.g. Maintenance scheduled for this time slot..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedBookingId, 'REJECTED', rejectReason)}
                disabled={!rejectReason.trim()}
                className="flex-1 py-4 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 disabled:opacity-50 transition-all shadow-lg shadow-rose-500/20"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-gradient-to-br from-white to-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#e9c46a]"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nexus Resource Control</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Nexus <span className="text-[#0c5252]">Reservations.</span></h3>
          </div>
          <div className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] shadow-xl shadow-slate-900/10">
            <span className="text-[10px] font-black tracking-[0.2em] opacity-60 block mb-1 uppercase">Active Logs</span>
            <span className="text-2xl font-black">{bookings.length.toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-8 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identification</th>
                <th className="py-8 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Schedule</th>
                <th className="py-8 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification</th>
                <th className="py-8 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="group hover:bg-[#fcfdfd] transition-all duration-300">
                  <td className="py-10 px-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0c5252] border border-slate-100 font-black"><Hash size={16} /></div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-[15px] uppercase tracking-tight leading-none mb-2">{getResourceName(booking.resourceId)}</span>
                        <span className="text-[10px] font-black text-[#0c5252] uppercase tracking-widest bg-[#0c5252]/5 px-2 py-1 rounded-md w-fit">{booking.userEmail}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-10 px-8">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2"><CalIcon size={14} className="text-[#e9c46a]" /><span className="text-[13px] font-black text-slate-700 uppercase tracking-tight">{booking.startTime?.split('T')[0]}</span></div>
                      <div className="flex items-center gap-2"><Clock size={14} className="text-slate-300" /><span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{booking.startTime?.split('T')[1]?.substring(0,5)} - {booking.endTime?.split('T')[1]?.substring(0,5)}</span></div>
                    </div>
                  </td>

                  <td className="py-10 px-8">
                    <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] ring-4 ${getStatusStyle(booking.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'APPROVED' ? 'bg-emerald-500' : booking.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                      {booking.status}
                    </span>
                    
                    {/* මෙතැනදී පණිවිඩය පෙන්වන්නේ status එක REJECTED නම් පමණක් බව තහවුරු කර ඇත */}
                    {booking.status === 'REJECTED' && booking.rejectionReason && (
                      <div className="flex items-center gap-1 mt-2 text-rose-400 italic font-bold text-[9px] max-w-[150px] break-words">
                         <MessageSquare size={10} className="flex-shrink-0" /> {booking.rejectionReason}
                      </div>
                    )}
                  </td>

                  <td className="py-10 px-10 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {booking.status !== 'APPROVED' && (
                        <button 
                          onClick={() => handleUpdateStatus(booking.id, 'APPROVED', "")} 
                          className="w-11 h-11 flex items-center justify-center bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-90"
                          title="Approve Booking"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}

                      {booking.status !== 'REJECTED' && (
                        <button 
                          onClick={() => {
                            setSelectedBookingId(booking.id);
                            setShowRejectModal(true);
                          }} 
                          className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${booking.status === 'APPROVED' ? 'bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/10 hover:bg-rose-600'}`}
                          title={booking.status === 'APPROVED' ? "Cancel Approved Booking" : "Reject Booking"}
                        >
                          <XCircle size={20} />
                        </button>
                      )}

                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="p-3 text-slate-200 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 ml-2"
                        title="Delete Booking"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingManagement;