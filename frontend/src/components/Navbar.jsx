"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, Bell, ShoppingBag, 
  LogOut, User, Settings, ChevronDown, GraduationCap,
  Clock, CheckCircle2, Trash2, MailOpen, Inbox,
  XCircle, Clock4, AlertTriangle
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Smart User");
  const [userEmail, setUserEmail] = useState("");
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    setIsLoggedIn(!!token);

    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUserName(userData.name || "Smart User");
        setUserEmail(userData.email || "");
      } catch (e) {
        setUserName("Smart User");
      }
    }
  };

  const fetchNotifications = async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`http://localhost:8082/api/notifications/user/${userEmail}`);
      const countRes = await axios.get(`http://localhost:8082/api/notifications/user/${userEmail}/unread-count`);
      setNotifications(res.data);
      setUnreadCount(countRes.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8082/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:8082/api/notifications/user/${userEmail}/read-all`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  const clearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      try {
        await axios.delete(`http://localhost:8082/api/notifications/user/${userEmail}/clear`);
        fetchNotifications();
      } catch (error) {
        console.error("Error clearing notifications", error);
      }
    }
  };

  // Status Icons Helper
  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': 
        return <CheckCircle2 size={22} className="text-emerald-400" />;
      case 'REJECTED': 
        return <XCircle size={22} className="text-rose-400" />;
      case 'PENDING': 
        return <Clock4 size={22} className="text-amber-400" />;
      case 'CANCELLED': 
        return <Trash2 size={22} className="text-gray-400" />;
      default: 
        return <GraduationCap size={22} className="text-[#ebc070]" />;
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('authChange', checkLoginStatus);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authChange', checkLoginStatus);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location, userEmail]);

  useEffect(() => {
    if (isLoggedIn && userEmail) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userEmail]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    window.dispatchEvent(new Event("authChange")); 
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100]">
      <div className="w-full">
        <div className="flex items-center justify-between w-full h-20 px-10 bg-[#0c5252] border-b border-white/10 shadow-lg">
          
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ebc070] to-[#d4a855] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-500">
                <GraduationCap className="text-[#0c5252]" size={28} strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0c5252] rounded-full flex items-center justify-center border-2 border-[#ebc070]">
                <ShieldCheck className="text-[#ebc070]" size={10} strokeWidth={3} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-black text-2xl leading-none tracking-tight">
                SMART<span className="text-[#ebc070]">CAMPUS</span>
              </h1>
              <span className="text-[#98c7c7] text-[9px] font-bold tracking-[0.4em] uppercase opacity-80">Management System</span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-1 bg-black/20 p-1.5 rounded-[20px] border border-white/5 backdrop-blur-md">
            {['Home', 'Resources', 'Bookings', 'Tickets', 'Support'].map((item) => {
              const path = item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase()}`;
              const active = isActive(path);
              return (
                <Link 
                  key={item} 
                  to={path} 
                  className={`relative px-7 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 overflow-hidden group/link ${
                    active ? 'text-[#0c5252]' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item}</span>
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ebc070] to-[#f3d393]"></div>
                  )}
                  {!active && (
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/link:translate-y-0 transition-transform duration-300"></div>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            {!isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="px-5 py-2.5 text-white/80 font-black text-[11px] uppercase tracking-widest hover:text-[#ebc070] transition-all relative group">
                  Sign In
                  <span className="absolute bottom-1 left-5 right-5 h-[2px] bg-[#ebc070] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-7 py-3.5 font-black text-[10px] uppercase tracking-[0.2em] text-[#0c5252] bg-[#ebc070] rounded-2xl hover:bg-white transition-all duration-300 active:scale-95 group">
                  Join Now <Sparkles size={14} className="group-hover:animate-pulse" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                
                {/* --- MODERN NOTIFICATION SECTION --- */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group ${
                      showNotifications 
                        ? 'bg-[#ebc070] text-[#0c5252] shadow-[0_0_20px_rgba(235,192,112,0.3)]' 
                        : 'bg-white/5 border border-white/10 text-white/70 hover:border-[#ebc070]/50 hover:text-[#ebc070]'
                    }`}
                  >
                    <Bell size={20} className={unreadCount > 0 ? 'animate-[bell-ring_1s_infinite]' : ''} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-[#0c5252] flex items-center justify-center shadow-lg animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-5 w-[420px] bg-[#0a4242]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-300">
                      {/* Header */}
                      <div className="p-6 bg-gradient-to-b from-white/10 to-transparent flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-black text-lg tracking-tight">Activities</h3>
                          <p className="text-[#ebc070] text-[10px] font-black uppercase tracking-[0.2em]">You have {unreadCount} unread tasks</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={markAllAsRead}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-[#ebc070] hover:bg-[#ebc070] hover:text-[#0c5252] transition-all duration-300 group/btn"
                            title="Mark all as read"
                          >
                            <MailOpen size={18} />
                          </button>
                          <button 
                            onClick={clearAllNotifications}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300"
                            title="Clear all history"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="max-h-[450px] overflow-y-auto custom-scrollbar px-3 pb-3">
                        {notifications.length > 0 ? (
                          <div className="grid gap-2">
                            {notifications.map((notif) => (
                              <div 
                                key={notif.id}
                                onClick={() => !notif.read && markAsRead(notif.id)}
                                className={`group/item relative p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${
                                  !notif.read 
                                    ? 'bg-white/10 border-white/10 hover:bg-white/15' 
                                    : 'bg-transparent border-transparent hover:bg-white/5'
                                }`}
                              >
                                <div className="flex gap-4">
                                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-inner ${
                                    notif.status === 'APPROVED' ? 'bg-emerald-500/20' :
                                    notif.status === 'REJECTED' ? 'bg-rose-500/20' :
                                    notif.status === 'PENDING' ? 'bg-amber-500/20' :
                                    notif.status === 'CANCELLED' ? 'bg-gray-500/20' :
                                    'bg-[#ebc070]/20'
                                  }`}>
                                    {getStatusIcon(notif.status)}
                                  </div>
                                  
                                  <div className="flex flex-col justify-center flex-1 min-w-0">
                                    <p className={`text-[13px] leading-relaxed mb-1.5 ${!notif.read ? 'text-white font-bold' : 'text-white/50'}`}>
                                      {notif.message}
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <span className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                        <Clock size={12} /> {new Date(notif.createdAt).toLocaleDateString()}
                                      </span>
                                      {notif.status && (
                                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                                          notif.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                                          notif.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' :
                                          notif.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                                          'bg-white/5 text-white/40'
                                        }`}>
                                          {notif.status}
                                        </span>
                                      )}
                                      {!notif.read && (
                                        <span className="flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 bg-[#ebc070] rounded-full animate-pulse"></span>
                                          <span className="text-[9px] text-[#ebc070] font-black uppercase tracking-tighter">New</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {!notif.read && (
                                    <div className="absolute right-4 top-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                      <div className="w-8 h-8 rounded-full bg-[#ebc070] flex items-center justify-center text-[#0c5252]">
                                        <MailOpen size={14} />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-16 flex flex-col items-center justify-center text-center px-10">
                            <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center mb-5 text-white/10">
                              <Inbox size={40} strokeWidth={1} />
                            </div>
                            <h4 className="text-white font-bold text-sm mb-1">No Notifications</h4>
                            <p className="text-white/30 text-[11px] uppercase tracking-[0.2em] font-black">Your inbox is empty for now</p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <Link 
                        to="/notifications" 
                        onClick={() => setShowNotifications(false)}
                        className="group/footer flex items-center justify-center gap-3 w-full py-5 bg-white/5 hover:bg-[#ebc070] transition-all duration-500"
                      >
                        <span className="text-[11px] text-[#ebc070] group-hover/footer:text-[#0c5252] font-black uppercase tracking-[0.3em]">View Full Dashboard</span>
                        <ChevronDown size={14} className="-rotate-90 text-[#ebc070] group-hover/footer:text-[#0c5252] transition-transform group-hover/footer:translate-x-1" />
                      </Link>
                    </div>
                  )}
                </div>
                {/* --- END MODERN NOTIFICATION SECTION --- */}

                <Link to="/my-bookings" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-white/70 hover:text-[#ebc070] border border-white/10 transition-all group">
                  <ShoppingBag size={20} />
                </Link>
                
                <div className="relative ml-2" ref={menuRef}>
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 p-1.5 pr-5 bg-white/5 rounded-[22px] border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#ebc070] to-[#f3d393] rounded-[16px] flex items-center justify-center text-[#0c5252] shadow-lg font-black text-lg">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start hidden sm:flex text-left">
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-tighter leading-none">Verified User</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-white font-bold truncate max-w-[80px]">{userName}</span>
                          <ChevronDown size={12} className={`text-white/60 transition-transform duration-500 ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-4 w-72 bg-[#0c5252] border border-white/10 rounded-[25px] shadow-2xl p-3 backdrop-blur-3xl z-[110]">
                      <div className="px-6 py-4 mb-2 bg-white/5 rounded-[20px] border border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#ebc070] rounded-xl flex items-center justify-center text-[#0c5252] font-black text-lg">
                              {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[9px] text-[#ebc070] font-black uppercase tracking-[0.2em] mb-0.5">Active</p>
                            <p className="text-white font-black text-sm truncate uppercase">{userName}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-1">
                        <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 px-5 py-3 text-white/60 hover:bg-[#ebc070] hover:text-[#0c5252] transition-all rounded-[15px] group">
                          <User size={18} /> 
                          <span className="text-[11px] font-black uppercase tracking-[0.1em]">Profile Overview</span>
                        </Link>
                        <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-4 px-5 py-3 text-white/60 hover:bg-[#ebc070] hover:text-[#0c5252] transition-all rounded-[15px] group">
                          <Settings size={18} /> 
                          <span className="text-[11px] font-black uppercase tracking-[0.1em]">Settings</span>
                        </Link>
                      </div>

                      <div className="h-[1px] bg-white/10 my-2 mx-4"></div>

                      <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-4 w-full text-rose-400 hover:bg-rose-500/10 transition-all rounded-[15px] text-left">
                        <LogOut size={18} /> 
                        <span className="text-[11px] font-black uppercase tracking-[0.1em]">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bell-ring {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-15deg); }
          60% { transform: rotate(10deg); }
          80% { transform: rotate(-10deg); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(235,192,112,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(235,192,112,0.5); }
      `}} />
    </nav>
  );
};

export default Navbar;