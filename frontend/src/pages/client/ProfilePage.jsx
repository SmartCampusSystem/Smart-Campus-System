"use client";

import React, { useState, useEffect } from 'react';

import { 
  User, Mail, Phone, MapPin, Calendar, Camera, 
  Edit3, ShieldCheck, Award, BookOpen, Clock, 
  Settings, CheckCircle, GraduationCap, Briefcase, 
  ChevronRight, Bell, Star, ArrowLeft, Ticket, 
  LogOut, LayoutDashboard, Heart
} from 'lucide-react';

const ProfilePage = () => {

  const [user, setUser] = useState({
    name: "Smart User",
    email: "user@smartcampus.com",
    role: "Verified Student",
    joinedDate: "January 2024",
    phone: "+94 77 123 4567",
    address: "Colombo, Sri Lanka",
    department: "Faculty of Computing",
  });

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUser(prev => ({
          ...prev,
          name: userData.name || prev.name,
          email: userData.email || prev.email,
        }));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // පිටු අතර මාරුවීම සඳහා වන Function එක
  const handleNavigation = (path) => {
    if (path) {
      window.location.href = path; 
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafa] pt-12 pb-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- TOP BAR: BACK BUTTON & QUICK ACTIONS --- */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-[#0c5252] rounded-2xl shadow-sm border border-gray-100 transition-all font-bold text-sm"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => handleNavigation('/notifications')}
              className="relative p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-sm text-[#0c5252]"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => handleNavigation('/settings')}
              className="p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-sm text-[#0c5252]"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-[#0c5252] to-[#1a7a7a]"></div>
              <div className="px-8 pb-8 text-center">
                <div className="relative -mt-14 mb-4 inline-block">
                  <div className="w-28 h-28 rounded-[30px] bg-white p-1 shadow-2xl">
                    <div className="w-full h-full rounded-[26px] bg-[#0c5252] flex items-center justify-center text-[#ebc070] text-4xl font-black">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleNavigation('/edit-avatar')}
                    className="absolute bottom-0 right-0 p-2 bg-[#ebc070] rounded-xl border-4 border-white text-[#0c5252] shadow-lg"
                  >
                    <Camera size={14} strokeWidth={3} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-black text-[#0c5252] uppercase tracking-tight">{user.name}</h2>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 mb-4">{user.role}</p>
                
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
                    <Star size={12} /> Top User
                  </span>
                </div>
              </div>
            </div>

            {/* Side Navigation Menu */}
            <div className="bg-white rounded-[35px] p-4 shadow-lg shadow-gray-200/30 border border-gray-100">
              <nav className="space-y-1">
                {[
                  { icon: LayoutDashboard, label: "My Bookings", count: "4", active: true, path: "/my-bookings" },
                  { icon: Ticket, label: "Support Tickets", count: "1", active: false, path: "/support-tickets" },
                  { icon: Bell, label: "Notifications", count: "12", active: false, path: "/notifications" },
                  { icon: Heart, label: "My Favorites", count: "0", active: false, path: "/favorites" },
                  { icon: Settings, label: "Account Settings", active: false, path: "/settings" },
                ].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${item.active ? 'bg-[#0c5252] text-white shadow-lg' : 'hover:bg-gray-50 text-gray-500'}`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} className={item.active ? 'text-[#ebc070]' : 'text-gray-400 group-hover:text-[#0c5252]'} />
                      <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </div>
                    {item.count && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${item.active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm mt-4"
                >
                  <LogOut size={20} /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Professional Info Section */}
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#ebc070]/5 rounded-bl-[100px]"></div>
               
               <div className="flex items-center justify-between mb-8 relative">
                 <h3 className="text-[#0c5252] font-black text-xl uppercase tracking-tighter">Campus Identity</h3>
                 <button 
                   onClick={() => handleNavigation('/edit-profile')}
                   className="text-[#0c5252] p-2 hover:bg-gray-50 rounded-xl transition-all"
                 >
                    <Edit3 size={18} />
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#f4f7f7] flex items-center justify-center text-[#0c5252] shadow-inner">
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Faculty / Dept</p>
                        <p className="text-[#0c5252] text-sm font-bold">{user.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#f4f7f7] flex items-center justify-center text-[#0c5252] shadow-inner">
                        <Mail size={22} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Official Email</p>
                        <p className="text-[#0c5252] text-sm font-bold">{user.email}</p>
                      </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#f4f7f7] flex items-center justify-center text-[#0c5252] shadow-inner">
                        <Phone size={22} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Contact Number</p>
                        <p className="text-[#0c5252] text-sm font-bold">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#f4f7f7] flex items-center justify-center text-[#0c5252] shadow-inner">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Primary Address</p>
                        <p className="text-[#0c5252] text-sm font-bold">{user.address}</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Activity & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[#0c5252] font-black text-sm uppercase tracking-widest">Notifications</h3>
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                </div>
                <div className="space-y-5">
                  {[
                    { text: "Your booking for Hall A was approved", time: "5m ago", icon: CheckCircle, color: "text-green-500" },
                    { text: "New system update available", time: "1h ago", icon: Bell, color: "text-blue-500" },
                    { text: "Reminder: Return Projector #12", time: "2h ago", icon: Clock, color: "text-amber-500" }
                  ].map((note, i) => (
                    <div 
                      key={i} 
                      className="flex gap-4 items-start group cursor-pointer" 
                      onClick={() => handleNavigation('/notifications')}
                    >
                      <note.icon size={18} className={`${note.color} mt-0.5`} />
                      <div>
                        <p className="text-xs font-bold text-gray-700 group-hover:text-[#0c5252] transition-all">{note.text}</p>
                        <span className="text-[10px] text-gray-300 font-medium">{note.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0c5252] rounded-[40px] p-8 shadow-xl shadow-[#0c5252]/20 text-white relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <h3 className="text-[#ebc070] font-black text-sm uppercase tracking-widest mb-8">Resource Usage</h3>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-4xl font-black tracking-tight">150</p>
                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-1">Smart Tokens Available</p>
                  </div>
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Star className="text-[#ebc070]" size={32} />
                  </div>
                </div>
                <button 
                  onClick={() => handleNavigation('/tokens')}
                  className="w-full py-3 bg-[#ebc070] text-[#0c5252] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all relative z-10"
                >
                  Get More Tokens
                </button>
              </div>

            </div>

            {/* Achievement Timeline */}
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
               <h3 className="text-[#0c5252] font-black text-sm uppercase tracking-widest mb-8">Achievement Progress</h3>
               <div className="flex items-center gap-6">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <div 
                    key={i} 
                    onClick={() => handleNavigation('/achievements')}
                    className={`h-16 w-16 cursor-pointer rounded-2xl flex items-center justify-center transition-all ${i < 4 ? 'bg-[#0c5252] text-[#ebc070]' : 'bg-gray-100 text-gray-300 border-2 border-dashed border-gray-200'}`}
                   >
                      <Award size={i < 4 ? 28 : 22} strokeWidth={2.5} />
                   </div>
                 ))}
                 <div className="flex-1 flex flex-col items-end">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Next Badge</p>
                    <p className="text-sm font-bold text-[#0c5252]">Campus Elite</p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;