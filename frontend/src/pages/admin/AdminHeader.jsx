"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, RefreshCcw, Bell, ChevronDown, ShieldCheck, 
  Trash2, CheckCheck, Inbox, Clock 
} from 'lucide-react';

const AdminHeader = ({ searchTerm, setSearchTerm, fetchUsers, loading }) => {
  const [adminName, setAdminName] = useState("Admin User");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setAdminName(userData.name || "Admin User");
      } catch (e) {
        setAdminName("Admin User");
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // සෑම තත්පර 30කට වරක් auto sync වේ
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:8082/api/notifications/admin/alerts');
      const data = await res.json();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:8082/api/notifications/user/ADMIN/read-all', { method: 'PUT' });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const clearAll = async () => {
    if (window.confirm("Clear all notifications?")) {
      try {
        await fetch('http://localhost:8082/api/notifications/user/ADMIN/clear', { method: 'DELETE' });
        setNotifications([]);
        setUnreadCount(0);
      } catch (err) {
        console.error("Failed to clear notifications", err);
      }
    }
  };

  return (
    <header className="h-24 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 px-10 flex justify-between items-center shrink-0 z-50 sticky top-0">
      
      {/* --- Search Section --- */}
      <div className="group flex items-center gap-4 bg-slate-100/40 px-6 py-3 rounded-2xl w-full max-w-md border border-slate-200/50 focus-within:border-[#0c5252]/30 focus-within:bg-white focus-within:shadow-[0_10px_30px_-15px_rgba(12,82,82,0.1)] transition-all duration-500">
        <Search 
          size={18} 
          className="text-slate-400 group-focus-within:text-[#0c5252] transition-colors" 
        />
        <input 
          type="text" 
          placeholder="SEARCH SYSTEM RECORDS..." 
          className="bg-transparent border-none outline-none text-[10px] w-full font-black tracking-[0.2em] uppercase placeholder:text-slate-300 text-[#0c5252]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-8">
        {/* --- Action Buttons --- */}
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchUsers} 
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 ${
              loading 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-[#0c5252] text-white hover:bg-[#0c5252]/90 shadow-lg shadow-[#0c5252]/10"
            }`}
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Live Sync"}
          </button>
          
          {/* --- Notification Bell & Dropdown --- */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border relative group ${
                showNotifications ? "bg-[#0c5252] text-white" : "bg-slate-50 text-slate-400 hover:text-[#0c5252] hover:bg-slate-100 border-slate-200/50"
              }`}
            >
              <Bell size={20} className={!showNotifications ? "group-hover:rotate-12 transition-transform" : ""} />
              {unreadCount > 0 && (
                <span className="absolute top-3 right-3 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 bg-[#0c5252] text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-[11px] uppercase tracking-widest opacity-70">System Alerts</h3>
                    <p className="text-xl font-black">{unreadCount} New Requests</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={markAllRead} title="Mark all read" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <CheckCheck size={18} />
                    </button>
                    <button onClick={clearAll} title="Clear all" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-rose-300">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <Inbox className="mx-auto text-slate-200 mb-2" size={32} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbox Empty</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.read ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-[#ebc070]/10 text-[#0c5252] rounded-md">
                            {n.type}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock size={10} />
                            <span className="text-[9px] font-bold">Just now</span>
                          </div>
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-4 bg-slate-50 text-center">
                   <button onClick={() => setShowNotifications(false)} className="text-[9px] font-black uppercase tracking-widest text-[#0c5252] hover:underline">
                      Close Panel
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Profile Section --- */}
        <div className="flex items-center gap-4 pl-8 border-l border-slate-200/80">
          <div className="flex flex-col items-end hidden sm:flex">
            <div className="flex items-center gap-1.5 mb-0.5">
              <ShieldCheck size={10} className="text-[#ebc070]" strokeWidth={3} />
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">System Root</span>
            </div>
            <p className="text-[13px] font-black text-[#0c5252] uppercase tracking-tight italic">
              {adminName}
            </p>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-3 p-1 bg-slate-50 border border-slate-200 rounded-[20px] pr-4 hover:bg-white hover:border-[#ebc070]/50 transition-all duration-300 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-tr from-[#ebc070] to-[#f3d393] rounded-[15px] flex items-center justify-center text-[#0c5252] shadow-md font-black text-lg transform group-hover:scale-105 transition-transform">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-[#0c5252] transition-colors" />
            </button>
            <div className="absolute inset-0 bg-[#ebc070]/20 blur-xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;