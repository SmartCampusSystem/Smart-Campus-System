import React, { useState, useEffect } from 'react';
import { 
  Bell, Calendar, Clock, Inbox, MailOpen, Trash2, 
  CheckCircle2, AlertTriangle, Info, ChevronRight,
  ArrowLeft, Sparkles, Filter, ShieldCheck, XCircle, 
  Clock4, Ticket, LayoutGrid, ArrowUpDown, Monitor, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifs, setFilteredNotifs] = useState([]);
  const [groupedNotifs, setGroupedNotifs] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, BOOKING, TICKET, SYSTEM
  const [timeSort, setTimeSort] = useState('LATEST'); // LATEST, OLDEST
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));
  const userEmail = user?.email;

  useEffect(() => {
    fetchNotifications();
  }, [userEmail]);

  // Handle Filtering & Sorting
  useEffect(() => {
    let result = [...notifications];

    // Category Filter
    if (activeFilter !== 'ALL') {
      result = result.filter(n => {
        if (activeFilter === 'SYSTEM') return n.recipientEmail === 'ALL' || n.type === 'SYSTEM';
        return n.type === activeFilter;
      });
    }

    // Time Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return timeSort === 'LATEST' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotifs(result);
    groupNotifications(result);
  }, [activeFilter, timeSort, notifications]);

  const fetchNotifications = async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const personalRes = await axios.get(`http://localhost:8082/api/notifications/user/${userEmail}`);
      const broadcastRes = await axios.get(`http://localhost:8082/api/notifications/user/ALL`);
      const combined = [...personalRes.data, ...broadcastRes.data];
      const uniqueNotifs = Array.from(new Map(combined.map(item => [item.id, item])).values());
      
      setNotifications(uniqueNotifs);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const groupNotifications = (notifs) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const groups = notifs.reduce((acc, notif) => {
      const notifDate = new Date(notif.createdAt);
      const dateString = notifDate.toDateString();

      let key;
      if (dateString === today.toDateString()) key = "Today";
      else if (dateString === yesterday.toDateString()) key = "Yesterday";
      else key = notifDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

      acc[key] = acc[key] || [];
      acc[key].push(notif);
      return acc;
    }, {});
    setGroupedNotifs(groups);
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8082/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) { console.error(error); }
  };

  const clearAll = async () => {
    if (window.confirm("Archive all notifications from your history?")) {
      try {
        await axios.delete(`http://localhost:8082/api/notifications/user/${userEmail}/clear`);
        fetchNotifications();
      } catch (error) { console.error(error); }
    }
  };

  // --- ID HIGHLIGHT LOGIC START ---
  const formatMessage = (message) => {
    const idRegex = /[a-f\d]{24}/gi; // Detects MongoDB style IDs
    
    const parts = message.split(idRegex);
    const matches = message.match(idRegex);

    if (!matches) return message;

    return parts.reduce((acc, part, i) => {
      acc.push(part);
      if (matches[i]) {
        acc.push(
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-[13px] font-black mx-1 tracking-wider">
            <Hash size={12} className="text-emerald-500" />
            REF-{matches[i].slice(-8).toUpperCase()}
          </span>
        );
      }
      return acc;
    }, []);
  };
  // --- ID HIGHLIGHT LOGIC END ---

  const getStatusIcon = (status, type, recipientEmail) => {
    if (recipientEmail === 'ALL' || type === 'SYSTEM') {
        return <div className="p-2 bg-indigo-50 rounded-xl"><Monitor className="text-indigo-500" size={22} /></div>;
    }
    switch (status) {
      case 'APPROVED': 
        return <div className="p-2 bg-emerald-50 rounded-xl"><CheckCircle2 className="text-emerald-500" size={22} /></div>;
      case 'REJECTED': 
        return <div className="p-2 bg-rose-50 rounded-xl"><XCircle className="text-rose-500" size={22} /></div>;
      case 'PENDING': 
        return <div className="p-2 bg-amber-50 rounded-xl"><Clock4 className="text-amber-500" size={22} /></div>;
      case 'CANCELLED': 
        return <div className="p-2 bg-gray-100 rounded-xl"><Trash2 className="text-gray-500" size={22} /></div>;
      case 'ERROR': 
        return <div className="p-2 bg-rose-50 rounded-xl"><AlertTriangle className="text-rose-500" size={22} /></div>;
      default: 
        return <div className="p-2 bg-blue-50 rounded-xl"><Info className="text-blue-500" size={22} /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-[#1E293B] relative overflow-x-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#ebc070]/10 rounded-full blur-[140px] opacity-40"></div>
      </div>

      {/* Floating Header */}
      <nav className="fixed top-0 w-full h-20 bg-white/70 backdrop-blur-xl border-b border-gray-100 z-50 px-6 md:px-12 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-2xl transition-all"
        >
          <div className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft size={18} className="text-gray-600 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-sm font-bold text-gray-500 group-hover:text-black">Back to Home</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-[#ebc070] uppercase tracking-[0.2em]">Smart Campus</span>
            <span className="text-xs font-bold text-gray-400">{userEmail}</span>
          </div>
          <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Bell size={18} />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-32 px-6">
        
        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Main Welcome Card */}
          <div className="lg:col-span-2 p-10 rounded-[45px] bg-white border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-[#ebc070]/10 group-hover:scale-110 transition-transform duration-700">
              <Sparkles size={140} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <h1 className="text-5xl font-black tracking-tighter text-[#0c5252] mb-4">
                Activity <span className="text-[#ebc070]">Center.</span>
              </h1>
              <p className="text-gray-400 font-medium max-w-xs leading-relaxed">
                Stay updated with real-time campus notifications and alerts tailored for you.
              </p>
            </div>
            <button 
              onClick={clearAll}
              className="mt-10 w-fit px-8 py-4 bg-[#0c5252] text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-[#0c5252]/20 transition-all active:scale-95"
            >
              Clear All Logs
            </button>
          </div>

          {/* Unread Counter Card */}
          <div className="p-10 rounded-[45px] bg-white border border-white shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
               <MailOpen size={30} />
            </div>
            <h2 className="text-6xl font-black text-[#0c5252] mb-1">
              {notifications.filter(n => !n.isRead).length}
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Messages</p>
          </div>

          {/* Secure Card */}
          <div className="p-10 rounded-[45px] bg-[#ebc070] text-white shadow-xl shadow-[#ebc070]/20 flex flex-col justify-center relative overflow-hidden group">
            <ShieldCheck size={100} className="absolute -bottom-4 -right-4 opacity-20 group-hover:rotate-12 transition-transform" />
            <h3 className="text-xl font-black leading-tight mb-2">Campus Security</h3>
            <p className="text-white/80 text-xs font-bold leading-relaxed">Your data is encrypted and synced in real-time.</p>
          </div>
        </div>

        {/* --- FILTER & SORT BAR --- */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-4 bg-white/50 p-3 rounded-[30px] border border-white shadow-sm backdrop-blur-md">
            <button 
              onClick={() => setActiveFilter('ALL')}
              className={`px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === 'ALL' ? 'bg-[#0c5252] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <LayoutGrid size={14} /> All Feed
            </button>
            <button 
              onClick={() => setActiveFilter('BOOKING')}
              className={`px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === 'BOOKING' ? 'bg-[#ebc070] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Calendar size={14} /> Bookings
            </button>
            <button 
              onClick={() => setActiveFilter('TICKET')}
              className={`px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === 'TICKET' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Ticket size={14} /> Tickets
            </button>
            <button 
              onClick={() => setActiveFilter('SYSTEM')}
              className={`px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeFilter === 'SYSTEM' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <Monitor size={14} /> System
            </button>
          </div>

          {/* Time Sorter */}
          <div className="bg-white/50 p-2 rounded-[24px] border border-white flex items-center shadow-sm">
             <button 
               onClick={() => setTimeSort(timeSort === 'LATEST' ? 'OLDEST' : 'LATEST')}
               className="flex items-center gap-3 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#0c5252] hover:bg-white rounded-[18px] transition-all"
             >
               <ArrowUpDown size={14} />
               {timeSort === 'LATEST' ? 'Showing Latest' : 'Showing Oldest'}
             </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#0c5252] border-t-transparent rounded-full animate-spin"></div></div>
        ) : filteredNotifs.length > 0 ? (
          <div className="space-y-20">
            {Object.entries(groupedNotifs).map(([date, notifs]) => (
              <div key={date} className="relative">
                <div className="flex items-center gap-6 mb-10 sticky top-24 bg-[#F8FAFC]/80 backdrop-blur-md py-4 z-10">
                   <div className="w-12 h-[2px] bg-[#ebc070]"></div>
                   <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#0c5252]">{date}</h3>
                   <div className="h-[1px] flex-1 bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {notifs.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => !notif.isRead && markAsRead(notif.id)}
                      className={`group relative p-8 rounded-[40px] border transition-all duration-500 cursor-pointer ${
                        !notif.isRead 
                        ? 'bg-white border-white shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:shadow-2xl scale-[1.01]' 
                        : 'bg-white/40 border-gray-100 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex gap-6 items-start">
                        <div className={`w-16 h-16 shrink-0 rounded-[24px] flex items-center justify-center transition-all group-hover:rotate-6 ${
                          !notif.isRead ? 'bg-gray-50' : 'bg-transparent border border-gray-100'
                        }`}>
                          {getStatusIcon(notif.status, notif.type, notif.recipientEmail)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${!notif.isRead ? 'text-[#ebc070]' : 'text-gray-400'}`}>
                                 {notif.recipientEmail === 'ALL' ? 'SYSTEM ALERT' : (notif.type || 'Activity')}
                               </span>
                               {(notif.status || notif.recipientEmail === 'ALL') && (
                                 <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                                    notif.recipientEmail === 'ALL' ? 'bg-indigo-100 text-indigo-600' :
                                    notif.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                    notif.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' :
                                    notif.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                    'bg-gray-100 text-gray-500'
                                 }`}>
                                    {notif.recipientEmail === 'ALL' ? 'BROADCAST' : notif.status}
                                 </span>
                               )}
                            </div>
                            <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                               <Clock size={10} /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <p className={`text-[17px] leading-snug tracking-tight mb-6 ${!notif.isRead ? 'font-bold text-[#0c5252]' : 'font-medium text-gray-500'}`}>
                            {formatMessage(notif.message)}
                          </p>

                          <div className="flex items-center justify-between border-t border-gray-50 pt-5">
                             <div className="flex items-center gap-1.5">
                                {!notif.isRead ? (
                                    <>
                                        <div className="w-1.5 h-1.5 bg-[#ebc070] rounded-full animate-pulse"></div>
                                        <span className="text-[9px] font-black text-[#ebc070] uppercase tracking-widest">New Priority</span>
                                    </>
                                ) : (
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Archived</span>
                                )}
                             </div>
                             <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${!notif.isRead ? 'bg-[#0c5252] text-white scale-110 shadow-lg' : 'bg-gray-50 text-gray-300'}`}>
                                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-white rounded-[40px] border border-gray-50 shadow-sm flex items-center justify-center mb-8 group transition-all">
              <Inbox size={40} className="text-gray-100 group-hover:scale-110 transition-transform" strokeWidth={1} />
            </div>
            <h2 className="text-2xl font-black text-[#0c5252] tracking-tighter uppercase mb-2">No Results Found</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] max-w-xs">Try changing your filters or checking back later.</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body { background-color: #F8FAFC; }
        ::-webkit-scrollbar { width: 0px; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default NotificationPage;