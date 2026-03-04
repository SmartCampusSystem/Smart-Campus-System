import React from 'react';

const StatCard = ({ number, label, icon }) => {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-4xl shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 group">
      <div className="text-3xl mb-4 bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-4xl font-black text-slate-800 mb-1">{number}</h3>
      <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest">{label}</p>
    </div>
  );
};

export default StatCard;