"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, Bell, ShoppingBag, 
  LogOut, User, Settings, ChevronDown, GraduationCap,
  Mail, MessageSquare, Phone, Search, LifeBuoy, HelpCircle
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const SupportPage = () => {
  // --- Navbar Logic Start ---
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Smart User");
  
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUserName(userData.name || "Smart User");
      } catch (e) { setUserName("Smart User"); }
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  // --- Navbar Logic End ---

  return (
    <div className="min-h-screen bg-[#f8fafb] text-[#0c5252] font-sans overflow-x-hidden">
      
      <Navbar/>

      {/* --- SUPPORT CONTENT START --- */}
      <main className="pt-32 pb-20">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-[#0c5252] text-[12px] font-black uppercase tracking-[0.4em] mb-4">Help Center</h2>
          <h3 className="text-5xl md:text-6xl font-black text-[#0c5252] tracking-tighter mb-8">How can we help <span className="text-[#ebc070]">you?</span></h3>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0c5252]/40" size={24} />
            <input 
              type="text" 
              placeholder="Search for guides, tickets or common issues..." 
              className="w-full h-18 pl-16 pr-8 bg-white border border-[#0c5252]/10 rounded-[28px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ebc070] transition-all text-lg font-medium"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: <LifeBuoy size={32}/>, title: "Technical Support", desc: "Problems with login, system crashes or software bugs." },
            { icon: <MessageSquare size={32}/>, title: "Live Chat", desc: "Instantly connect with our support agents during office hours." },
            { icon: <HelpCircle size={32}/>, title: "Knowledge Base", desc: "Browse documentation and tutorials for Smart Campus." }
          ].map((card, i) => (
            <div key={i} className="group bg-white p-10 rounded-[40px] border border-[#0c5252]/5 hover:border-[#ebc070] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#0c5252]/5 text-[#0c5252] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#ebc070] group-hover:text-[#0c5252] transition-colors duration-500">
                {card.icon}
              </div>
              <h4 className="text-xl font-black mb-3">{card.title}</h4>
              <p className="text-[#0c5252]/60 font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ & Contact Section */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* FAQ Area */}
          <div>
            <h4 className="text-3xl font-black mb-10 tracking-tight">Frequently Asked Questions</h4>
            <div className="space-y-4">
              {[
                "How do I reset my portal password?",
                "Where can I find my course enrollment ticket?",
                "Can I update my profile after registration?",
                "How do I book a resource for a group study?"
              ].map((q, i) => (
                <div key={i} className="bg-white px-8 py-6 rounded-[24px] border border-[#0c5252]/5 hover:bg-[#0c5252] hover:text-white transition-all cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[14px] uppercase tracking-wide">{q}</span>
                    <ChevronDown size={20} className="group-hover:rotate-180 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0c5252] p-12 rounded-[50px] shadow-3xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#ebc070]/10 rounded-full blur-3xl"></div>
            <h4 className="text-white text-3xl font-black mb-2 tracking-tight">Send a Message</h4>
            <p className="text-[#98c7c7] font-medium mb-10">Our team usually responds within 2 hours.</p>
            
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <input type="text" placeholder="Full Name" className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ebc070] w-full" />
                <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ebc070] w-full" />
              </div>
              <select className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/60 focus:outline-none focus:border-[#ebc070] w-full appearance-none">
                <option>Select Issue Category</option>
                <option>Technical Issue</option>
                <option>Academic Inquiry</option>
                <option>System Feedback</option>
              </select>
              <textarea placeholder="Tell us more about your issue..." rows="4" className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ebc070] w-full resize-none"></textarea>
              <button className="w-full py-5 bg-[#ebc070] text-[#0c5252] font-black rounded-2xl uppercase tracking-[0.2em] text-[12px] hover:bg-white hover:scale-[1.02] transition-all shadow-xl">
                Submit Ticket
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SupportPage;