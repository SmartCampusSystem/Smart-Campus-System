"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, Bell, ShoppingBag, 
  LogOut, User, Settings, ChevronDown, GraduationCap 
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Smart User");
  
  const menuRef = useRef(null);
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
      } catch (e) {
        setUserName("Smart User");
      }
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
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authChange', checkLoginStatus);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]);

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
      {/* Container removed padding to stay edge-to-edge */}
      <div className="w-full">
        {/* Navbar main body - Removed scroll-dependent classes */}
        <div className="flex items-center justify-between w-full h-20 px-10 bg-[#0c5252] border-b border-white/10 shadow-lg">
          
          {/* Smart Campus Logo Section */}
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

          {/* Luxury Navigation Links */}
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

          {/* Action Area */}
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
                <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-white/70 hover:text-[#ebc070] border border-white/10 transition-all relative group">
                    <Bell size={20} />
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-[#ebc070] rounded-full border-2 border-[#0c5252] animate-pulse"></span>
                </button>

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
    </nav>
  );
};

export default Navbar;