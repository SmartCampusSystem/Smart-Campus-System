import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, AlignLeft, Users, ArrowLeft, CheckCircle2, 
  Loader2, Sparkles, PartyPopper, ArrowRight, ShieldCheck,
  MapPin, BookmarkCheck, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import api from '../../api/axiosInstance';

const BookResource = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resourceName, setResourceName] = useState("Resource");
  
  const [bookingData, setBookingData] = useState({
    resourceId: id || '', 
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  // Validation States
  const [errors, setErrors] = useState({});

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

  // Live Validation Logic
  const validateField = (name, value) => {
    let errorMsg = '';
    const now = new Date();

    if (name === 'startTime') {
      if (!value) errorMsg = 'Commencement time is required';
      else if (new Date(value) < now) errorMsg = 'Start time cannot be in the past';
    }

    if (name === 'endTime') {
      if (!value) errorMsg = 'Termination time is required';
      else if (bookingData.startTime && new Date(value) <= new Date(bookingData.startTime)) {
        errorMsg = 'End time must be after start time';
      }
    }

    if (name === 'expectedAttendees') {
      if (!value) errorMsg = 'Capacity is required';
      else if (parseInt(value) <= 0) errorMsg = 'Must be at least 1 person';
      else if (parseInt(value) > 120) errorMsg = 'Exceeds maximum limit (120)';
    }

    if (name === 'purpose') {
      if (!value) errorMsg = 'Mission objective is required';
      else if (value.length < 10) errorMsg = 'Please provide more detail (min 10 chars)';
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Final check before submission
    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);
    
    if (start >= end) {
      toast.error("End time must be after the start time!");
      return;
    }

    if (Object.values(errors).some(err => err !== '') || !bookingData.startTime || !bookingData.endTime) {
      toast.error("Please fix the errors in the manifest before transmitting.");
      return;
    }

    setLoading(true);
    const payload = {
      resourceId: id,
      startTime: bookingData.startTime, 
      endTime: bookingData.endTime,
      purpose: bookingData.purpose,
      expectedAttendees: parseInt(bookingData.expectedAttendees)
    };

    try {
      await api.post('/bookings', payload);
      setIsSuccess(true);
      toast.success("Request Logged Successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login to the system first");
        navigate('/login');
      } else {
        const errorMsg = typeof err.response?.data === 'string' ? err.response.data : "Booking failed. Check for time conflicts.";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if(!dateStr) return "Not selected";
    return new Date(dateStr).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans selection:bg-[#0c5252] selection:text-white">
      <Navbar />
      <div className="h-24"></div>
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 z-10 animate-bounce">
                <CheckCircle2 size={48} className="text-white" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#ebc070] rounded-2xl flex items-center justify-center animate-pulse">
                <PartyPopper size={24} className="text-[#0c5252]" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-[#0c5252] tracking-tighter uppercase italic">Mission Success!</h2>
              <p className="text-slate-500 font-medium">Your reservation for <span className="text-[#0c5252] font-black">{resourceName}</span> has been logged.</p>
            </div>
            <button onClick={() => navigate('/my-bookings')} className="w-full py-5 bg-[#0c5252] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#154646] transition-all shadow-xl flex items-center justify-center gap-3 group">
              Go to My Bookings <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
      <div className={`max-w-6xl mx-auto px-6 pb-20 transition-all duration-500 ${isSuccess ? 'opacity-0 scale-95 blur-xl pointer-events-none' : 'opacity-100'}`}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#0c5252]/60 hover:text-[#0c5252] font-bold text-xs uppercase tracking-widest mb-10 group transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
        </button>
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#0c5252]/5 rounded-2xl flex items-center justify-center text-[#0c5252]"><Sparkles size={24}/></div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Booking Manifest</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resource Allocation Phase</p>
              </div>
            </div>
            <form onSubmit={handleBooking} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Commencement</label>
                  <div className="relative group">
                    <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.startTime ? 'text-red-400' : 'text-slate-300'} group-focus-within:text-[#0c5252] transition-colors`} size={18} />
                    <input name="startTime" type="datetime-local" className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 ${errors.startTime ? 'focus:ring-red-100 ring-2 ring-red-50' : 'focus:ring-[#0c5252]/10'} transition-all border-none`} onChange={handleInputChange} required />
                  </div>
                  {errors.startTime && <p className="text-[10px] font-bold text-red-500 uppercase px-2">{errors.startTime}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Termination</label>
                  <div className="relative group">
                    <Clock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.endTime ? 'text-red-400' : 'text-slate-300'} group-focus-within:text-[#0c5252] transition-colors`} size={18} />
                    <input name="endTime" type="datetime-local" className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 ${errors.endTime ? 'focus:ring-red-100 ring-2 ring-red-50' : 'focus:ring-[#0c5252]/10'} transition-all border-none`} onChange={handleInputChange} required />
                  </div>
                  {errors.endTime && <p className="text-[10px] font-bold text-red-500 uppercase px-2">{errors.endTime}</p>}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Capacity</label>
                <div className="relative group">
                  <Users className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.expectedAttendees ? 'text-red-400' : 'text-slate-300'} group-focus-within:text-[#0c5252] transition-colors`} size={18} />
                  <input name="expectedAttendees" type="number" placeholder="Number of attendees" className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 ${errors.expectedAttendees ? 'focus:ring-red-100 ring-2 ring-red-50' : 'focus:ring-[#0c5252]/10'} transition-all border-none`} onChange={handleInputChange} required />
                </div>
                {errors.expectedAttendees && <p className="text-[10px] font-bold text-red-500 uppercase px-2">{errors.expectedAttendees}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mission Purpose</label>
                <div className="relative group">
                  <AlignLeft className={`absolute left-4 top-5 ${errors.purpose ? 'text-red-400' : 'text-slate-300'} group-focus-within:text-[#0c5252] transition-colors`} size={18} />
                  <textarea name="purpose" rows="4" placeholder="Briefly describe the objective..." className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-slate-900 font-bold outline-none focus:ring-2 ${errors.purpose ? 'focus:ring-red-100 ring-2 ring-red-50' : 'focus:ring-[#0c5252]/10'} resize-none transition-all border-none`} onChange={handleInputChange} required />
                </div>
                {errors.purpose && <p className="text-[10px] font-bold text-red-500 uppercase px-2">{errors.purpose}</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full py-5 bg-[#0c5252] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[20px] hover:bg-[#154646] transition-all shadow-xl shadow-[#0c5252]/10 flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><BookmarkCheck size={18} /> Transmit Request</>}
              </button>
            </form>
          </div>
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
            <div className="bg-[#0c5252] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">Live Preview</div>
                  <div className="w-10 h-10 bg-[#ebc070] rounded-xl flex items-center justify-center shadow-lg"><Info size={20} className="text-[#0c5252]"/></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter leading-none italic uppercase">Manifest <br/> Details.</h3>
                  <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest"><MapPin size={12}/> Nexus Resource ID: {id?.substring(0,8)}...</div>
                </div>
                <div className="space-y-6 border-t border-white/10 pt-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Resource</span>
                    <span className="text-sm font-bold truncate max-w-[200px]">{resourceName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Start Time</span>
                    <span className="text-sm font-bold">{formatDate(bookingData.startTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">End Time</span>
                    <span className="text-sm font-bold">{formatDate(bookingData.endTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Attendees</span>
                    <span className="text-sm font-bold">{bookingData.expectedAttendees || "0"} Personnel</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Purpose of Mission</span>
                    <p className="text-xs font-medium text-white/70 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5 line-clamp-3">
                      {bookingData.purpose || "Awaiting manifest input..."}
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Encrypted Data Stream Active</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><ShieldCheck className="text-[#0c5252]" size={20}/></div>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                <span className="font-black text-slate-700">Verification Protocol:</span> All requests undergo automated conflict checks before departmental head authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookResource;