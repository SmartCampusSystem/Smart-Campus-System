import React from 'react';
import { ShieldCheck, Fingerprint, Zap, BarChart, Globe, ArrowUpRight } from 'lucide-react';

const TechShowcase = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-32 overflow-hidden">
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-slate-50/50 -skew-x-6 translate-x-12"></div>

      <div className="relative z-10 px-6 md:px-16 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          
          {/* Left: Massive Visual Interaction Card */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 bg-[#0c5252] rounded-[60px] p-2 overflow-hidden shadow-[0_50px_100px_-20px_rgba(12,82,82,0.3)] group">
                <div className="relative h-[550px] w-full bg-[#083d3d] rounded-[55px] overflow-hidden">
                    {/* Animated Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    
                    {/* Floating Interface Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-12 space-y-6">
                        <div className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] transform group-hover:-translate-y-2 transition-transform duration-700">
                            <div className="flex justify-between items-center mb-6">
                                <div className="w-12 h-12 bg-[#ebc070] rounded-2xl flex items-center justify-center text-[#0c5252]">
                                    <BarChart size={24} strokeWidth={3} />
                                </div>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Module E / Analytics</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                                <div className="w-[75%] h-full bg-[#ebc070] animate-pulse"></div>
                            </div>
                            <p className="text-white text-2xl font-black">Optimization Active</p>
                        </div>
                        
                        <div className="p-8 bg-[#ebc070] rounded-[32px] flex items-center justify-between transform group-hover:translate-y-2 transition-transform duration-700 delay-100">
                             <div>
                                <p className="text-[#0c5252] text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Security Protocol</p>
                                <p className="text-[#0c5252] text-xl font-black uppercase">OAuth 2.0 Verified</p>
                             </div>
                             <ShieldCheck size={32} className="text-[#0c5252]" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Soft decorative glow */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#ebc070]/20 rounded-full blur-[100px] -z-10"></div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 text-[#ebc070] font-black text-[11px] uppercase tracking-[0.4em]">
                <Fingerprint size={18} /> Deep Tech Integration
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black text-[#0c5252] leading-[0.9] tracking-tighter uppercase">
                High-End <br /> <span className="text-slate-300 font-light italic lowercase">Infrastructure.</span>
              </h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
                We utilize a high-performance stack featuring Spring Boot and React to deliver sub-second latency for all campus operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              {[
                { title: "Real-time Sync", icon: <Zap size={20} /> },
                { title: "Global CDN", icon: <Globe size={20} /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0c5252] group-hover:bg-[#0c5252] group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-[#0c5252] transition-colors">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-8">
                <button className="group flex items-center gap-6 text-[#0c5252] font-black text-xs uppercase tracking-[0.3em]">
                    Explore Full Architecture 
                    <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#0c5252] group-hover:text-white transition-all">
                        <ArrowUpRight size={20} />
                    </div>
                </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechShowcase;