import React from 'react';
import { MousePointerClick, CalendarCheck, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

const WorkFlow = () => {
  const steps = [
    {
      title: "Discovery",
      desc: "Browse our dynamic catalogue of smart lecture halls, labs, and high-end tech assets.",
      icon: <MousePointerClick size={28} />,
      color: "text-blue-400"
    },
    {
      title: "Reservation",
      desc: "Book your slot with real-time availability checks and instant conflict resolution.",
      icon: <CalendarCheck size={28} />,
      color: "text-[#ebc070]"
    },
    {
      title: "Confirmation",
      desc: "Receive encrypted OAuth-verified approvals and digital access credentials.",
      icon: <ShieldCheck size={28} />,
      color: "text-emerald-400"
    }
  ];

  return (
    /* Breaking parent limits to cover full screen width */
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#0c5252] py-32 overflow-hidden">
      
      {/* Background Tech Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ebc070_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]"></div>

      <div className="relative z-10 px-6 md:px-16 lg:px-24">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#ebc070] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Zap size={14} className="fill-[#ebc070]" />
              The Beacon Experience
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black text-white leading-[0.9] tracking-tighter uppercase">
              Seamless <br /> 
              <span className="text-[#98c7c7] font-light italic lowercase">Connectivity.</span>
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-[#98c7c7] text-xl leading-relaxed font-medium opacity-80">
              We’ve simplified campus operations into three high-precision steps. From asset discovery to secure check-outs, every interaction is tracked and optimized.
            </p>
            <div className="flex gap-8">
                <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={16} className="text-emerald-400" /> Fully Automated
                </div>
                <div className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={16} className="text-emerald-400" /> Zero Conflicts
                </div>
            </div>
          </div>
        </div>

        {/* Dynamic Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-[60px] overflow-hidden bg-white/5 backdrop-blur-sm">
          {steps.map((step, i) => (
            <div key={i} className={`group p-16 relative border-b md:border-b-0 ${i !== steps.length - 1 ? 'md:border-r border-white/10' : ''} hover:bg-white/[0.02] transition-all duration-500`}>
              
              {/* Step Number */}
              <div className="absolute top-12 right-12 text-white/5 text-8xl font-black group-hover:text-[#ebc070]/10 transition-colors">
                0{i + 1}
              </div>

              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[#ebc070] group-hover:text-[#0c5252] transition-all duration-500 ${step.color}`}>
                {step.icon}
              </div>

              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-6">
                {step.title}
              </h3>
              
              <p className="text-[#98c7c7] text-lg leading-relaxed opacity-70 mb-10">
                {step.desc}
              </p>

              <div className="flex items-center gap-2 text-[#ebc070] font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                Learn More <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action - Thin Bar style */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-10 py-10 border-t border-white/5">
            <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em]">
              Ready to optimize your workflow?
            </p>
            <button className="bg-[#ebc070] text-[#0c5252] px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-2xl">
              Access Student Portal
            </button>
        </div>

      </div>
    </section>
  );
};

export default WorkFlow;