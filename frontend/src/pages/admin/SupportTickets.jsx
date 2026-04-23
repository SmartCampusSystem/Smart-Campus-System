"use client";

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { 
  Ticket, User, Calendar, AlertCircle, CheckCircle, 
  Clock, MessageSquare, Filter, Search, ChevronDown,
  X, ArrowRight, ShieldCheck, Users, FileText,
  TrendingUp, Activity
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryView, setShowCategoryView] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  // Categories with icons and colors
  const categories = [
    { value: 'IT_Hardware', label: 'IT Hardware', icon: '💻', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { value: 'IT_Support', label: 'IT Support', icon: '🛠️', color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    { value: 'Maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-orange-500', bgColor: 'bg-orange-50' },
    { value: 'Network', label: 'Network', icon: '🌐', color: 'bg-green-500', bgColor: 'bg-green-50' },
    { value: 'Plumbing', label: 'Plumbing', icon: '🚿', color: 'bg-cyan-500', bgColor: 'bg-cyan-50' },
    { value: 'Repair', label: 'Repair', icon: '⚡', color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
    { value: 'Safety', label: 'Safety', icon: '🛡️', color: 'bg-red-500', bgColor: 'bg-red-50' },
    { value: 'Security', label: 'Security', icon: '🔒', color: 'bg-indigo-500', bgColor: 'bg-indigo-50' },
    { value: 'Electrical', label: 'Electrical', icon: '⚡', color: 'bg-amber-500', bgColor: 'bg-amber-50' },
    { value: 'Facilities', label: 'Facilities', icon: '🏢', color: 'bg-teal-500', bgColor: 'bg-teal-50' }
  ];

  // Ticket status workflow
  const statusOptions = [
    { value: 'ALL', label: 'All Tickets', color: 'bg-gray-100 text-gray-700' },
    { value: 'OPEN', label: 'Open', color: 'bg-blue-100 text-blue-700' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-100 text-green-700' },
    { value: 'CLOSED', label: 'Closed', color: 'bg-gray-100 text-gray-600' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-700' }
  ];

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-orange-100 text-orange-700',
    CRITICAL: 'bg-red-100 text-red-700'
  };

  useEffect(() => {
    fetchTickets();
    fetchTechnicians();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tickets');
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await api.get('/tickets/technicians');
      setTechnicians(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      toast.error('Failed to load technicians');
    }
  };

  const updateTicketStatus = async (ticketId, newStatus, reason = '') => {
    try {
      console.log('Debug - Admin updating ticket status:', { ticketId, newStatus, reason });
      
      // Try minimal payload first (most compatible)
      const payload = { status: newStatus };
      
      // Only add optional fields if needed
      if (newStatus === 'REJECTED' && reason) {
        payload.rejectionReason = reason;
      }
      
      console.log('Debug - Admin sending payload:', payload);
      
      const response = await api.put(`/tickets/${ticketId}/status`, payload);
      console.log('Debug - Admin status update response:', response);
      
      toast.success(`Ticket status updated to ${newStatus}`);
      fetchTickets();
      setShowRejectModal(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating ticket status:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // If minimal payload fails, try with different field names
      if (error.response?.status === 400) {
        console.error('400 Bad Request - Trying alternative payload structures...');
        
        // Try with rejectionReason field
        if (newStatus === 'REJECTED' && reason) {
          try {
            const altPayload = { 
              status: newStatus,
              rejectionReason: reason
            };
            console.log('Debug - Trying alternative payload:', altPayload);
            const altResponse = await api.put(`/tickets/${ticketId}/status`, altPayload);
            console.log('Debug - Alternative payload response:', altResponse);
            toast.success(`Ticket status updated to ${newStatus}`);
            fetchTickets();
            setShowRejectModal(false);
            setRejectReason('');
            return;
          } catch (altError) {
            console.error('Alternative payload also failed:', altError);
          }
        }
        
        // Try with rejectReason field
        if (newStatus === 'REJECTED' && reason) {
          try {
            const altPayload2 = { 
              status: newStatus,
              rejectReason: reason
            };
            console.log('Debug - Trying alternative payload 2:', altPayload2);
            const altResponse2 = await api.put(`/tickets/${ticketId}/status`, altPayload2);
            console.log('Debug - Alternative payload 2 response:', altResponse2);
            toast.success(`Ticket status updated to ${newStatus}`);
            fetchTickets();
            setShowRejectModal(false);
            setRejectReason('');
            return;
          } catch (altError2) {
            console.error('Alternative payload 2 also failed:', altError2);
          }
        }
      }
      
      toast.error(`Failed to update ticket status: ${error.response?.data?.message || error.message}`);
    }
  };

  const assignTechnician = async (ticketId, technicianEmail) => {
    if (!technicianEmail) return;
    
    try {
      await api.put(`/tickets/${ticketId}/assign`, { technicianEmail });
      toast.success('Technician assigned successfully');
      fetchTickets();
    } catch (error) {
      console.error('Error assigning technician:', error);
      toast.error('Failed to assign technician');
    }
  };

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'OPEN').length,
      inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter(t => t.status === 'RESOLVED').length,
      closed: tickets.filter(t => t.status === 'CLOSED').length,
      rejected: tickets.filter(t => t.status === 'REJECTED').length
    };
    return stats;
  };

  const getCategoryStats = () => {
    return categories.map(category => {
      const categoryTickets = tickets.filter(t => t.category === category.value);
      return {
        ...category,
        total: categoryTickets.length,
        critical: categoryTickets.filter(t => t.priority === 'CRITICAL').length,
        high: categoryTickets.filter(t => t.priority === 'HIGH').length,
        medium: categoryTickets.filter(t => t.priority === 'MEDIUM').length,
        low: categoryTickets.filter(t => t.priority === 'LOW').length
      };
    });
  };

  const getCategoryTickets = (categoryValue) => {
    return tickets.filter(t => t.category === categoryValue);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategoryView(true);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setShowCategoryView(false);
  };

  const handleAddComment = async () => {
    console.log('handleAddComment called', { newComment, selectedTicket });
    if (!newComment.trim() || !selectedTicket) {
      console.log('Early return - missing comment or ticket');
      return;
    }
    
    try {
      const commentData = {
        text: newComment.trim()
      };
      
      console.log('Sending comment payload:', commentData);
      
      await api.post(`/tickets/${selectedTicket.id}/comments`, commentData);
      toast.success("Comment added successfully!");
      
      // Refresh ticket data to get new comments
      const updatedTicket = await api.get(`/tickets/${selectedTicket.id}`);
      setSelectedTicket(updatedTicket.data);
      
      // Update tickets list
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket.data : ticket
      );
      setTickets(updatedTickets);
      
      setNewComment('');
      console.log('Comment added successfully and synced with backend');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(`Error adding comment: ${error.message}`);
      
      // Fallback to local state if backend fails
      const commentData = {
        id: Date.now(),
        text: newComment.trim(),
        authorName: 'Admin',
        createdBy: 'admin',
        createdAt: new Date().toISOString()
      };
      
      const updatedTicket = {
        ...selectedTicket,
        comments: [...(selectedTicket.comments || []), commentData]
      };
      
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setNewComment('');
    }
  };

  const handleEditComment = (commentId) => {
    const comment = selectedTicket.comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditCommentText(comment.text);
    }
  };

  const handleSaveEdit = async () => {
    if (!editCommentText.trim() || !editingComment) return;

    try {
      console.log('Attempting to update comment:', editingComment);
      console.log('Update payload:', { text: editCommentText.trim() });
      
      const response = await api.put(`/tickets/${selectedTicket.id}/comments/${editingComment}`, {
        text: editCommentText.trim()
      });
      
      console.log('Update response:', response);
      toast.success("Comment updated successfully!");
      
      // Refresh ticket data from backend
      const updatedTicket = await api.get(`/tickets/${selectedTicket.id}`);
      setSelectedTicket(updatedTicket.data);
      
      // Update tickets list
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket.data : ticket
      );
      setTickets(updatedTickets);
      
      setEditingComment(null);
      setEditCommentText('');
      console.log('Comment updated successfully and synced with backend');
    } catch (error) {
      console.error('Error updating comment:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      toast.error(`Error updating comment: ${errorMessage}`);
      
      // Fallback to local state if backend fails
      const updatedComments = selectedTicket.comments.map(comment =>
        comment.id === editingComment
          ? { ...comment, text: editCommentText.trim(), updatedAt: new Date().toISOString() }
          : comment
      );

      const updatedTicket = {
        ...selectedTicket,
        comments: updatedComments
      };

      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));

      setEditingComment(null);
      setEditCommentText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  const canEditComment = (comment) => {
    // Only allow editing if comment is by Admin and was created recently by current admin
    // In production, this should check against the logged-in admin's actual ID/email
    return comment.authorName === 'Admin' && comment.createdBy === 'admin';
  };

  const canDeleteComment = (comment) => {
    // Only allow deleting if comment is by Admin and was created recently by current admin
    // In production, this should check against the logged-in admin's actual ID/email
    return comment.authorName === 'Admin' && comment.createdBy === 'admin';
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        console.log('Attempting to delete comment:', commentId);
        
        const response = await api.delete(`/tickets/${selectedTicket.id}/comments/${commentId}`);
        console.log('Delete response:', response);
        
        toast.success("Comment deleted successfully!");
        
        // Refresh ticket data from backend
        const updatedTicket = await api.get(`/tickets/${selectedTicket.id}`);
        setSelectedTicket(updatedTicket.data);
        
        // Update tickets list
        const updatedTickets = tickets.map(ticket => 
          ticket.id === selectedTicket.id ? updatedTicket.data : ticket
        );
        setTickets(updatedTickets);
        
        console.log('Comment deleted successfully and synced with backend');
      } catch (error) {
        console.error('Error deleting comment:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
        toast.error(`Error deleting comment: ${errorMessage}`);
        
        // Fallback to local state if backend fails
        const updatedComments = selectedTicket.comments.filter(comment => comment.id !== commentId);

        const updatedTicket = {
          ...selectedTicket,
          comments: updatedComments
        };

        setSelectedTicket(updatedTicket);
        setTickets(tickets.map(ticket => 
          ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));
      }
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.createdBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    return priorityColors[priority] || 'bg-gray-100 text-gray-600';
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = (ticketId, newStatus) => {
    if (newStatus === 'REJECTED') {
      setSelectedTicket(tickets.find(t => t.id === ticketId));
      setShowRejectModal(true);
    } else {
      updateTicketStatus(ticketId, newStatus);
    }
  };

  const handleReject = () => {
    if (selectedTicket && rejectReason.trim()) {
      updateTicketStatus(selectedTicket.id, 'REJECTED', rejectReason.trim());
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Support Tickets</h2>
          <p className="text-slate-400 text-sm font-medium">Manage and track support ticket workflow.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-4xl border border-white/60 shadow-sm">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-black text-slate-700">Live</span>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative bg-[#0c5252] border border-[#0c5252] rounded-4xl shadow-2xl shadow-emerald-900/20 p-8 hover:-translate-y-2 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 rounded-2xl bg-white/10 text-emerald-400">
              <Ticket className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-500 text-white">Total</span>
          </div>
          <h4 className="text-3xl font-black tracking-tight mb-1 text-white">{getTicketStats().total}</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200/50">All Tickets</p>
        </div>

        <div className="relative bg-white border border-slate-100 rounded-4xl shadow-sm p-8 hover:-translate-y-2 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-blue-50 text-blue-600">Pending</span>
          </div>
          <h4 className="text-3xl font-black tracking-tight mb-1 text-slate-900">{getTicketStats().open}</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pending</p>
        </div>

        <div className="relative bg-white border border-slate-100 rounded-4xl shadow-sm p-8 hover:-translate-y-2 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 rounded-2xl bg-yellow-50 text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-yellow-50 text-yellow-600">In Progress</span>
          </div>
          <h4 className="text-3xl font-black tracking-tight mb-1 text-slate-900">{getTicketStats().inProgress}</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">In Progress</p>
        </div>

        <div className="relative bg-white border border-slate-100 rounded-4xl shadow-sm p-8 hover:-translate-y-2 transition-all duration-500">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 rounded-2xl bg-green-50 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-green-50 text-green-600">Completed</span>
          </div>
          <h4 className="text-3xl font-black tracking-tight mb-1 text-slate-900">{getTicketStats().resolved + getTicketStats().closed}</h4>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Completed</p>
        </div>
      </div>

      {/* Category-wise Ticket Display */}
      {!showCategoryView ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">Tickets by Category</h3>
            <button
              onClick={() => setShowCategoryView(!showCategoryView)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              {showCategoryView ? 'Hide Categories' : 'Show Categories'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getCategoryStats().map((category) => (
              <div
                key={category.value}
                onClick={() => handleCategoryClick(category)}
                className="bg-white border border-slate-100 rounded-4xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${category.bgColor} rounded-2xl flex items-center justify-center text-2xl`}>
                    {category.icon}
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${category.color}`}>
                    {category.total}
                  </span>
                </div>
                
                <h4 className="font-semibold text-slate-900 mb-3">{category.label}</h4>
                
                <div className="space-y-2">
                  {category.critical > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-600 font-medium">Critical</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
                        {category.critical}
                      </span>
                    </div>
                  )}
                  {category.high > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-600 font-medium">High</span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">
                        {category.high}
                      </span>
                    </div>
                  )}
                  {category.medium > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-yellow-600 font-medium">Medium</span>
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
                        {category.medium}
                      </span>
                    </div>
                  )}
                  {category.low > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 font-medium">Low</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
                        {category.low}
                      </span>
                    </div>
                  )}
                  {category.total === 0 && (
                    <div className="text-xs text-slate-400 text-center py-2">
                      No tickets
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Categories
            </button>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 ${selectedCategory.bgColor} rounded-lg flex items-center justify-center text-lg`}>
                {selectedCategory.icon}
              </span>
              <h3 className="text-2xl font-bold text-slate-900">{selectedCategory.label} Tickets</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${selectedCategory.color}`}>
                {getCategoryTickets(selectedCategory.value).length}
              </span>
            </div>
          </div>

          {/* Priority-based ticket display */}
          <div className="space-y-4">
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(priority => {
              const priorityTickets = getCategoryTickets(selectedCategory.value).filter(t => t.priority === priority);
              if (priorityTickets.length === 0) return null;
              
              const priorityColors = {
                CRITICAL: 'bg-red-100 text-red-700 border-red-200',
                HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
                MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                LOW: 'bg-blue-100 text-blue-700 border-blue-200'
              };

              return (
                <div key={priority} className="space-y-3">
                  <div className={`px-4 py-2 rounded-2xl border ${priorityColors[priority]} inline-block`}>
                    <span className="font-bold text-sm">{priority}</span>
                    <span className="ml-2 font-black">{priorityTickets.length}</span>
                  </div>
                  
                  <div className="grid gap-3">
                    {priorityTickets.map(ticket => (
                      <div key={ticket.id} className="bg-white border border-slate-100 rounded-4xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-[#ebc070]/10 rounded-xl flex items-center justify-center shrink-0">
                                <Ticket className="w-5 h-5 text-[#ebc070]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate">{ticket.title}</h3>
                                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{ticket.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">
                                {ticket.createdBy}
                              </span>
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                              <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(ticket)}
                              className="px-4 py-2 bg-[#0c5252] text-white rounded-xl hover:bg-[#0a4040] transition-colors text-sm font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {getCategoryTickets(selectedCategory.value).length === 0 && (
              <div className="bg-white rounded-4xl border border-slate-100 p-20 text-center">
                <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No tickets found</h3>
                <p className="text-slate-400">No tickets in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-4xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Ticket Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">{selectedTicket.title}</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Priority</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Category</label>
                    <p className="text-sm text-slate-700">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Assigned Technician</label>
                    <p className="text-sm text-slate-700">
                      {selectedTicket.assignedTechnician || 'Unassigned'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Created By</label>
                    <p className="text-sm text-slate-700">{selectedTicket.creatorEmail}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Created Date</label>
                    <p className="text-sm text-slate-700">
                      {new Date(selectedTicket.createdAt).toLocaleDateString()} at {new Date(selectedTicket.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {selectedTicket.location && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Location</label>
                      <p className="text-sm text-slate-700">{selectedTicket.location}</p>
                    </div>
                  )}
                  {selectedTicket.buildingName && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Building</label>
                      <p className="text-sm text-slate-700">{selectedTicket.buildingName}</p>
                    </div>
                  )}
                  {selectedTicket.roomNumber && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Room Number</label>
                      <p className="text-sm text-slate-700">{selectedTicket.roomNumber}</p>
                    </div>
                  )}
                  {selectedTicket.floor && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Floor</label>
                      <p className="text-sm text-slate-700">{selectedTicket.floor}</p>
                    </div>
                  )}
                  {selectedTicket.block && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Block</label>
                      <p className="text-sm text-slate-700">{selectedTicket.block}</p>
                    </div>
                  )}
                  {selectedTicket.updatedAt && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Last Updated</label>
                      <p className="text-sm text-slate-700">
                        {new Date(selectedTicket.updatedAt).toLocaleDateString()} at {new Date(selectedTicket.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                  {selectedTicket.preferredContact && (
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Preferred Contact</label>
                      <p className="text-sm text-slate-700">{selectedTicket.preferredContact}</p>
                    </div>
                  )}
                </div>

                {/* Rejection Reason Section */}
                {selectedTicket.status === 'REJECTED' && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Rejection Reason</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">
                        {selectedTicket.rejectionReason || 'No rejection reason provided'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resolution Notes Section */}
                {(selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED') && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Resolution Notes</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">
                        {selectedTicket.resolutionNote || 'No resolution notes provided'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments ({selectedTicket.comments ? selectedTicket.comments.length : 0})
                  </h4>
                  
                  {/* Admin Comment Input */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment as admin..."
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebc070]/50 resize-none"
                        rows={2}
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-[#0c5252] text-white rounded-lg hover:bg-[#0a4040] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed self-end"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>

                  {/* Existing Comments */}
                  {selectedTicket.comments && selectedTicket.comments.length > 0 && (
                    <div className="space-y-3">
                      {selectedTicket.comments.map((comment) => (
                        <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                              {(canEditComment(comment) || canDeleteComment(comment)) && (
                                <div className="flex gap-1">
                                  {editingComment === comment.id ? (
                                    <>
                                      <button
                                        onClick={handleSaveEdit}
                                        className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="px-2 py-1 bg-slate-500 text-white text-xs rounded hover:bg-slate-600 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {canEditComment(comment) && (
                                        <button
                                          onClick={() => handleEditComment(comment.id)}
                                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                        >
                                          Edit
                                        </button>
                                      )}
                                      {canDeleteComment(comment) && (
                                        <button
                                          onClick={() => handleDeleteComment(comment.id)}
                                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {editingComment === comment.id ? (
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ebc070]/50 resize-none"
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!selectedTicket.comments || selectedTicket.comments.length === 0) && (
                    <div className="text-center py-8 text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-4xl space-y-4">
              {/* Status Update */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 min-w-fit">Update Status:</label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    handleStatusUpdate(selectedTicket.id, e.target.value);
                    setSelectedTicket({...selectedTicket, status: e.target.value});
                  }}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebc070]/50 text-sm cursor-pointer"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {/* Technician Assignment */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 min-w-fit">Assign Technician:</label>
                <select
                  value={selectedTicket.assignedTechnician || ''}
                  onChange={(e) => {
                    assignTechnician(selectedTicket.id, e.target.value);
                    setSelectedTicket({...selectedTicket, assignedTechnician: e.target.value});
                  }}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebc070]/50 text-sm cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.email}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  {selectedTicket.status !== 'REJECTED' && (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setSelectedTicket(selectedTicket);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-4xl max-w-md w-full">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900">Reject Ticket</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this ticket..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ebc070]/50 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-4xl flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
