import React from 'react';
import { Users, Building, HardDrive, Clock, Globe2, TrendingUp } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { label: "Total Assets", value: "4,250+", icon: <HardDrive size={24} />, color: "text-blue-500" },
    { label: "Active Users", value: "12K+", icon: <Users size={24} />, color: "text-emerald-500" },
    { label: "Campus Hubs", value: "18", icon: <Building size={24} />, color: "text-amber-500" },
    { label: "Uptime", value: "99.9%", icon: <Clock size={24} />, color: "text-purple-500" },
  ];

  return (
    /* Full width background with a subtle gradient */
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-24 overflow-hidden border-b border-slate-100">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f8fafc] -skew-x-12 translate-x-1/2"></div>
      
      <div className="relative z-10 px-6 md:px-16 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0c5252]/5 text-[#0c5252] text-[10px] font-black uppercase tracking-widest">
              <TrendingUp size={14} /> Live Ecosystem Data
            </div>
            <h2 className="text-5xl font-black text-[#0c5252] leading-[0.9] tracking-tighter uppercase">
              Tracking <br /> <span className="text-slate-300">Success in </span> <br /> Real-Time.
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Our infrastructure monitors thousands of data points every second to ensure seamless academic operations.
            </p>
            <div className="pt-4">
               <div className="flex items-center gap-4 text-[#0c5252] font-black text-xs uppercase tracking-widest cursor-pointer group">
                  Explore Global Network <Globe2 size={18} className="group-hover:rotate-12 transition-transform" />
               </div>
            </div>
          </div>

          {/* Right Side: High-End Stats Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="group p-10 bg-[#fbfcfd] border border-slate-100 rounded-[40px] hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between min-h-[220px]">
                <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-5xl font-black text-[#0c5252] tracking-tighter mb-2">{stat.value}</h3>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsSection;