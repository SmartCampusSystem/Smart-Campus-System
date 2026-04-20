"use client";

import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw, Bell, ChevronDown, ShieldCheck } from 'lucide-react';

const AdminHeader = ({ searchTerm, setSearchTerm, fetchUsers, loading }) => {
  const [adminName, setAdminName] = useState("Admin User");

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
  }, []);

  return (
    <header className="h-24 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 px-10 flex justify-between items-center shrink-0 z-20 sticky top-0">
      
      {/* --- Search Section (Modern Glassmorphism) --- */}
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
          
          <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#0c5252] hover:bg-slate-100 border border-slate-200/50 transition-all relative group">
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
        </div>

        {/* --- Profile Section (Matched to main Navbar Style) --- */}
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
            
            {/* Optional Glow Effect on hover */}
            <div className="absolute inset-0 bg-[#ebc070]/20 blur-xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity -z-10"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;