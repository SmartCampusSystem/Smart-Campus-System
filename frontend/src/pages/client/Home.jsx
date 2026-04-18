import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import WorkFlow from '../../components/WorkFlow';
import TechShowcase from '../../components/TechShowcase';
import StatsSection from '../../components/Stats';
// import FinalCTA from '../../components/FinalCTA';
import Footer from '../../components/Footer';

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
        <Features/>
        <WorkFlow/>
        <StatsSection/>
        <TechShowcase/>
        {/* <FinalCTA/> */}
        <Footer/>
        
      </main>
    </div>
  );
};

export default Home;