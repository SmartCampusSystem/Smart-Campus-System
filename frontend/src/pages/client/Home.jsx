import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import StatCard from '../../components/StatCard';

const Home = () => {
  const stats = [
    { number: "12k+", label: "Total Students", icon: "👥" },
    { number: "450+", label: "Faculty Staff", icon: "🏫" },
    { number: "98%", label: "Satisfaction", icon: "⭐" }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-blue-100 selection:text-blue-700">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4">
        <Hero />
        
        {/* Features/Stats Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {stats.map((item, index) => (
            <StatCard key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;