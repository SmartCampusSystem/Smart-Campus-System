import React from 'react';
import { ChevronRight, ShieldCheck, Activity, Database, Zap, LayoutGrid, Clock } from 'lucide-react';

const Hero = () => {
  return (
    /* Edge-to-edge layout maintained as per your request */
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen bg-white overflow-hidden pt-28 pb-20 flex flex-col justify-center">
      
      {/* 1. Ultra-Modern Background Elements */}
      <div className="absolute top-0 right-0 w-[58%] h-full bg-[#f1f5f9] -z-0 skew-x-[-6deg] origin-top-right transition-transform duration-1000"></div>
      
      {/* Clean Aesthetic Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[900px] h-[900px] bg-[#ebc070]/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[700px] h-[700px] bg-[#0c5252]/5 rounded-full blur-[120px]"></div>

      {/* 2. Main Content Wrapper */}
      <div className="w-full relative z-10 px-6 md:px-16 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
          
          {/* LEFT CONTENT: Minimalist & High-Impact */}
          <div className="w-full lg:w-[48%] space-y-10 animate-fade-in">
            
            {/* Tagline: Project Contextualized */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0c5252]/5 border border-[#0c5252]/10 text-[#0c5252] text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Zap size={14} className="text-[#7c5c14] fill-[#7c5c14]" />
              Smart Campus Operations Hub 2026
            </div>
            
            {/* Massive Fluid Heading: Clean & Sharp */}
            <h1 className="text-[clamp(3rem,7vw,7.5rem)] font-black text-[#0c5252] leading-[0.85] tracking-tighter uppercase">
              Precision <br /> 
              <span className="text-slate-300 font-light italic lowercase tracking-tight">Management.</span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              A unified ecosystem for seamless <span className="text-[#0c5252] font-bold">facility bookings</span>, <span className="text-[#0c5252] font-bold">asset tracking</span>, and <span className="text-[#0c5252] font-bold">incident management</span> in real-time.
            </p>

            {/* Premium CTA Group */}
            <div className="flex flex-wrap gap-6 pt-4">
              <button className="group bg-[#0c5252] text-white px-12 py-5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-[#093d3d] hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(12,82,82,0.4)]">
                Access Dashboard <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-slate-500 border border-slate-200 px-12 py-5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
                Explore Assets
              </button>
            </div>

            {/* Micro-Stats Strip: Clean Look */}
            <div className="pt-12 flex items-center gap-10 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                   <LayoutGrid size={20} />
                </div>
                <div>
                   <p className="text-[#0c5252] text-2xl font-black tracking-tighter leading-none">450+</p>
                   <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Managed Labs</p>
                </div>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                   <Clock size={20} />
                </div>
                <div>
                   <p className="text-[#0c5252] text-2xl font-black tracking-tighter leading-none">99.9%</p>
                   <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Uptime SLA</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT VISUALS: Enterprise Tech Imagery */}
          <div className="w-full lg:w-[52%] relative flex items-center justify-end">
            
            {/* Image choice: Modern University/Tech Architecture */}
            <div className="relative w-full lg:w-[110%] h-[550px] lg:h-[700px] rounded-l-[80px] lg:rounded-l-[120px] overflow-hidden shadow-[-30px_50px_80px_rgba(0,0,0,0.1)]">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" 
                alt="Modern Campus Interior" 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c5252]/40 via-transparent to-transparent"></div>
              
              {/* Floating Real-time Incident Tracker Card */}
              <div className="absolute top-12 left-12 p-6 bg-white/10 backdrop-blur-2xl rounded-[30px] border border-white/20 shadow-2xl animate-pulse-slow">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                   <p className="text-white text-[9px] font-black uppercase tracking-[0.25em]">Live Monitoring</p>
                </div>
                <p className="text-white text-lg font-bold">No Critical Faults Reported</p>
              </div>
            </div>

            {/* Floating Booking Efficiency Card */}
            <div className="absolute -bottom-6 left-0 lg:left-[-40px] w-[320px] bg-white rounded-[40px] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-slate-50 hidden md:block transition-transform hover:-translate-y-2 duration-500">
              <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-12 bg-[#ebc070]/20 rounded-2xl flex items-center justify-center text-[#7c5c14]">
                   <Database size={24} />
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Analytics</span>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Weekly Booking Rate</p>
                  <p className="text-4xl font-black text-[#0c5252]">88.2%</p>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="w-[88%] h-full bg-[#0c5252] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Security Verification Badge */}
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white/95 backdrop-blur-md px-6 py-4 rounded-[25px] shadow-2xl flex items-center gap-4 border border-white animate-bounce-slow">
               <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={22} strokeWidth={2.5} />
               </div>
               <div>
                  <p className="text-[11px] font-black text-[#0c5252] uppercase leading-none">OAuth 2.0</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">Secured Session</p>
               </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* 3. Clean Tech-Stack Strip */}
      <div className="w-full mt-20 py-12 bg-white/50 border-y border-slate-100 overflow-hidden">
        <div className="w-full px-12 flex flex-wrap items-center justify-center gap-16 md:gap-24 opacity-30 grayscale transition-all duration-700 hover:opacity-80 hover:grayscale-0">
            {['SPRING BOOT', 'REACT.JS', 'POSTGRESQL', 'DOCKER', 'AWS', 'GITHUB'].map((tech) => (
              <span key={tech} className="text-xl font-black text-[#0c5252] tracking-tighter whitespace-nowrap">{tech}</span>
            ))}
        </div>
      </div>

    </section>
  );
};

export default Hero;