import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { 
  Ticket, Plus, Search, Filter, Calendar, 
  MapPin, AlertCircle, CheckCircle, Clock,
  User, ArrowRight, Sparkles, ShieldCheck,
  Upload, X, FileImage, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: 'IT_Hardware',
    priority: 'MEDIUM',
    resourceId: '',
    buildingName: '',
    floor: '',
    block: '',
    roomNumber: '',
    location: '',
    preferredContact: ''
  });
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Validation functions
  const validateBuildingName = (value) => {
    // Only English letters (uppercase/lowercase) and spaces allowed
    const buildingNameRegex = /^[A-Za-z\s]+$/;
    return buildingNameRegex.test(value);
  };

  const validateFloor = (value) => {
    // Only digits allowed, must be between 1-14
    const floorNum = parseInt(value);
    return /^\d+$/.test(value) && floorNum >= 1 && floorNum <= 14;
  };

  const validateBlock = (value) => {
    // Only one uppercase letter A-Z allowed
    const blockRegex = /^[A-Z]$/;
    return blockRegex.test(value);
  };

  const validateRoomNumber = (value) => {
    // Only digits allowed
    const roomNumberRegex = /^\d+$/;
    return roomNumberRegex.test(value);
  };

  const validatePreferredContact = (value) => {
    // Allow empty or partial digits during typing, only validate complete 10-digit format
    if (value === '') return true; // Allow empty during typing
    const phoneRegex = /^0\d*$/; // Allow 0 followed by digits (partial)
    return phoneRegex.test(value);
  };

  const validateLocationDetails = (value) => {
    // Must start with one uppercase letter, followed by digits only
    const locationRegex = /^[A-Z]\d*$/;
    return locationRegex.test(value);
  };

  // Handle input changes with validation
  const handleBuildingNameChange = (e) => {
    const value = e.target.value;
    if (value === '' || validateBuildingName(value)) {
      setFormData({...formData, buildingName: value});
    }
  };

  const handleFloorChange = (e) => {
    const value = e.target.value;
    if (value === '' || validateFloor(value)) {
      setFormData({...formData, floor: value});
    }
  };

  const handleBlockChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value === '' || validateBlock(value)) {
      setFormData({...formData, block: value});
    }
  };

  const handleRoomNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || validateRoomNumber(value)) {
      setFormData({...formData, roomNumber: value});
    }
  };

  const handlePreferredContactChange = (e) => {
    const value = e.target.value;
    if (value === '' || validatePreferredContact(value)) {
      setFormData({...formData, preferredContact: value});
    }
  };

  const handleLocationDetailsChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value === '' || validateLocationDetails(value)) {
      setFormData({...formData, location: value});
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'IT_Hardware',
    priority: 'MEDIUM',
    resourceId: '',
    buildingName: '',
    floor: '',
    block: '',
    roomNumber: '',
    location: '',
    preferredContact: ''
  });

  const [attachments, setAttachments] = useState([]);
  const [editAttachments, setEditAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Allow all files without validation
    const totalFiles = [...attachments, ...files];
    setAttachments(totalFiles);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets/my');
      setTickets(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      toast.error("Failed to load tickets");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation for required fields
    const missingFields = [];
    if (!formData.title?.trim()) missingFields.push('Title');
    if (!formData.description?.trim()) missingFields.push('Description');
    if (!formData.category?.trim()) missingFields.push('Category');
    if (!formData.priority?.trim()) missingFields.push('Priority');
    if (!formData.buildingName?.trim()) missingFields.push('Building Name');
    if (!formData.floor?.trim()) missingFields.push('Floor');
    if (!formData.block?.trim()) missingFields.push('Block');
    if (!formData.roomNumber?.trim()) missingFields.push('Room Number');
    if (!formData.preferredContact?.trim()) missingFields.push('Preferred Contact');
    
    if (missingFields.length > 0) {
      toast.error(`Please fill required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Additional validation for specific field formats
    if (!validateBuildingName(formData.buildingName)) {
      toast.error("Building Name must contain only English letters and spaces");
      return;
    }
    if (!validateFloor(formData.floor)) {
      toast.error("Floor must be a number between 1 and 14");
      return;
    }
    if (!validateBlock(formData.block)) {
      toast.error("Block must be a single uppercase letter A-Z");
      return;
    }
    if (!validateRoomNumber(formData.roomNumber)) {
      toast.error("Room Number must contain only digits");
      return;
    }
    // Validate complete 10-digit phone format on submission
    const completePhoneRegex = /^0\d{9}$/;
    if (!completePhoneRegex.test(formData.preferredContact)) {
      toast.error("Preferred Contact must be exactly 10 digits starting with 0");
      return;
    }
    
    try {
      console.log('Creating ticket with data:', formData);
      console.log('Attachments count:', attachments.length);
      
      // First create the ticket
      const response = await api.post('/tickets', formData);
      const newTicket = response.data;
      
      console.log('Ticket creation response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.status === 201) {
        toast.success("Ticket created successfully!");
        
        // If there are attachments, upload them
        if (attachments.length > 0) {
          setUploading(true);
          const formDataUpload = new FormData();
          attachments.forEach(file => {
            formDataUpload.append('files', file);
          });
          
          try {
            const uploadResponse = await api.post(`/tickets/${newTicket.id}/attachments`, formDataUpload, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            
            console.log('Attachment upload response:', uploadResponse);
            
            if (uploadResponse.status === 200) {
              toast.success("Ticket and attachments created successfully!");
            } else {
              toast.error(`Attachment upload failed: ${uploadResponse.data?.error || 'Unknown error'}`);
            }
          } catch (uploadErr) {
            console.error("Error uploading attachments:", uploadErr);
          } finally {
            setUploading(false);
          }
        } else {
          toast.success("Ticket created successfully!");
        }
        
        // Refresh tickets list
        fetchTickets();
        
        // Reset form
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          category: 'IT_Hardware',
          priority: 'MEDIUM',
          resourceId: '',
          buildingName: '',
          floor: '',
          block: '',
          roomNumber: '',
          location: '',
          preferredContact: ''
        });
        setAttachments([]);
      } else {
        console.error('Ticket creation failed with status:', response.status);
        console.error('Error response:', response.data);
        
        const errorMessage = response.data?.error || response.statusText || 'Unknown error occurred';
        toast.error(`Failed to create ticket: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Ticket creation error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      toast.error(`Failed to create ticket: ${error.message}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedTicket) return;
    
    try {
      // Update ticket data first
      await api.put(`/tickets/${selectedTicket.id}`, editFormData);
      
      // Handle attachments - upload new ones
      const newAttachments = editAttachments.filter(att => att instanceof File);
      if (newAttachments.length > 0) {
        const formData = new FormData();
        newAttachments.forEach(file => {
          formData.append('files', file);
        });
        
        await api.post(`/tickets/${selectedTicket.id}/attachments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      toast.success("Ticket updated successfully!");
      setShowEditForm(false);
      setEditFormData({
        title: '',
        description: '',
        category: 'IT_Hardware',
        priority: 'MEDIUM',
        resourceId: '',
        buildingName: '',
        floor: '',
        block: '',
        roomNumber: '',
        location: '',
        preferredContact: ''
      });
      setEditAttachments([]);
      fetchTickets();
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error("Failed to update ticket");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setEditFormData({
      title: ticket.title || '',
      description: ticket.description || '',
      category: ticket.category || 'IT_Hardware',
      priority: ticket.priority || 'MEDIUM',
      resourceId: ticket.resourceId || '',
      buildingName: ticket.buildingName || '',
      floor: ticket.floor || '',
      block: ticket.block || '',
      roomNumber: ticket.roomNumber || '',
      location: ticket.location || '',
      preferredContact: ticket.preferredContact || ''
    });
    setEditAttachments(ticket.attachments || []);
    setShowDetailsModal(false);
    setShowEditForm(true);
  };

  const handleEditFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Filter for image files only (matching backend validation)
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/')
    );
    
    // Check file size (5MB limit)
    const validFiles = imageFiles.filter(file => 
      file.size <= 5 * 1024 * 1024
    );
    
    // Check total file limit (3 files max)
    const totalFiles = [...editAttachments, ...validFiles];
    if (totalFiles.length > 3) {
      toast.error('Maximum 3 files allowed');
      return;
    }
    
    setEditAttachments(totalFiles);
  };

  const removeEditAttachment = (index) => {
    const newAttachments = editAttachments.filter((_, i) => i !== index);
    setEditAttachments(newAttachments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTicket) return;
    
    try {
      const commentData = {
        text: newComment.trim()
      };
      
      await api.post(`/tickets/${selectedTicket.id}/comments`, commentData);
      toast.success("Comment added successfully!");
      setNewComment('');
      
      // Refresh ticket data to get new comments
      const updatedTicket = await api.get(`/tickets/${selectedTicket.id}`);
      setSelectedTicket(updatedTicket.data);
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.text);
  };

  const handleSaveEdit = async () => {
    if (!editCommentText.trim() || !editingComment || !selectedTicket) return;
    
    try {
      await api.put(`/tickets/${selectedTicket.id}/comments/${editingComment}`, {
        text: editCommentText.trim()
      });
      toast.success("Comment updated successfully!");
      setEditingComment(null);
      setEditCommentText('');
      
      // Refresh ticket data
      const updatedTicket = await api.get(`/tickets/${selectedTicket.id}`);
      setSelectedTicket(updatedTicket.data);
    } catch (err) {
      console.error("Error updating comment:", err);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedTicket) return;
    
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await api.delete(`/tickets/${selectedTicket.id}/comments/${commentId}`);
      toast.success("Comment deleted successfully!");
      
      // Refresh ticket data
      const updatedTicket = await api.get(`/tickets/${selectedTicket.id}`);
      setSelectedTicket(updatedTicket.data);
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    }
  };

  const canEditComment = (comment) => {
    // For now, allow editing all comments (in production, check against logged-in user)
    return true;
  };

  const canDeleteComment = (comment) => {
    // For now, allow deleting all comments (in production, check against logged-in user)
    return true;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'bg-green-50 text-green-700 border-green-200';
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20">
      <Navbar />

      {/* Header Section */}
      <div className="relative pt-40 pb-20 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[30%] h-full bg-slate-50/50 -skew-x-12 translate-x-20 -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 text-[#ebc070] font-black text-[11px] uppercase tracking-[0.4em] mb-6">
            <Ticket size={18} /> Module C / Incident Management
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-[#0c5252] leading-[0.9] tracking-tighter uppercase mb-6">
            Support <br /> <span className="text-slate-300 font-light italic lowercase">Tickets.</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl">
            Report and track campus infrastructure issues and maintenance requests.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#0c5252] text-white rounded-xl hover:bg-[#0a4040] transition-all duration-300 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c5252]"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6">Create your first ticket to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ebc070] text-[#0c5252] rounded-xl hover:bg-[#f3d393] transition-all duration-300 font-semibold"
            >
              <Plus size={20} />
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[#0c5252] mb-2 group-hover:text-[#ebc070] transition-colors">
                      {ticket.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin size={14} />
                      {ticket.location}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                      {ticket.status?.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {ticket.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    {ticket.creatorName}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {ticket.category}
                  </span>
                  <button 
                    onClick={() => handleViewDetails(ticket)}
                    className="text-[#0c5252] hover:text-[#ebc070] transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    View Details
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0c5252] rounded-xl flex items-center justify-center">
                    <Ticket className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0c5252]">Create Support Ticket</h2>
                    <p className="text-sm text-gray-500">Report an issue or maintenance request</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent h-32 resize-none"
                  placeholder="Detailed description of the issue"
                  required
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  >
                    <option value="IT_Hardware">IT Hardware</option>
                    <option value="IT_Support">IT Support</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Network">Network</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Repair">Repair</option>
                    <option value="Safety">Safety</option>
                    <option value="Security">Security</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              {/* Resource ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource ID (Optional)</label>
                <input
                  type="text"
                  value={formData.resourceId}
                  onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  placeholder="Link to a resource"
                />
              </div>

              {/* Structured Location Fields */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-[#0c5252]" />
                  Location Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.buildingName}
                      onChange={handleBuildingNameChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                      placeholder="e.g., Engineering Building"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Only English letters and spaces allowed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={handleFloorChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                      placeholder="e.g., 1, 2, 3...14"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Only digits 1-14 allowed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Block <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.block}
                      onChange={handleBlockChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                      placeholder="e.g., A, B, C"
                      maxLength={1}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Only one uppercase letter A-Z allowed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={handleRoomNumberChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                      placeholder="e.g., 301, 205, 101"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Only digits allowed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Location Details</label>
                  <textarea
                    value={formData.location}
                    onChange={handleLocationDetailsChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent h-20 resize-none"
                    placeholder="e.g., A101, B205, C301"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must start with one uppercase letter followed by digits only</p>
                </div>
              </div>

              {/* Preferred Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.preferredContact}
                  onChange={handlePreferredContactChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  placeholder="e.g., 0712345678"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be 10 digits starting with 0 (e.g., 0712345678)</p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#0c5252] transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-600">Click to upload files</span>
                    <span className="text-xs text-gray-400 mt-1">Any file type allowed</span>
                  </label>
                </div>

                {/* File Preview */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileImage className="text-[#0c5252]" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-[#0c5252] text-white rounded-xl hover:bg-[#0a4040] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Create Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#0c5252] to-[#0a4040]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Ticket className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedTicket.title}</h2>
                    <p className="text-white/80 text-sm">Ticket ID: {selectedTicket.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white/80 hover:text-white transition-colors text-2xl font-light"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Priority Badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedTicket.status)}`}>
                  Status: {selectedTicket.status?.replace('_', ' ')}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(selectedTicket.priority)}`}>
                  Priority: {selectedTicket.priority}
                </span>
                <span className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-200 rounded-full text-sm font-semibold">
                  Category: {selectedTicket.category}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Description
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                  <MapPin size={20} />
                  Location Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Building:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.buildingName || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Floor:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.floor || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Block:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.block || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Room Number:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.roomNumber || 'Not specified'}</p>
                    </div>
                  </div>
                  {selectedTicket.location && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Additional Location Details:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                  <User size={20} />
                  Contact Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Created By:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.creatorName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.creatorEmail}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Preferred Contact:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.preferredContact || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Assigned Technician:</span>
                      <p className="font-medium text-gray-800">{selectedTicket.assignedTechnician || 'Not assigned'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                  <Clock size={20} />
                  Timeline
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <AlertCircle size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Ticket Created</p>
                      <p className="text-sm text-gray-500">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedTicket.updatedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock size={16} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Last Updated</p>
                        <p className="text-sm text-gray-500">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  {(selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED') && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Ticket {selectedTicket.status}</p>
                        <p className="text-sm text-gray-500">Resolution completed</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Attachments */}
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                    <Upload size={20} />
                    Attachments ({selectedTicket.attachments.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedTicket.attachments.map((attachment, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#ebc070] rounded-lg flex items-center justify-center">
                            <FileImage size={20} className="text-[#0c5252]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{attachment.filename}</p>
                            <p className="text-sm text-gray-500">
                              {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(`http://localhost:8082${attachment.fileUrl}`, '_blank')}
                          className="mt-3 w-full px-3 py-2 bg-[#0c5252] text-white rounded-lg hover:bg-[#0a4040] transition-colors text-sm"
                        >
                          View File
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Comments ({selectedTicket.comments?.length || 0})
                </h3>
                
                {/* Add Comment */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-[#0c5252] text-white rounded-lg hover:bg-[#0a4040] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#ebc070] rounded-full flex items-center justify-center">
                              <User size={16} className="text-[#0c5252]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{comment.authorName}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                  <span className="ml-2 text-blue-600">(edited)</span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center gap-2">
                            {canEditComment(comment) && (
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                              >
                                Edit
                              </button>
                            )}
                            {canDeleteComment(comment) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-600 hover:text-red-800 transition-colors text-sm"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Comment Content */}
                        {editingComment === comment.id ? (
                          <div>
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent resize-none text-sm"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditCommentText('');
                                }}
                                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                disabled={!editCommentText.trim()}
                                className="px-3 py-1 bg-[#0c5252] text-white rounded-lg hover:bg-[#0a4040] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Resolution Information */}
              {(selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED' || selectedTicket.status === 'REJECTED') && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Resolution Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedTicket.resolutionNote && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">Resolution Note:</span>
                        <p className="font-medium text-gray-800">{selectedTicket.resolutionNote}</p>
                      </div>
                    )}
                    {selectedTicket.rejectionReason && (
                      <div>
                        <span className="text-sm text-gray-500">Rejection Reason:</span>
                        <p className="font-medium text-red-600">{selectedTicket.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resource Link */}
              {selectedTicket.resourceId && (
                <div>
                  <h3 className="text-lg font-semibold text-[#0c5252] mb-3 flex items-center gap-2">
                    <ShieldCheck size={20} />
                    Related Resource
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">Resource ID: <span className="font-medium text-gray-800">{selectedTicket.resourceId}</span></p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditForm && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#ebc070] rounded-xl flex items-center justify-center">
                    <Ticket className="text-[#0c5252]" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0c5252]">Edit Ticket</h2>
                    <p className="text-sm text-gray-500">Update ticket information</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  required
                />
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  >
                    <option value="IT_Hardware">IT Hardware</option>
                    <option value="IT_Support">IT Support</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Network">Network</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Repair">Repair</option>
                    <option value="Safety">Safety</option>
                    <option value="Security">Security</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              {/* Resource ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource ID (Optional)
                </label>
                <input
                  type="text"
                  value={editFormData.resourceId}
                  onChange={(e) => setEditFormData({...editFormData, resourceId: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  placeholder="Link to a resource from Module A"
                />
              </div>

              {/* Structured Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Building Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.buildingName}
                    onChange={(e) => setEditFormData({...editFormData, buildingName: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.floor}
                    onChange={(e) => setEditFormData({...editFormData, floor: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.block}
                    onChange={(e) => setEditFormData({...editFormData, block: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.roomNumber}
                    onChange={(e) => setEditFormData({...editFormData, roomNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Location Details
                </label>
                <textarea
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  placeholder="Any additional location information..."
                />
              </div>

              {/* Preferred Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact
                </label>
                <input
                  type="text"
                  value={editFormData.preferredContact}
                  onChange={(e) => setEditFormData({...editFormData, preferredContact: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  placeholder="Email or phone number for follow-up"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Images only, max 3 files, 5MB each)
                </label>
                
                {/* Existing Attachments */}
                {editAttachments.filter(att => !(att instanceof File)).length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current attachments:</p>
                    <div className="space-y-2">
                      {editAttachments.filter(att => !(att instanceof File)).map((attachment, index) => (
                        <div key={attachment.id || index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <FileImage size={20} className="text-[#0c5252]" />
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{attachment.filename}</p>
                              <p className="text-xs text-gray-500">
                                {attachment.fileSize ? `${(attachment.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Existing file'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => window.open(`http://localhost:8082${attachment.fileUrl}`, '_blank')}
                            className="text-[#0c5252] hover:text-[#ebc070] transition-colors text-sm"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Attachments */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Upload size={20} className="text-[#0c5252]" />
                    <span className="text-sm text-gray-600">Add new attachments:</span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0c5252] focus:border-transparent"
                  />
                  {editAttachments.filter(att => att instanceof File).length > 0 && (
                    <div className="mt-3 space-y-2">
                      {editAttachments.filter(att => att instanceof File).map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-[#ebc070]/20 p-3 rounded-lg border border-[#ebc070]">
                          <div className="flex items-center gap-3">
                            <FileImage size={20} className="text-[#0c5252]" />
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEditAttachment(editAttachments.indexOf(file))}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0c5252] text-white rounded-xl hover:bg-[#0a4040] transition-all duration-300 font-semibold"
                >
                  Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
