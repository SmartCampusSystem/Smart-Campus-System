"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Database, Calendar, 
  Ticket, Bell, LogOut, ChevronRight, GraduationCap, Sparkles
} from 'lucide-react';

const Sidebar = ({ location, handleLogout }) => {
  return (
    <aside className="w-72 bg-[#0c4242] text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.1)] shrink-0 z-30 border-r border-white/5 relative">
      
      {/* Logo Section - Updated to SMART CAMPUS */}
      <div className="p-8 relative flex items-center gap-4 group cursor-default border-b border-white/[0.03]">
        {/* Subtle Accent Background */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#ebc070]/5 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="relative">
          <div className="bg-[#ebc070] p-2.5 rounded-xl shadow-lg shadow-black/20 text-[#0c5252] transform group-hover:-rotate-3 transition-transform duration-500 z-10 relative">
            <GraduationCap size={24} strokeWidth={2.2} />
          </div>
          {/* Subtle Outer Ring */}
          <div className="absolute inset-0 border border-[#ebc070]/20 rounded-xl scale-125 group-hover:scale-110 transition-transform duration-700"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-xl font-black tracking-tight leading-none uppercase text-white">
            SMART<span className="text-[#ebc070]">CAMPUS</span>
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.25em]">
              Admin <span className="text-[#ebc070]/60">Portal</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 mt-8 overflow-y-auto custom-scrollbar">
        <p className="px-6 mb-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Management Matrix</p>
        
        <nav className="space-y-1.5">
          <NavItem 
            icon={<LayoutDashboard size={18}/>} 
            label="Overview" 
            to="/admin/overview" 
            active={location.pathname === '/admin/overview'} 
          />
          <NavItem 
            icon={<Users size={18}/>} 
            label="User Directory" 
            to="/admin/users" 
            active={location.pathname === '/admin/users' || location.pathname === '/admin'} 
          />
          <NavItem 
            icon={<Database size={18}/>} 
            label="Resources" 
            to="/admin/resources" 
            active={location.pathname === '/admin/resources'} 
          />
          <NavItem 
            icon={<Calendar size={18}/>} 
            label="Bookings" 
            to="/admin/bookings" 
            active={location.pathname === '/admin/bookings'} 
          />
          <NavItem 
            icon={<Ticket size={18}/>} 
            label="Support Tickets" 
            to="/admin/tickets" 
            active={location.pathname === '/admin/tickets'} 
          />
          <NavItem 
            icon={<Bell size={18}/>} 
            label="Notifications" 
            to="/admin/notifications" 
            active={location.pathname === '/admin/notifications'} 
          />
        </nav>
      </div>

      {/* Bottom Action Section */}
      <div className="p-4 mt-auto space-y-3 bg-[#0c4242]">
        <div className="px-6 py-4 bg-white/[0.03] rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={12} className="text-[#ebc070]/60" />
            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">System Load</p>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
            <div className="bg-[#ebc070]/60 h-full w-[94%] shadow-[0_0_10px_rgba(235,192,112,0.3)]"></div>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-rose-500/90 text-white/60 hover:text-white rounded-2xl transition-all duration-300 group border border-white/5 hover:border-transparent active:scale-95"
        >
          <div className="flex items-center gap-3">
            <LogOut size={17} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout Session</span>
          </div>
          <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-all" />
        </button>
      </div>
    </aside>
  );
};

function NavItem({ icon, label, to, active = false }) {
  return (
    <Link 
      to={to} 
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
        active 
          ? 'bg-[#ebc070] text-[#0c5252] shadow-lg shadow-black/10 font-black' 
          : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={`transition-all duration-300 ${
        active ? 'text-[#0c5252]' : 'text-[#ebc070]/60 group-hover:text-[#ebc070] group-hover:scale-110'
      }`}>
        {icon}
      </span>
      <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
      
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0c5252]/40 shadow-inner"></div>
      )}

      {!active && (
        <div className="absolute left-0 w-1 h-0 bg-[#ebc070] rounded-r-full transition-all duration-300 group-hover:h-4 opacity-0 group-hover:opacity-100"></div>
      )}
    </Link>
  );
}

export default Sidebar;