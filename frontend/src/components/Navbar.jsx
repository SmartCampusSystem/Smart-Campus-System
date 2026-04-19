"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Menu, Sparkles, Bell, UserCircle, 
  ShoppingBag, LogOut, User, Settings, ChevronDown 
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Smart User");
  
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Login තත්ත්වය පරීක්ෂා කිරීමේ function එක
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
    // මුලින්ම check කිරීම
    checkLoginStatus();

    // Scroll effect
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // 2. IMPORTANT: මේ event එක මගින් Login/Logout වුණු සැණින් Navbar එක update වේ
    window.addEventListener('storage', checkLoginStatus);
    
    // Custom event එකක් (එකම tab එක ඇතුළේ වැඩ කිරීමට)
    window.addEventListener('authChange', checkLoginStatus);

    // Dropdown එකෙන් පිට ක්ලික් කළොත් වැසීම
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('authChange', checkLoginStatus);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]); // Page එක මාරු වන විටත් පරීක්ෂා වේ

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    
    // Logout වුණු බව පද්ධතියට දැනුම් දීම
    window.dispatchEvent(new Event("authChange")); 
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className={`flex items-center justify-between w-full h-20 px-8 rounded-[28px] border transition-all duration-500 ${
          scrolled 
          ? 'bg-[#0c5252]/90 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_-15px_rgba(12,82,82,0.4)]' 
          : 'bg-[#0c5252] border-white/5 shadow-xl'
        }`}>
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-11 h-11 bg-[#ebc070] rounded-xl flex items-center justify-center group-hover:rotate-[10deg] transition-all duration-500 shadow-lg">
                <ShieldCheck className="text-[#0c5252]" size={26} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-black text-2xl leading-none tracking-tighter">BEACON</h1>
              <span className="text-[#98c7c7] text-[8px] font-black tracking-[0.3em] uppercase opacity-70">Smart Hub</span>
            </div>
          </Link>

          {/* Central Navigation */}
          <div className="hidden xl:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-sm">
            {['Home', 'Resources', 'Bookings', 'Tickets', 'Support'].map((item) => {
              const path = item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase()}`;
              return (
                <Link 
                  key={item} 
                  to={path} 
                  className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive(path) 
                    ? 'bg-[#ebc070] text-[#0c5252]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2.5 text-white font-black text-[11px] uppercase tracking-widest hover:text-[#ebc070] transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-6 py-3 font-black text-[10px] uppercase tracking-widest text-[#0c5252] bg-[#ebc070] rounded-xl hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95 group">
                  Get Started <Sparkles size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-[#ebc070] border border-white/10 relative">
                    <Bell size={20} />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-[#0c5252]"></span>
                </button>

                <Link to="/my-bookings" className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-[#ebc070] border border-white/10 transition-all">
                  <ShoppingBag size={20} />
                </Link>
                
                <div className="relative ml-2" ref={menuRef}>
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 pr-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-95 group"
                  >
                    <div className="w-9 h-9 bg-[#ebc070] rounded-lg flex items-center justify-center text-[#0c5252] shadow-md font-black">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={14} className={`text-white/30 transition-transform ${showProfileMenu ? 'rotate-180 text-[#ebc070]' : ''}`} />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-5 w-64 bg-[#0a3a3a] border border-white/10 rounded-3xl shadow-2xl p-2 backdrop-blur-2xl animate-in fade-in zoom-in duration-200 z-[110]">
                      <div className="px-5 py-5 mb-2 bg-white/5 rounded-2xl border border-white/5 text-left">
                        <p className="text-[9px] text-[#ebc070] font-black uppercase tracking-[0.3em] mb-1">Session Active</p>
                        <p className="text-white font-black text-sm truncate">{userName}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-[#ebc070] hover:text-[#0c5252] transition-all rounded-xl group">
                          <User size={18} /> <span className="text-[11px] font-black uppercase tracking-widest">My Profile</span>
                        </Link>
                        <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-[#ebc070] hover:text-[#0c5252] transition-all rounded-xl group">
                          <Settings size={18} /> <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>
                        </Link>
                      </div>

                      <div className="h-[1px] bg-white/5 my-2 mx-2"></div>

                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-4 w-full text-red-400 hover:bg-red-500/10 transition-all rounded-xl group text-left">
                        <LogOut size={18} /> <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
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