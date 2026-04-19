import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { LayoutGrid, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/resources')
      .then(res => {
        setResources(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20">
      <Navbar />

      {/* Header Section */}
      <div className="relative pt-40 pb-20 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[30%] h-full bg-slate-50/50 -skew-x-12 translate-x-20 -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 text-[#ebc070] font-black text-[11px] uppercase tracking-[0.4em] mb-6">
            <LayoutGrid size={18} /> Module A / Resource Catalogue
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-[#0c5252] leading-[0.9] tracking-tighter uppercase mb-6">
            Campus <br /> <span className="text-slate-300 font-light italic lowercase">Infrastructure.</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl">
            Select and reserve high-end facilities for your academic and extracurricular activities.
          </p>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c5252]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {resources.map((resource) => (
              <div 
                key={resource.id} 
                className="group relative bg-white rounded-[40px] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(12,82,82,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Decorative Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ebc070]/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-[#0c5252] rounded-2xl flex items-center justify-center text-[#ebc070] mb-8 shadow-lg shadow-[#0c5252]/20">
                    <Sparkles size={24} />
                  </div>

                  <h3 className="text-2xl font-black text-[#0c5252] uppercase tracking-tight mb-2">
                    {resource.name}
                  </h3>
                  <p className="text-[#ebc070] font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                    {resource.type}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0c5252]">
                        <MapPin size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">{resource.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0c5252]">
                        <Users size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">Capacity: {resource.capacity}</span>
                    </div>
                  </div>

                  <Link 
                    to={`/book/${resource.id}`}
                    className="flex items-center justify-between w-full p-2 pl-6 bg-slate-50 rounded-2xl group-hover:bg-[#ebc070] transition-all duration-500"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0c5252]">Reserve Now</span>
                    <div className="w-12 h-12 rounded-xl bg-[#0c5252] flex items-center justify-center text-white">
                      <ArrowRight size={20} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;