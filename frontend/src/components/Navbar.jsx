import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronDown, Globe, Menu, Sparkles, LayoutGrid, CalendarRange, TicketIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? 'py-2' : 'py-5'
    }`}>
      <div className="w-full px-6 md:px-12 lg:px-16 transition-all duration-500">
        
        <div className={`flex items-center justify-between w-full h-22 px-8 rounded-[30px] border transition-all duration-500 ${
          scrolled 
          ? 'bg-[#0c5252]/95 backdrop-blur-xl border-white/10 shadow-[0_25px_50px_-12px_rgba(12,82,82,0.5)]' 
          : 'bg-[#0c5252] border-white/5 shadow-[0_20px_40px_rgba(12,82,82,0.3)]'
        }`}>
          
          {/* 1. Logo Section */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-[#ebc070] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-[10deg] transition-all duration-500">
                <ShieldCheck className="text-[#0c5252]" size={28} strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-[#0c5252]">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-black text-2xl tracking-tighter leading-none">BEACON</h1>
              <span className="text-[#98c7c7] text-[9px] font-black tracking-[0.3em] uppercase opacity-80">Smart Hub</span>
            </div>
          </div>

          {/* 2. Client-Specific Links (Based on Assignment Modules) */}
          <div className="hidden xl:flex items-center gap-10 bg-white/5 px-10 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            {[
              { name: 'Facilities', active: true }, // Module A: Resources Catalogue [cite: 22]
              { name: 'Bookings', active: false }, // Module B: Booking Management [cite: 27]
              { name: 'Incidents', active: false }, // Module C: Maintenance & Incident Ticketing [cite: 38]
              { name: 'Support', active: false }
            ].map((link) => (
              <a 
                key={link.name} 
                href={`#${link.name.toLowerCase()}`}
                className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                  link.active ? 'text-[#ebc070]' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#ebc070] transition-all duration-300 ${
                  link.active ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </a>
            ))}
          </div>

          {/* 3. Actions - Portal access and Join button */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-white/60 hover:text-[#ebc070] transition-colors cursor-pointer mr-2">
              <Globe size={16} />
              <span className="text-[11px] font-black tracking-[0.25em] uppercase">English</span>
              <ChevronDown size={14} />
            </div>

            <div className="h-10 w-[1px] bg-white/10 hidden sm:block"></div>

            <Link 
              to="/login" 
              className="text-white font-black text-[12px] uppercase tracking-[0.25em] hover:text-[#ebc070] transition-all hidden sm:block"
            >
              Sign In
            </Link>

            {/* Launch Hub/Register - Primary Action */}
            <Link 
              to="/register" 
              className="group relative inline-flex items-center gap-3 px-8 py-4 font-black text-[11px] uppercase tracking-[0.25em] text-[#0c5252] transition-all duration-500 bg-[#ebc070] rounded-2xl hover:bg-white hover:scale-105 shadow-[0_15px_35px_rgba(235,192,112,0.3)]"
            >
              Get Started
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            </Link>

            <button className="xl:hidden text-white bg-white/10 p-3 rounded-xl border border-white/10">
              <Menu size={24} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;