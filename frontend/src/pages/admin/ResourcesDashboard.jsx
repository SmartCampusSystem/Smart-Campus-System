import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
    Plus, Search, Edit2, Trash2, MapPin, 
    Users, Layout, Save, X, AlertCircle 
} from 'lucide-react';
import api from '../../api/axiosInstance';

const ResourcesDashboard = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'ROOM',
        capacity: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            const response = await api.get('/resources');
            setResources(response.data);
        } catch (error) {
            toast.error("Failed to fetch resources");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (resource = null) => {
        if (resource) {
            setEditingId(resource.id);
            setFormData({
                name: resource.name,
                type: resource.type,
                capacity: resource.capacity,
                location: resource.location,
                description: resource.description
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', type: 'ROOM', capacity: '', location: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/resources/${editingId}`, formData);
                toast.success("Resource updated successfully");
            } else {
                await api.post('/resources', formData);
                toast.success("New resource added");
            }
            setIsModalOpen(false);
            fetchResources();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await api.delete(`/resources/${id}`);
                toast.success("Resource deleted");
                fetchResources();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const filteredResources = resources.filter(res => 
        res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Resource Inventory</h1>
                    <p className="text-slate-500 text-sm">Manage campus rooms, equipment, and facilities.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 bg-[#0c5252] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#083d3d] transition-all"
                >
                    <Plus size={18} /> Add New Resource
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search resources by name or location..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c5252]/20 focus:outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Resource Name</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Type</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Capacity</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase">Location</th>
                            <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-10 text-center text-slate-400">Loading resources...</td></tr>
                        ) : filteredResources.length === 0 ? (
                            <tr><td colSpan="5" className="p-10 text-center text-slate-400">No resources found.</td></tr>
                        ) : filteredResources.map((res) => (
                            <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#0c5252]/5 rounded-lg flex items-center justify-center text-[#0c5252]">
                                            <Layout size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 uppercase text-sm">{res.name || 'Unnamed Resource'}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">ID: {res.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                        {res.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Users size={14} />
                                        <span className="text-sm font-semibold">{res.capacity}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <MapPin size={14} />
                                        <span className="text-sm">{res.location}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => openModal(res)}
                                            className="p-2 text-slate-400 hover:text-[#0c5252] hover:bg-[#0c5252]/5 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(res.id)}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId ? "Edit Resource" : "Add New Resource"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name</label>
                                    <input 
                                        type="text" required name="name" value={formData.name} onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c5252]/20 focus:outline-none"
                                        placeholder="e.g. Lab 01"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Type</label>
                                    <select 
                                        name="type" value={formData.type} onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c5252]/20 focus:outline-none"
                                    >
                                        <option value="ROOM">Room</option>
                                        <option value="LAB">Laboratory</option>
                                        <option value="EQUIPMENT">Equipment</option>
                                        <option value="HALL">Lecture Hall</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Capacity</label>
                                    <input 
                                        type="number" required name="capacity" value={formData.capacity} onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c5252]/20 focus:outline-none"
                                        placeholder="Max persons"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Location</label>
                                    <input 
                                        type="text" required name="location" value={formData.location} onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c5252]/20 focus:outline-none"
                                        placeholder="e.g. Building A"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                                <textarea 
                                    name="description" value={formData.description} onChange={handleInputChange} rows="3"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0c5252]/20 focus:outline-none resize-none"
                                    placeholder="Enter facility details..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-[#0c5252] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#0c5252]/20 transition-all flex items-center justify-center gap-2">
                                    <Save size={18} /> {editingId ? "Update Resource" : "Create Resource"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourcesDashboard;