import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, AlignLeft, Users, 
  ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../../components/Navbar';
import api from '../../api/axiosInstance';

const BookResource = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resourceName, setResourceName] = useState("Resource");

  const [bookingData, setBookingData] = useState({
    resourceId: id || '', 
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  // සම්පතේ විස්තර ලබා ගැනීම
  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        const response = await api.get(`/resources/${id}`);
        setResourceName(response.data.name);
      } catch (err) {
        console.error("Could not fetch resource details");
      }
    };
    if (id) fetchResourceDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    // 1. කාල පරාසය වලංගු දැයි පරීක්ෂා කිරීම (Client-side validation)
    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);

    if (start >= end) {
      toast.error("End time must be after the start time!");
      return;
    }

    setLoading(true);

    // 2. Local Storage එකෙන් user විස්තර ලබා ගැනීම
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || !user.email) {
      toast.error("Please login to continue");
      navigate('/login');
      return;
    }

    // 3. Backend එකට අවශ්‍ය දත්ත සකස් කිරීම
    const payload = {
      resourceId: id,
      userEmail: user.email, 
      startTime: bookingData.startTime, 
      endTime: bookingData.endTime,
      purpose: bookingData.purpose,
      expectedAttendees: parseInt(bookingData.expectedAttendees), 
      status: "PENDING" 
    };

    try {
      // මෙහිදී 'api' (axiosInstance) භාවිතා කරන බව තහවුරු කර ගන්න
      const response = await api.post('/bookings', payload);
      
      toast.success("Booking Request Sent Successfully!", { icon: '🎉' });
      
      // තත්පර 1.5කට පසු My Bookings පේජ් එකට යොමු කිරීම
      setTimeout(() => navigate('/my-bookings'), 1500);

    } catch (err) {
      // Backend එකේ ඇති Conflict Checking logic එකෙන් එන පණිවිඩය පෙන්වීම
      const errorMsg = err.response?.data || "Booking failed. Check for time conflicts.";
      toast.error(errorMsg, { id: 'booking-error' });
      console.error("Booking Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafa] font-sans selection:bg-[#0c5252] selection:text-white">
      <Navbar />
      <div className="h-32"></div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-[#0c5252]/60 hover:text-[#0c5252] font-bold text-xs uppercase tracking-widest mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Resources
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0c5252] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#ebc070] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Sparkles className="text-[#0c5252]" size={24} />
                </div>
                <h1 className="text-3xl font-black mb-4 tracking-tighter leading-none">
                  Reserve <br /> {resourceName}
                </h1>
                <p className="text-white/60 text-sm mb-8 leading-relaxed font-medium">
                  Secure your slot for academic or official purposes. Your request will be reviewed by the department head.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <CheckCircle2 size={18} className="text-[#ebc070]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Automated Conflict Check</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-10 shadow-xl border border-slate-100">
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date & Time</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0c5252] transition-colors" size={18} />
                      <input 
                        type="datetime-local" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#0c5252]/10 transition-all"
                        onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date & Time</label>
                    <div className="relative group">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0c5252] transition-colors" size={18} />
                      <input 
                        type="datetime-local" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#0c5252]/10 transition-all"
                        onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Attendees</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0c5252] transition-colors" size={18} />
                    <input 
                      type="number" 
                      placeholder="e.g. 50"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#0c5252]/10 transition-all"
                      onChange={(e) => setBookingData({...bookingData, expectedAttendees: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purpose of Booking</label>
                  <div className="relative group">
                    <AlignLeft className="absolute left-4 top-5 text-slate-300 group-focus-within:text-[#0c5252] transition-colors" size={18} />
                    <textarea 
                      rows="3"
                      placeholder="e.g. Guest Lecture, Lab Session..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 focus:ring-[#0c5252]/10 resize-none transition-all"
                      onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-[#0c5252] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#154646] transition-all shadow-xl shadow-[#0c5252]/10 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Confirm Reservation <CheckCircle2 size={18} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookResource;