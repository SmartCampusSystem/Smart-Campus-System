import React, { useState } from 'react'; // useState එක් කළා
import { 
  Trash2, Image as ImageIcon, UserPlus, ShieldCheck, 
  User, Settings, Briefcase, ChevronDown, Fingerprint, 
  Mail, ShieldAlert, Cpu, Filter // Filter icon එක එක් කළා
} from 'lucide-react';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserDirectory = ({ users, searchTerm, fetchUsers }) => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('ALL'); // Role filter එක සඳහා state එක

    const handleDelete = async (id) => {
        if (!id) return;
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/users/${id}`); 
                toast.success("User deleted successfully");
                fetchUsers(); 
            } catch (err) {
                console.error("Delete Error:", err);
                toast.error("Failed to delete user");
            }
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await api.put(`/users/${id}/role`, newRole, {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success(`Access level updated to ${newRole}`);
            fetchUsers(); 
        } catch (err) {
            console.error("Role Update Error:", err);
            toast.error("Failed to update role");
        }
    };

    // Filter Logic එක Search සහ Role දෙකම අනුව update කළා
    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                             (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
        
        return matchesSearch && matchesRole;
    }) : [];

    const getRoleConfig = (role) => {
        switch (role) {
            case 'ADMIN': return {
                style: 'bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500',
                icon: <ShieldAlert size={12} className="text-amber-500" />
            };
            case 'MANAGER': return {
                style: 'bg-indigo-50 border-indigo-200 text-indigo-700 focus:ring-indigo-500',
                icon: <Briefcase size={12} className="text-indigo-500" />
            };
            case 'TECHNICIAN': return {
                style: 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500',
                icon: <Cpu size={12} className="text-emerald-500" />
            };
            default: return {
                style: 'bg-slate-50 border-slate-200 text-slate-600 focus:ring-slate-400',
                icon: <User size={12} className="text-slate-400" />
            };
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            {/* Header Section */}
            <div className="p-8 md:p-10 bg-gradient-to-b from-slate-50/50 to-transparent border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex -space-x-1">
                            <div className="w-2 h-2 rounded-full bg-[#e9c46a] animate-pulse"></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Intelligence</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        Personnel <span className="text-[#0c5252] not-italic">Matrix</span>
                    </h3>
                </div>
                <button 
                    onClick={() => navigate('/register')} 
                    className="group bg-[#0c5252] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#154646] transition-all flex items-center gap-3 shadow-2xl shadow-[#0c5252]/20 active:scale-95"
                >
                    <UserPlus size={16} className="group-hover:rotate-12 transition-transform" /> 
                    Deploy Entity
                </button>
            </div>

            {/* Quick Filter Bar - අලුතින් එක් කළ කොටස */}
            <div className="px-10 py-4 bg-slate-50/30 border-b border-slate-50 flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-400 mr-2">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filter by Role:</span>
                </div>
                <div className="flex gap-2">
                    {['ALL', 'USER', 'ADMIN', 'TECHNICIAN', 'MANAGER'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all border ${
                                selectedRole === role 
                                ? 'bg-[#0c5252] text-white border-[#0c5252] shadow-lg shadow-[#0c5252]/20' 
                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Identity Profile</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Communication Node</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Authorization</th>
                            <th className="p-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Terminal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-6 bg-slate-50 rounded-full">
                                            <Fingerprint size={48} className="text-slate-200" />
                                        </div>
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No matching entities found in database</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredUsers.map((u) => {
                            const roleConfig = getRoleConfig(u.role);
                            return (
                                <tr key={u.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                                    <td className="p-6 px-10">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-50 p-[2px] shadow-sm group-hover:rotate-3 transition-transform duration-500">
                                                    <div className="w-full h-full rounded-[0.9rem] bg-white overflow-hidden flex items-center justify-center border border-white">
                                                        {u.picture ? (
                                                            <img src={u.picture} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <ImageIcon className="text-slate-200" size={20} />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black text-slate-800 text-sm tracking-tight uppercase">{u.name}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <Fingerprint size={10} className="text-[#0c5252]/40" />
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-[#0c5252]/10 group-hover:text-[#0c5252] transition-colors">
                                                        HEX_{u.id?.slice(-6).toUpperCase() || "NULL"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#0c5252] transition-colors">
                                                <Mail size={14} />
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-600 tracking-tight">{u.email}</span>
                                        </div>
                                    </td>

                                    <td className="p-6">
                                        <div className="relative inline-block w-44">
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-70 group-hover:opacity-100 transition-opacity`}>
                                                {roleConfig.icon}
                                            </div>
                                            <select 
                                                value={u.role || 'USER'}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className={`appearance-none w-full pl-10 pr-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border-2 transition-all cursor-pointer outline-none focus:ring-4 focus:ring-opacity-20 ${roleConfig.style}`}
                                            >
                                                <option value="USER">Base User</option>
                                                <option value="ADMIN">Administrator</option>
                                                <option value="TECHNICIAN">Technician</option>
                                                <option value="MANAGER">Executive</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:translate-y-[-40%] transition-transform">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-6 px-10 text-right">
                                        <button 
                                            onClick={() => handleDelete(u.id)}
                                            className="p-3.5 text-slate-400 hover:text-white hover:bg-rose-500 hover:shadow-[0_10px_20px_rgba(244,63,94,0.3)] rounded-xl transition-all duration-300 bg-white border border-slate-100 shadow-sm active:scale-90"
                                            title="Purge Identity"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Footer Stat */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">
                    Total Registered Entities: {filteredUsers.length}
                 </p>
            </div>
        </div>
    );
};

export default UserDirectory;