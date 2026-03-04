import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance'; 
import { supabase } from '../../supabaseClient'; 
import { 
  Users, LayoutDashboard, PlusCircle, Database, Upload, 
  Trash2, Image as ImageIcon, Loader2, Search, 
  UserPlus, ShieldCheck, GraduationCap, TrendingUp, RefreshCcw
} from 'lucide-react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('student-images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('student-images').getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
    } catch (error) {
      alert(`Upload Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return alert("Please fill Name and Email");
    setLoading(true);
    try {
      await api.post('/users', { name, email, imageUrl });
      setName(''); setEmail(''); setImageUrl('');
      fetchUsers();
      alert("Student Registered Successfully!");
    } catch (error) {
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar - Fixed Width */}
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
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <NavItem icon={<Users size={18}/>} label="Students List" />
        </nav>

        <div className="p-6 m-4 bg-indigo-900/40 border border-indigo-800/50 rounded-2xl">
          <p className="text-[10px] font-black text-indigo-300 uppercase mb-2">Cloud Database</p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[70%]"></div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center shrink-0 shadow-xs">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2.5 rounded-xl w-full max-w-md border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search student..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">Administrator</p>
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <p className="text-[9px] text-slate-400 font-bold uppercase">System Live</p>
              </div>
            </div>
            {/* Tailwind v4 Canonical Gradient Class */}
            <div className="w-10 h-10 bg-linear-to-tr from-indigo-600 to-indigo-400 rounded-xl shadow-md flex items-center justify-center text-white font-black border border-white/20">A</div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-10 space-y-8">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Users size={20}/>} label="Total Students" value={users.length} color="bg-indigo-50 text-indigo-600" />
            <StatCard icon={<UserPlus size={20}/>} label="Recent Sync" value="+4" color="bg-emerald-50 text-emerald-600" />
            <StatCard icon={<TrendingUp size={20}/>} label="Status" value="98%" color="bg-amber-50 text-amber-600" />
            <StatCard icon={<ShieldCheck size={20}/>} label="Access Level" value="Root" color="bg-blue-50 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Form (Sticky) */}
            <div className="lg:col-span-4 bg-white p-8 rounded-4xl shadow-sm border border-slate-200 sticky top-0">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white"><PlusCircle size={14}/></div>
                Registration
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <div className={`w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${imageUrl ? 'border-indigo-400' : 'border-slate-200 bg-slate-50'}`}>
                    {uploading ? (
                      <Loader2 className="animate-spin text-indigo-600" size={24} />
                    ) : imageUrl ? (
                      <img src={imageUrl} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                    ) : (
                      <div className="text-center">
                        <Upload className="text-slate-300 mx-auto mb-2" size={24} />
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Profile Photo</p>
                      </div>
                    )}
                  </div>
                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>

                <div className="space-y-4">
                  <InputGroup label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <InputGroup label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || uploading} 
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
                >
                  {loading ? 'Submitting...' : 'Register Student'}
                </button>
              </form>
            </div>

            {/* Right Column: List */}
            <div className="lg:col-span-8 bg-white rounded-4xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Database Record</h3>
                <button onClick={fetchUsers} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><RefreshCcw size={16}/></button>
              </div>

              {/* Tailwind v4 Canonical max-h class */}
              <div className="overflow-x-auto max-h-150 custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="p-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Network ID</th>
                      <th className="p-5 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-all group">
                        <td className="p-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                              {u.imageUrl ? <img src={u.imageUrl} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="m-auto text-slate-300 h-full p-2" />}
                            </div>
                            <div>
                               <p className="font-black text-slate-800 text-xs uppercase">{u.name}</p>
                               <p className="text-[9px] font-bold text-slate-400">UID: {u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                           <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{u.email}</span>
                        </td>
                        <td className="p-5 px-8 text-right">
                          <button onClick={() => deleteUser(u.id)} className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="p-20 text-center text-slate-400 text-xs italic">No data records found in storage.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-5">
      <div className={`p-3.5 rounded-xl ${color}`}>{icon}</div>
      <div>
        <h4 className="text-xl font-black text-slate-800 leading-none">{value}</h4>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}

function InputGroup({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <input 
        {...props} 
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all placeholder:text-slate-300"
      />
    </div>
  );
}

export default AdminDashboard;