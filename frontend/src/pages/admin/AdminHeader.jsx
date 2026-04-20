import React from 'react';
import { Search, RefreshCcw, Bell, ChevronDown } from 'lucide-react';

const AdminHeader = ({ searchTerm, setSearchTerm, fetchUsers, loading }) => {
  return (
    <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-10 flex justify-between items-center shrink-0 z-20 sticky top-0">
      
      {/* Search Section with Enhanced Focus States */}
      <div className="group flex items-center gap-4 bg-slate-100/50 px-6 py-3.5 rounded-2xl w-full max-w-md border border-transparent focus-within:border-[#0c5252]/20 focus-within:bg-white focus-within:ring-[8px] focus-within:ring-[#0c5252]/5 transition-all duration-300">
        <Search 
          size={18} 
          className="text-slate-400 group-focus-within:text-[#0c5252] transition-colors" 
        />
        <input 
          type="text" 
          placeholder="SEARCH SYSTEM DATA..." 
          className="bg-transparent border-none outline-none text-[10px] w-full font-black tracking-[0.15em] uppercase placeholder:text-slate-300 text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-8">
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers} 
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 ${
              loading 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-[#0c5252] text-white hover:bg-[#0c5252]/90 shadow-[#0c5252]/20 hover:shadow-lg"
            }`}
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Live Sync"}
          </button>
          
          {/* Notification Badge - Adding extra utility */}
          <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 pl-8 border-l border-slate-200/60">
          <div className="text-right hidden md:block">
            <div className="flex items-center justify-end gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">System Root</p>
            </div>
            <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">N. Wickramage</p>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-[#e9c46a] to-[#d4a373] rounded-2xl shadow-lg shadow-[#e9c46a]/30 flex items-center justify-center text-[#0c5252] font-black text-xl border-2 border-white transform group-hover:rotate-3 transition-transform">
              N
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
              <ChevronDown size={12} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;