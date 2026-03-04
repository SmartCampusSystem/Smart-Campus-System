import React from 'react';

const Hero = () => {
  return (
    <section className="relative px-6 pt-20 pb-16 text-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 blur-3xl pointer-events-none">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-300 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
          The Next Gen <br />
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Campus Management</span>
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience a seamless digital environment for academics, administration, and student life. Built for modern universities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
            Explore Dashboard
          </button>
          <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;