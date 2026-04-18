import React from 'react';
import { ShieldCheck, Mail, Github, Linkedin, Twitter, ArrowRight, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white pt-32 overflow-hidden">
      
      {/* 1. Pre-Footer: Partner/Vision Strip */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 mb-32">
        <div className="p-12 md:p-16 bg-slate-50 rounded-[50px] flex flex-col lg:flex-row items-center justify-between gap-12 border border-slate-100">
           <div className="max-w-md">
              <h3 className="text-3xl font-black text-[#0c5252] uppercase tracking-tighter mb-4">Enterprise Ready.</h3>
              <p className="text-slate-500 font-medium italic">Integrated with global academic standards and secure OAuth 2.0 protocols for a safer campus experience.</p>
           </div>
           <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {['AWS', 'AZURE', 'DOCKER', 'SLIIT'].map((brand) => (
                <span key={brand} className="text-xl font-black text-[#0c5252] tracking-[0.2em]">{brand}</span>
              ))}
           </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Column 1: Brand */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0c5252] rounded-xl flex items-center justify-center text-[#ebc070]">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-2xl font-black text-[#0c5252] tracking-tighter">BEACON</h2>
            </div>
            <p className="text-slate-500 leading-relaxed font-medium">
              The next-generation Smart Campus Operations Hub. Built with Spring Boot and React for ultimate performance.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0c5252] hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0c5252]">Platform</h4>
            <ul className="space-y-4">
              {['Infrastructure', 'Asset Hub', 'Incident Reports', 'Security'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-500 font-bold text-sm hover:text-[#0c5252] transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0c5252]">Contact Hub</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                <MapPin size={18} className="text-[#ebc070]" /> SLIIT Malabe, Sri Lanka
              </li>
              <li className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                <Phone size={18} className="text-[#ebc070]" /> +94 11 234 5678
              </li>
              <li className="flex items-center gap-4 text-slate-500 font-medium text-sm">
                <Mail size={18} className="text-[#ebc070]" /> support@beacon.hub
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0c5252]">System Status</h4>
            <div className="p-6 bg-[#0c5252] rounded-3xl space-y-4 shadow-xl">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">All Nodes Online</span>
               </div>
               <p className="text-[#98c7c7] text-xs leading-relaxed">System is running at optimal capacity. Last sync: 2 mins ago.</p>
               <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Check Analytics
               </button>
            </div>
          </div>

        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            © 2026 PAF PROJECT GROUP-XX. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-[#0c5252]">Privacy Policy</a>
            <a href="#" className="hover:text-[#0c5252]">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Background Decorative Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ebc070] to-transparent opacity-30"></div>
    </footer>
  );
};

export default Footer;