import React from 'react';
import { Trash2, Image as ImageIcon, UserPlus, ShieldCheck, User } from 'lucide-react';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

const UserDirectory = ({ users, searchTerm, fetchUsers }) => {

    // 1. User කෙනෙක්ව අයින් කිරීම
    const handleDelete = async (id) => {
        if (!id) return;
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                // baseURL එකේ /api තියෙනවා නම් මෙතන /users විතරක් ඇති
                await api.delete(`/users/${id}`); 
                toast.success("User deleted successfully");
                fetchUsers(); 
            } catch (err) {
                console.error("Delete Error:", err);
                toast.error("Failed to delete user");
            }
        }
    };

    // 2. Role එක වෙනස් කිරීම
    const handleRoleChange = async (id, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        try {
            // Backend එකට Plain string එකක් යවන්න (JSON stringify අවශ්‍ය නැහැ axiosInstance එකෙන් handle කරනවා නම්)
            await api.put(`/users/${id}/role`, newRole, {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success(`Role changed to ${newRole}`);
            fetchUsers(); 
        } catch (err) {
            console.error("Role Update Error:", err);
            toast.error("Failed to update role");
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user => 
        (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#e9c46a]"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Database</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">User <span className="text-[#0c5252]">Directory.</span></h3>
                </div>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
                    <UserPlus size={14}/> + Deploy New Account
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#fcfdfd]">
                        <tr>
                            <th className="p-8 px-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Identity Profile</th>
                            <th className="p-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Access Credentials</th>
                            <th className="p-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Role Level</th>
                            <th className="p-8 px-10 text-right text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">No matching records found</td>
                            </tr>
                        ) : filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-[#f8fafa] transition-all group">
                                <td className="p-8 px-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-[1.25rem] bg-slate-100 border-2 border-white overflow-hidden shadow-sm flex-shrink-0 flex items-center justify-center">
                                            {u.picture ? (
                                                <img src={u.picture} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <ImageIcon className="text-slate-200" size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm uppercase tracking-tight leading-none">{u.name}</p>
                                            <p className="text-[10px] font-bold text-[#0c5252] uppercase mt-2 bg-[#0c5252]/5 px-2 py-0.5 rounded-md inline-block tracking-tighter">
                                                UID: {u.id?.slice(-6).toUpperCase() || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="p-8">
                                    <span className="text-[12px] font-black text-slate-600 tracking-tight italic">{u.email}</span>
                                </td>

                                <td className="p-8">
                                    <button 
                                        onClick={() => handleRoleChange(u.id, u.role)}
                                        className={`flex items-center gap-2 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] border-2 transition-all hover:scale-105 ${
                                            u.role === 'ADMIN' 
                                            ? 'bg-[#e9c46a]/10 border-[#e9c46a]/20 text-[#7c5c14]' 
                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                        }`}
                                    >
                                        {u.role === 'ADMIN' ? <ShieldCheck size={12}/> : <User size={12}/>}
                                        {u.role || 'USER'}
                                    </button>
                                </td>

                                <td className="p-8 px-10 text-right">
                                    <button 
                                        onClick={() => handleDelete(u.id)}
                                        className="p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-[1.25rem] transition-all bg-slate-50 border border-slate-100"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDirectory;