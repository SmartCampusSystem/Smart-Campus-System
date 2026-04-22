"use client";

import React, { useState, useEffect } from 'react';
import { 
  BellRing, Send, User, MessageSquare, 
  AlertCircle, History, Inbox, Trash2, CheckCircle,
  Edit3, MoreVertical, Search, Filter, Sparkles,
  ArrowRight, ShieldCheck, Megaphone, RefreshCw,
  Activity, Users, Zap, Calendar
} from 'lucide-react';

const AdminNotificationPanel = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [isEditing, setIsEditing] = useState(null);

  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'BROADCAST',
    recipientEmail: 'ALL',
    senderEmail: 'admin@smartcampus.com',
  });

  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
    if (activeTab === 'requests') fetchAlerts();
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8082/api/notifications/admin/broadcast-history');
      const data = await res.json();
      setHistory(data);
    } catch (err) { console.error("Error fetching history", err); }
  };

  const fetchAlerts = async () => {
    try {
      // Backend එකේ අපි හදපු නව Endpoint එක call කිරීම
      const res = await fetch('http://localhost:8082/api/notifications/admin/alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (err) { console.error("Error fetching alerts", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing 
      ? `http://localhost:8082/api/notifications/admin/update/${isEditing}`
      : 'http://localhost:8082/api/notifications/admin/send';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        alert(isEditing ? "Notification updated!" : "Notification dispatched!");
        resetForm();
        if (activeTab === 'history') fetchHistory();
      }
    } catch (error) {
      alert("Action failed. Please check backend.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this log?")) {
      try {
        const response = await fetch(`http://localhost:8082/api/notifications/admin/delete/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setHistory(history.filter(log => log.id !== id));
          // Alerts වල තිබී මැකුවා නම් ඒවාත් update වීමට:
          setAlerts(alerts.filter(alert => alert.id !== id));
        }
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const handleEdit = (log) => {
    setIsEditing(log.id);
    setNotification({
      title: log.title || '',
      message: log.message,
      type: log.type || 'BROADCAST',
      recipientEmail: log.recipientEmail,
      senderEmail: log.senderEmail || 'admin@smartcampus.com',
    });
    setActiveTab('send');
  };

  const resetForm = () => {
    setIsEditing(null);
    setNotification({
      title: '',
      message: '',
      type: 'BROADCAST',
      recipientEmail: 'ALL',
      senderEmail: 'admin@smartcampus.com',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans text-[#1E293B] bg-[#F8FAFC]/50 min-h-screen">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-1 bg-[#ebc070] rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0c5252]">Control Center</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-[#0c5252]">
            Communications <span className="text-[#ebc070]">Hub.</span>
          </h1>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-[24px] shadow-sm border border-white gap-1">
          {[
            { id: 'send', label: isEditing ? 'Edit Mode' : 'Send', icon: isEditing ? Edit3 : Send },
            { id: 'requests', label: 'Alerts', icon: Inbox },
            { id: 'history', label: 'Logs', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if(tab.id !== 'send') resetForm(); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-[#0c5252] text-white shadow-lg shadow-[#0c5252]/20' 
                : 'text-gray-400 hover:text-[#0c5252] hover:bg-white'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Section (Forms/Lists) - Occupies 3 columns */}
        <div className="lg:col-span-3">
          
          {/* SEND / EDIT FORM */}
          {activeTab === 'send' && (
            <div className="bg-white rounded-[45px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white animate-in fade-in slide-in-from-bottom-6 duration-700">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <User size={12} /> Target Recipient
                    </label>
                    <select 
                      disabled={isEditing}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-[22px] focus:ring-2 focus:ring-[#0c5252]/10 text-sm font-bold text-[#0c5252] appearance-none"
                      value={notification.recipientEmail}
                      onChange={(e) => setNotification({...notification, recipientEmail: e.target.value})}
                    >
                      <option value="ALL">All Students (Global)</option>
                      <option value="FACULTY_CS">Faculty of Computing</option>
                      <option value="FACULTY_ENG">Faculty of Engineering</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Filter size={12} /> Priority Level
                    </label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-[22px] focus:ring-2 focus:ring-[#0c5252]/10 text-sm font-bold text-[#0c5252] appearance-none"
                      value={notification.type}
                      onChange={(e) => setNotification({...notification, type: e.target.value})}
                    >
                      <option value="BROADCAST">Standard Broadcast</option>
                      <option value="URGENT">Urgent Alert</option>
                      <option value="MAINTENANCE">Maintenance Info</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Headline</label>
                  <input 
                    type="text" required
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-[22px] focus:ring-2 focus:ring-[#0c5252]/10 text-sm font-bold text-[#0c5252] placeholder:text-gray-300"
                    placeholder="Enter notification title..."
                    value={notification.title}
                    onChange={(e) => setNotification({...notification, title: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Content Body</label>
                  <textarea 
                    required rows="6"
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-[22px] focus:ring-2 focus:ring-[#0c5252]/10 text-sm font-bold text-[#0c5252] placeholder:text-gray-300 resize-none"
                    placeholder="Write your detailed announcement here..."
                    value={notification.message}
                    onChange={(e) => setNotification({...notification, message: e.target.value})}
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="group flex-1 py-6 bg-[#0c5252] text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#083d3d] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-[#0c5252]/20">
                    {isEditing ? "Update Message" : "Broadcast Message"} 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="px-8 py-6 bg-gray-100 text-gray-400 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ALERTS SECTION */}
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6">
              {alerts.length === 0 ? (
                <div className="col-span-full bg-white p-20 rounded-[45px] text-center border border-white">
                  <Inbox size={40} className="text-gray-200 mx-auto mb-4" />
                  <h3 className="text-[#0c5252] font-black uppercase text-xs tracking-widest">No Alerts</h3>
                </div>
              ) : (
                alerts.map((item) => (
                  <div key={item.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-white hover:border-[#ebc070]/50 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center"><AlertCircle size={22} /></div>
                      <span className="text-[8px] font-black bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest text-gray-500">Pending</span>
                    </div>
                    <h4 className="text-[10px] font-black text-[#0c5252] uppercase tracking-widest mb-2">{item.type}</h4>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed mb-8">{item.message}</p>
                    <button 
                      onClick={() => handleDelete(item.id)} // Resolve කළ විට notification එක අයින් කිරීමට delete function එක call කරයි
                      className="w-full py-4 bg-gray-900 text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0c5252] transition-all"
                    >
                      <CheckCircle size={14} /> Resolve Request
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LOGS SECTION */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-[45px] shadow-sm border border-white overflow-hidden animate-in fade-in slide-in-from-bottom-6">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-[#0c5252] font-black text-sm uppercase tracking-widest flex items-center gap-3">
                  <Megaphone size={18} className="text-[#ebc070]" /> Broadcast Archive
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Recipient</th>
                      <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Message</th>
                      <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((log) => (
                      <tr key={log.id} className="group hover:bg-[#F8FAFC] transition-all">
                        <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            log.recipientEmail === 'ALL' ? 'bg-[#ebc070]/10 text-[#ebc070]' : 'bg-[#0c5252]/5 text-[#0c5252]'
                          }`}>
                            {log.recipientEmail}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="max-w-[300px]">
                            <p className="text-xs font-bold text-gray-700 truncate">{log.message}</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Sent: {new Date(log.createdAt).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => handleEdit(log)} className="p-2.5 bg-white text-blue-500 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => handleDelete(log.id)} className="p-2.5 bg-white text-rose-500 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Section (Sidebar Cards) - Occupies 1 column */}
        <div className="space-y-6">
          
          {/* Main Status Card */}
          <div className="bg-[#ebc070] rounded-[45px] p-8 text-white relative overflow-hidden group shadow-xl shadow-[#ebc070]/20">
            <Sparkles size={100} className="absolute -right-8 -top-8 opacity-20 group-hover:scale-125 transition-transform duration-700" />
            <h3 className="text-2xl font-black leading-tight mb-4 relative z-10">
              {isEditing ? "Update Mode." : "Instant Outreach."}
            </h3>
            <p className="text-white/80 text-[11px] font-bold leading-relaxed relative z-10">
              {isEditing 
                ? "You are currently editing an existing record. Changes will reflect immediately for all recipients."
                : "Deliver real-time announcements to the entire campus community in one click."
              }
            </p>
          </div>

          {/* Analytics Overview Card */}
          <div className="bg-white rounded-[40px] p-8 border border-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black text-[#0c5252] uppercase tracking-widest">Quick Stats</h4>
              <Activity size={14} className="text-[#ebc070]" />
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400">Total Logs</span>
                <span className="text-sm font-black text-[#0c5252]">{history.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400">Alerts</span>
                <span className="text-sm font-black text-rose-500">{alerts.length}</span>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Card */}
          <div className="bg-[#0c5252] rounded-[40px] p-8 text-white relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-[#ebc070] uppercase tracking-widest mb-6">Admin Tools</h4>
            <div className="space-y-4 relative z-10">
              <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-[#ebc070]" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Directory</span>
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[#ebc070]" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Scheduler</span>
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            </div>
            <ShieldCheck size={100} className="absolute -right-8 -bottom-8 opacity-5" />
          </div>

          {/* Support/Info Card */}
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-[40px] text-center">
            <Zap size={24} className="text-gray-300 mx-auto mb-3" />
            <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
              Need help? Contact the <br/> <span className="text-[#0c5252]">IT Operations Team</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPanel;