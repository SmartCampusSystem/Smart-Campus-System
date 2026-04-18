import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance'; 
import { 
  Users, LayoutDashboard, Database, Trash2, 
  Image as ImageIcon, Search, ShieldCheck, 
  GraduationCap, TrendingUp, RefreshCcw, UserCheck
} from 'lucide-react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // පද්ධතියේ සිටින සියලුම පරිශීලකයන් ලබා ගැනීම
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users');
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search කිරීමේ හැකියාව
  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  ) : [];

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#1e1b4b] text-white flex flex-col shadow-2xl shrink-0">
        <div className="p-8 flex items-center gap-4 border-b border-indigo-900/50">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase">Smart Campus</h1>
            <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mt-1">Admin OS</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Overview" />
          <NavItem icon={<Users size={18}/>} label="User Directory" active />
        </nav>

        <div className="p-6 m-4 bg-indigo-900/40 border border-indigo-800/50 rounded-2xl">
          <p className="text-[10px] font-black text-indigo-300 uppercase mb-2">System Integrity</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">All Modules Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2.5 rounded-xl w-full max-w-md border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
             <button onClick={fetchUsers} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
                Sync Data
             </button>
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl shadow-md flex items-center justify-center text-white font-black border border-white/20">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 space-y-8">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Users size={20}/>} label="Registered Users" value={users.length} color="bg-indigo-50 text-indigo-600" />
            <StatCard icon={<ShieldCheck size={20}/>} label="Admin Roles" value="1 Active" color="bg-blue-50 text-blue-600" />
            <StatCard icon={<UserCheck size={20}/>} label="System Access" value="Granted" color="bg-emerald-50 text-emerald-600" />
            <StatCard icon={<TrendingUp size={20}/>} label="Load Factor" value="Optimal" color="bg-amber-50 text-amber-600" />
          </div>

          {/* Full Width Users Table */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-widest">User Management Directory</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">Manage campus portal access and user profiles</p>
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-400px)]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="p-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile & Identity</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Credentials</th>
                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">System Role</th>
                    <th className="p-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="p-6 px-10">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm flex-shrink-0">
                            {u.imageUrl ? <img src={u.imageUrl} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="m-auto text-slate-300 h-full p-3" />}
                          </div>
                          <div>
                             <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{u.name}</p>
                             <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">DB-ID: #{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-600">{u.email}</span>
                            <span className="text-[9px] font-black text-slate-300 uppercase mt-1">Campus Mail Verified</span>
                          </div>
                      </td>
                      <td className="p-6 text-center">
                          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {u.role || 'USER'}
                          </span>
                      </td>
                      <td className="p-6 px-10 text-right">
                        <button 
                          onClick={() => deleteUser(u.id)} 
                          className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 ml-auto"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest">Terminate Access</span>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <Database size={48} className="text-slate-200" />
                           <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">No User Records Synchronized</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- UI COMPONENTS ---

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
      <div className={`p-4 rounded-2xl ${color} shadow-sm`}>{icon}</div>
      <div>
        <h4 className="text-2xl font-black text-slate-800 leading-none">{value}</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;