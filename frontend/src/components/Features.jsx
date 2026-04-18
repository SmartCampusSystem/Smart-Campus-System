import React from 'react';
import { Building2, CalendarCheck2, Wrench, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Features = () => {
  const modules = [
    {
      title: "Facilities Hub",
      desc: "Comprehensive catalogue of lecture halls, labs, and high-value equipment with real-time availability tracking.",
      icon: <Building2 className="text-[#0c5252]" size={32} />,
      tag: "Module A",
      accent: "border-b-emerald-500"
    },
    {
      title: "Smart Bookings",
      desc: "Seamless reservation workflow with automated conflict detection and role-based approval systems for students.",
      icon: <CalendarCheck2 className="text-[#7c5c14]" size={32} />,
      tag: "Module B",
      accent: "border-b-[#ebc070]"
    },
    {
      title: "Incident Tracking",
      desc: "Advanced maintenance ticketing system for rapid fault reporting and real-time technician assignment updates.",
      icon: <Wrench className="text-[#0c5252]" size={32} />,
      tag: "Module C",
      accent: "border-b-slate-400"
    }
  ];

  return (
    /* Hero එකේ වගේම Width එක screen එකේ අයිනටම ගන්න w-screen පාවිච්චි කරලා තියෙනවා */
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#f8fafc] py-32 overflow-hidden">
      
      {/* Background Decoration - Hero එකේ style එකටම */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#0c5252]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#ebc070]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 px-6 md:px-16 lg:px-24">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0c5252]/5 border border-[#0c5252]/10 text-[#0c5252] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Zap size={14} className="fill-[#ebc070] text-[#ebc070]" />
              Core System Modules
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black text-[#0c5252] leading-[0.9] tracking-tighter uppercase">
              Operational <br /> 
              <span className="text-slate-300 font-light italic lowercase">Intelligence.</span>
            </h2>
          </div>
          <p className="text-slate-500 text-xl max-w-md leading-relaxed font-medium border-l-4 border-[#ebc070] pl-8">
            The Beacon platform automates complex university workflows, ensuring high-value resources are always optimized.
          </p>
        </div>

        {/* Feature Grid - Full Width Feel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {modules.map((m, i) => (
            <div 
              key={i} 
              className={`group relative bg-white p-12 rounded-[50px] border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_50px_100px_-20px_rgba(12,82,82,0.15)] transition-all duration-700 hover:-translate-y-4 border-b-8 ${m.accent}`}
            >
              <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mb-10 group-hover:bg-[#0c5252] group-hover:text-white transition-all duration-500 shadow-inner">
                {React.cloneElement(m.icon, { 
                  className: "group-hover:text-white transition-colors duration-500" 
                })}
              </div>
              
              <div className="space-y-6">
                <span className="text-[10px] font-black text-[#ebc070] uppercase tracking-[0.3em]">{m.tag}</span>
                <h3 className="text-3xl font-black text-[#0c5252] uppercase tracking-tight">{m.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed opacity-80">
                  {m.desc}
                </p>
                
                <div className="pt-6">
                  <button className="flex items-center gap-3 text-[#0c5252] font-black text-xs uppercase tracking-[0.2em] group/btn">
                    Explore Details 
                    <div className="w-8 h-8 rounded-full bg-[#0c5252]/5 flex items-center justify-center group-hover/btn:bg-[#0c5252] group-hover/btn:text-white transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Decorative Background Number */}
              <div className="absolute top-10 right-10 text-8xl font-black text-slate-50 group-hover:text-[#0c5252]/5 transition-colors duration-700 pointer-events-none">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Security & OAuth Banner - Matching Hero's Clean Look */}
        <div className="mt-24 w-full bg-[#0c5252] rounded-[60px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-[0_40px_80px_-15px_rgba(12,82,82,0.4)] relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute right-[-5%] top-[-50%] w-[400px] h-[400px] bg-white/5 rounded-full"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-[#ebc070] rounded-3xl flex items-center justify-center text-[#0c5252] shadow-2xl">
              <ShieldCheck size={40} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-white text-3xl font-black uppercase tracking-tight">Enterprise Protocol</h4>
              <p className="text-[#98c7c7] text-lg font-medium opacity-80">Secured with OAuth 2.0 and Role-Based Access Control.</p>
            </div>
          </div>

          <div className="mt-10 md:mt-0 relative z-10">
            <button className="bg-white text-[#0c5252] px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">
              View Security Specs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;