import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-20 overflow-hidden">
      
      {/* The Main Gradient Box */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24">
        <div className="relative bg-[#0c5252] rounded-[60px] p-12 md:p-24 overflow-hidden shadow-[0_60px_100px_-20px_rgba(12,82,82,0.4)]">
          
          {/* Animated Background Decoration */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ebc070]/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ebc070]/50 to-transparent"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-12">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#ebc070] text-[11px] font-black uppercase tracking-[0.4em] backdrop-blur-md">
              <Zap size={16} className="fill-[#ebc070]" />
              Start Your Journey Today
            </div>

            {/* Massive Heading */}
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black text-white leading-[0.9] tracking-tighter uppercase max-w-4xl">
              Ready to <span className="text-slate-400 font-light italic lowercase">experience</span> <br /> 
              the future of campus Ops?
            </h2>

            <p className="text-[#98c7c7] text-xl md:text-2xl font-medium max-w-2xl leading-relaxed opacity-80">
              Join the Beacon ecosystem and streamline your academic resources with high-precision tracking and automated bookings.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 pt-6 w-full sm:w-auto">
              <button className="group bg-[#ebc070] text-[#0c5252] px-14 py-7 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white hover:scale-105 transition-all shadow-[0_30px_60px_-10px_rgba(235,192,112,0.3)]">
                Launch Student Hub <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              </button>
              
              <button className="px-14 py-7 rounded-[24px] border border-white/20 text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
                Contact Admin
              </button>
            </div>

            {/* Trust Markers */}
            <div className="flex flex-wrap justify-center gap-10 pt-10 border-t border-white/10 w-full">
               {[
                 "OAuth 2.0 Secure",
                 "Role Based Access",
                 "Real-time Updates"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-widest">
                   <CheckCircle2 size={16} className="text-emerald-400" /> {text}
                 </div>
               ))}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default FinalCTA;