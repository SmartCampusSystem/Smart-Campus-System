import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, User, LogOut } from 'lucide-react';

function TechnicianHeader({ searchTerm, setSearchTerm, fetchTickets, loading, sidebarOpen, setSidebarOpen }) {
  const [technicianName, setTechnicianName] = useState('Technician');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setTechnicianName(user.name || user.email?.split('@')[0] || 'Technician');
    }
  }, []);
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 
                       transition-all duration-200 w-64 text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#0c5252] text-white rounded-xl 
                     hover:bg-[#0a4040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                     text-sm font-medium"
          >
            <div className={`w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full 
                          ${loading ? 'animate-spin' : ''}`}></div>
            Refresh
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{technicianName}</div>
              <div className="text-xs text-slate-500">Support Staff</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0c5252] flex items-center justify-center">
              <div className="w-6 h-6 bg-emerald-300 rounded-full flex items-center justify-center text-[#0c5252] font-bold text-sm">
                {technicianName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TechnicianHeader;
