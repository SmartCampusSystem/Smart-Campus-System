import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { 
  Ticket, Clock, CheckCircle, AlertCircle, User, Calendar,
  MapPin, MessageSquare, Edit, Save, X, Search,
  Filter, ChevronDown, FileText, Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

function TechnicianTickets({ tickets, setTickets, searchTerm, loading, fetchTickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingStatus, setEditingStatus] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [editingResolution, setEditingResolution] = useState(false);
  const [technicianEmail, setTechnicianEmail] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState({ ticketId: null, newStatus: '' });
  const [tempResolutionNote, setTempResolutionNote] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setTechnicianEmail(user.email || '');
      setTechnicianName(user.name || user.email?.split('@')[0] || 'Technician');
    }
  }, []);

  // Filter tickets assigned to current technician by email and role
  const filteredTickets = tickets.filter(ticket => {
    // Check if ticket is assigned to current technician by email or role
    const isAssignedToMe = ticket.assignedTechnician === technicianName || 
                           ticket.assignedTechnician === technicianEmail ||
                           ticket.assignedTechnicianEmail === technicianEmail ||
                           ticket.assignedTechnicianId === technicianEmail ||
                           (!ticket.assignedTechnician && ticket.assignedTechnicianEmail === technicianEmail);
    
    const matchesSearch = ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.creatorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.createdBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getCreatorDisplayName(ticket).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    return isAssignedToMe && matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (ticketId, newStatus, resolutionNote = null) => {
    // Check if status change requires resolution notes
    if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
      if (!resolutionNote) {
        // Show modal for resolution notes
        setPendingStatusChange({ ticketId, newStatus });
        setTempResolutionNote('');
        setShowResolutionModal(true);
        return;
      }
    }

    try {
      console.log('Debug - Updating ticket status:', { ticketId, newStatus, resolutionNote });
      
      // Create proper StatusUpdateDTO payload
      const payload = {
        status: newStatus,
        resolutionNote: (newStatus === 'RESOLVED' || newStatus === 'CLOSED') ? resolutionNote : null,
        rejectionReason: newStatus === 'REJECTED' ? 'Ticket rejected' : null
      };
      
      console.log('Debug - Sending StatusUpdateDTO payload:', payload);
      console.log('Debug - API endpoint:', `/tickets/${ticketId}/status`);
      
      const response = await api.put(`/tickets/${ticketId}/status`, payload);
      
      console.log('Debug - Status update response:', response);
      console.log('Debug - Response data:', response.data);
      toast.success(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
      
      // Refresh ticket data to get updated status
      const updatedTicket = await api.get(`/tickets/${ticketId}`);
      setSelectedTicket(updatedTicket.data);
      
      // Update local state
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId ? updatedTicket.data : ticket
      );
      setTickets(updatedTickets);
      
      setEditingStatus(null);
      setShowResolutionModal(false);
      setTempResolutionNote('');
      console.log('Status updated successfully and synced with backend');
    } catch (error) {
      console.error('Error updating ticket status - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 400) {
        console.error('400 Bad Request - Backend validation error');
        console.error('Backend expects StatusUpdateDTO with fields:');
        console.error('- status: TicketStatus enum value');
        console.error('- resolutionNote: required when status=RESOLVED or CLOSED');
        console.error('- rejectionReason: required when status=REJECTED');
        
        // Try with minimal payload
        try {
          console.log('Debug - Trying minimal payload...');
          const minimalPayload = { status: newStatus };
          const minimalResponse = await api.put(`/tickets/${ticketId}/status`, minimalPayload);
          console.log('Debug - Minimal payload response:', minimalResponse);
          toast.success('Status updated with minimal payload');
          
          // Refresh and update
          const updatedTicket = await api.get(`/tickets/${ticketId}`);
          const updatedTickets = tickets.map(ticket =>
            ticket.id === ticketId ? updatedTicket.data : ticket
          );
          setTickets(updatedTickets);
          setEditingStatus(null);
          setShowResolutionModal(false);
          return;
        } catch (minimalError) {
          console.error('Minimal payload also failed:', minimalError);
        }
      }
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      toast.error(`Error updating ticket status: ${error.response?.data?.message || error.message}`);
      
      // Fallback to local state if backend fails
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } : ticket
      );
      setTickets(updatedTickets);
      
      setEditingStatus(null);
      setShowResolutionModal(false);
      setTempResolutionNote('');
      toast.success('Status updated locally');
    }
  };

  const handleResolutionSubmit = () => {
    if (!tempResolutionNote.trim()) {
      toast.error('Please provide resolution notes');
      return;
    }
    handleStatusUpdate(pendingStatusChange.ticketId, pendingStatusChange.newStatus, tempResolutionNote.trim());
  };

  const handleResolutionUpdate = async (ticketId, notes) => {
    try {
      console.log('Debug - Updating resolution notes:', { ticketId, notes: notes.trim() });
      
      // Resolution notes are updated through status update with RESOLVED status
      const payload = {
        status: 'RESOLVED',
        resolutionNote: notes.trim(),
        rejectionReason: null
      };
      
      console.log('Debug - Sending resolution update via status endpoint:', payload);
      console.log('Debug - API endpoint:', `/tickets/${ticketId}/status`);
      
      const response = await api.put(`/tickets/${ticketId}/status`, payload);
      
      console.log('Debug - Resolution update response:', response);
      console.log('Debug - Response data:', response.data);
      toast.success('Resolution notes updated');
      
      // Refresh ticket data to get updated resolution
      const updatedTicket = await api.get(`/tickets/${ticketId}`);
      setSelectedTicket(updatedTicket.data);
      
      // Update local state
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId ? updatedTicket.data : ticket
      );
      setTickets(updatedTickets);
      
      setEditingResolution(false);
      setResolutionNote('');
      console.log('Resolution updated successfully and synced with backend');
    } catch (error) {
      console.error('Error updating resolution notes - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 404) {
        console.error('404 Not Found - Resolution endpoint does not exist');
        console.error('Resolution notes must be updated via status update endpoint');
        
        // Try using status update endpoint
        try {
          console.log('Debug - Trying status update endpoint for resolution...');
          const statusPayload = {
            status: 'RESOLVED',
            resolutionNote: notes.trim()
          };
          const statusResponse = await api.put(`/tickets/${ticketId}/status`, statusPayload);
          console.log('Debug - Status update for resolution response:', statusResponse);
          toast.success('Resolution notes updated via status update');
          
          // Refresh and update
          const updatedTicket = await api.get(`/tickets/${ticketId}`);
          const updatedTickets = tickets.map(ticket =>
            ticket.id === ticketId ? updatedTicket.data : ticket
          );
          setTickets(updatedTickets);
          setEditingResolution(false);
          setResolutionNote('');
          return;
        } catch (statusError) {
          console.error('Status update for resolution also failed:', statusError);
        }
      }
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      toast.error(`Error updating resolution notes: ${error.response?.data?.message || error.message}`);
      
      // Fallback to local state if backend fails
      const updatedTickets = tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, resolutionNote: notes.trim(), updatedAt: new Date().toISOString() } : ticket
      );
      setTickets(updatedTickets);
      
      setEditingResolution(false);
      setResolutionNote('');
      toast.success('Resolution notes updated locally');
    }
  };

  // Comment management functions
  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTicket) return;
    
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Debug - Token exists:', !!token);
      console.log('Debug - Token length:', token?.length);
      console.log('Debug - User data:', userData ? JSON.parse(userData) : null);
      console.log('Debug - Selected ticket ID:', selectedTicket.id);
      
      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        return;
      }
      
      const commentData = {
        text: newComment.trim()
      };
      
      console.log('Debug - Sending comment request to:', `/tickets/${selectedTicket.id}/comments`);
      console.log('Debug - Comment data:', commentData);
      
      const response = await api.post(`/tickets/${selectedTicket.id}/comments`, commentData);
      
      console.log('Debug - Comment API response:', response);
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
      console.error('Error adding comment - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      toast.error(`Error adding comment: ${error.message}`);
      
      // Fallback to local state if backend fails
      const fallbackCommentData = {
        id: Date.now(),
        text: newComment.trim(),
        authorName: technicianName,
        createdBy: technicianEmail,
        createdAt: new Date().toISOString()
      };
      
      const updatedTicket = {
        ...selectedTicket,
        comments: [...(selectedTicket.comments || []), fallbackCommentData]
      };
      
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setNewComment('');
      toast.success('Comment added locally');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim() || !selectedTicket) return;
    
    try {
      await api.put(`/tickets/${selectedTicket.id}/comments/${commentId}`, {
        text: editingCommentText.trim()
      });
      toast.success("Comment updated successfully!");
      
      // Refresh ticket data to get updated comments
      const updatedTicket = await api.get(`/tickets/${selectedTicket.id}`);
      setSelectedTicket(updatedTicket.data);
      
      // Update tickets list
      const updatedTickets = tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket.data : ticket
      );
      setTickets(updatedTickets);
      
      setEditingComment(null);
      setEditingCommentText('');
      console.log('Comment updated successfully and synced with backend');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error(`Error updating comment: ${error.message}`);
      
      // Fallback to local state if backend fails
      const updatedTicket = {
        ...selectedTicket,
        comments: selectedTicket.comments.map(comment =>
          comment.id === commentId 
            ? { ...comment, text: editingCommentText.trim(), updatedAt: new Date().toISOString() }
            : comment
        )
      };
      
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setEditingComment(null);
      setEditingCommentText('');
      toast.success('Comment updated locally');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedTicket) return;
    
    try {
      await api.delete(`/tickets/${selectedTicket.id}/comments/${commentId}`);
      toast.success("Comment deleted successfully!");
      
      // Refresh ticket data to get updated comments
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
      toast.error(`Error deleting comment: ${error.message}`);
      
      // Fallback to local state if backend fails
      const updatedTicket = {
        ...selectedTicket,
        comments: selectedTicket.comments.filter(comment => comment.id !== commentId)
      };
      
      setSelectedTicket(updatedTicket);
      setTickets(tickets.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      toast.success('Comment deleted locally');
    }
  };

  const canEditComment = (comment) => {
    return comment.createdBy === technicianEmail || comment.authorName === technicianName;
  };

  const canDeleteComment = (comment) => {
    return comment.createdBy === technicianEmail || comment.authorName === technicianName;
  };

  // Image modal functions
  const openImageModal = (attachment, index) => {
    if (attachment.contentType?.startsWith('image/')) {
      setSelectedImage(attachment);
      setImageIndex(index);
      setShowImageModal(true);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
    setImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (!selectedTicket?.attachments) return;
    
    const imageAttachments = selectedTicket.attachments.filter(a => a.contentType?.startsWith('image/'));
    if (imageAttachments.length <= 1) return;
    
    let newIndex = imageIndex;
    if (direction === 'next') {
      newIndex = (imageIndex + 1) % imageAttachments.length;
    } else {
      newIndex = imageIndex === 0 ? imageAttachments.length - 1 : imageIndex - 1;
    }
    
    setImageIndex(newIndex);
    setSelectedImage(imageAttachments[newIndex]);
  };

  // Helper function to format creator name
  const getCreatorDisplayName = (ticket) => {
    // Try to get name from various possible fields
    if (ticket.creatorName) {
      return ticket.creatorName;
    }
    if (ticket.createdByName) {
      return ticket.createdByName;
    }
    if (ticket.creatorEmail) {
      // Extract name from email (e.g., "john.doe" from "john.doe@domain.com")
      const emailName = ticket.creatorEmail.split('@')[0];
      // Format name (e.g., "john.doe" -> "John Doe")
      return emailName
        .split('.')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    if (ticket.createdBy) {
      return ticket.createdBy;
    }
    return 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CLOSED': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const TicketCard = ({ ticket }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-h-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-900 mb-3">{ticket.title}</h3>
          <div className="flex items-center gap-4 text-base text-slate-600">
            <span className="flex items-center gap-1">
              <User size={14} />
              {getCreatorDisplayName(ticket)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
          <button
            onClick={() => {
              setSelectedTicket(ticket);
              setShowDetailsModal(true);
            }}
            className="px-3 py-1 bg-[#0c5252] text-white rounded-lg hover:bg-[#0a4040] transition-colors text-xs font-medium"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-base mb-6 line-clamp-3">{ticket.description}</p>

      {/* Status and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {editingStatus === ticket.id ? (
            <div className="flex items-center gap-2">
              <select
                value={ticket.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if (newStatus !== ticket.status) {
                    handleStatusUpdate(ticket.id, newStatus);
                  }
                }}
                className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <button
                onClick={() => setEditingStatus(null)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <button
                onClick={() => setEditingStatus(ticket.id)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Edit size={16} />
              </button>
            </div>
          )}
        </div>
        
        {ticket.assignedTechnician && (
          <div className="text-sm text-slate-600">
            Assigned to: {ticket.assignedTechnician}
            {ticket.assignedTechnicianEmail && (
              <span className="text-xs text-slate-500 ml-1">({ticket.assignedTechnicianEmail})</span>
            )}
          </div>
        )}
      </div>

      {/* Resolution Notes */}
      {ticket.status === 'RESOLVED' && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-800">Resolution Notes</span>
            {editingResolution && selectedTicket?.id === ticket.id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleResolutionUpdate(ticket.id, resolutionNote)}
                  className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => setEditingResolution(false)}
                  className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingResolution(true);
                  setResolutionNote(ticket.resolutionNote || '');
                  setSelectedTicket(ticket);
                }}
                className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
          {editingResolution && selectedTicket?.id === ticket.id ? (
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full p-2 border border-emerald-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              rows={3}
            />
          ) : (
            <p className="text-sm text-emerald-700">{ticket.resolutionNote || 'No resolution notes provided'}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="text-sm text-slate-600">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && !loading && (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No tickets found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-[#0c5252] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading tickets...</p>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Ticket Details</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedTicket(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <p className="text-slate-900 font-medium">{selectedTicket.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <p className="text-slate-900 font-medium">{selectedTicket.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Location</label>
                  <p className="text-slate-900 font-medium">{selectedTicket.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Created By</label>
                  <p className="text-slate-900 font-medium">{getCreatorDisplayName(selectedTicket)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Created Date</label>
                  <p className="text-slate-900 font-medium">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <p className="text-slate-900 mt-2 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Attachments */}
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Attachments</label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {selectedTicket.attachments.map((attachment, index) => (
                      <div key={attachment.id} className="relative group">
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 hover:bg-slate-100 transition-colors">
                          {attachment.contentType?.startsWith('image/') ? (
                            <div className="relative w-full h-32">
                              <img
                                src={`http://localhost:8082${attachment.fileUrl}`}
                                alt={attachment.filename}
                                className="w-full h-32 object-cover cursor-pointer"
                                onClick={() => openImageModal(attachment, index)}
                                onError={(e) => {
                                  console.error('Image failed to load:', attachment.fileUrl);
                                  console.error('Full URL:', `http://localhost:8082${attachment.fileUrl}`);
                                  e.target.style.display = 'none';
                                  // Show fallback
                                  e.target.parentElement.innerHTML = `
                                    <div class="w-full h-32 flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
                                      <FileText class="w-8 h-8 text-red-400 mb-2" />
                                      <span class="text-xs text-red-600 text-center">Image failed to load</span>
                                      <span class="text-xs text-red-500 text-center truncate w-full mt-1" title="${attachment.filename}">${attachment.filename}</span>
                                    </div>
                                  `;
                                }}
                                onLoad={() => {
                                  console.log('Image loaded successfully:', attachment.fileUrl);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-32 flex flex-col items-center justify-center p-4">
                              <FileText className="w-8 h-8 text-slate-400 mb-2" />
                              <span className="text-xs text-slate-600 text-center truncate w-full">
                                {attachment.filename}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-slate-600 truncate" title={attachment.filename}>
                            {attachment.filename}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(attachment.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution Notes */}
              {(selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED') && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Resolution Notes</label>
                  <p className="text-slate-900 mt-2 whitespace-pre-wrap">
                    {selectedTicket.resolutionNote || 'No resolution notes provided'}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">Comments</label>
                
                {/* Add Comment */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                {selectedTicket.comments && selectedTicket.comments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{comment.authorName}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            {canEditComment(comment) && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingComment(comment.id);
                                    setEditingCommentText(comment.text);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              className="w-full p-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="px-3 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditingCommentText('');
                                }}
                                className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No comments yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {selectedTicket?.attachments && selectedTicket.attachments.filter(a => a.contentType?.startsWith('image/')).length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronDown className="rotate-90" size={24} />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronDown className="-rotate-90" size={24} />
                </button>
              </>
            )}

            {/* Image Display */}
            <div className="flex flex-col items-center">
              <img
                src={`http://localhost:8082${selectedImage.fileUrl}`}
                alt={selectedImage.filename}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  console.error('Modal image failed to load:', selectedImage.fileUrl);
                  e.target.style.display = 'none';
                  // Show fallback
                  const fallback = document.createElement('div');
                  fallback.className = 'flex flex-col items-center justify-center p-8 text-white';
                  fallback.innerHTML = `
                    <FileText className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">${selectedImage.filename}</p>
                    <p className="text-sm text-white/70">Image could not be loaded</p>
                    <p class="text-xs text-white/50 mt-2">URL: ${selectedImage.fileUrl}</p>
                  `;
                  e.target.parentNode.appendChild(fallback);
                }}
                onLoad={() => {
                  console.log('Modal image loaded successfully:', selectedImage.fileUrl);
                }}
              />
              
              {/* Image Info */}
              <div className="mt-4 text-center text-white">
                <p className="text-lg font-medium">{selectedImage.filename}</p>
                <p className="text-sm text-white/70">
                  {(selectedImage.fileSize / 1024).toFixed(1)} KB • 
                  {imageIndex + 1} of {selectedTicket.attachments.filter(a => a.contentType?.startsWith('image/')).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Notes Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Resolution Notes
              </h3>
              <button
                onClick={() => {
                  setShowResolutionModal(false);
                  setTempResolutionNote('');
                  setPendingStatusChange({ ticketId: null, newStatus: '' });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Please provide resolution notes for changing status to {pendingStatusChange.newStatus.replace('_', ' ')}:
                </label>
                <textarea
                  value={tempResolutionNote}
                  onChange={(e) => setTempResolutionNote(e.target.value)}
                  placeholder="Describe how the issue was resolved..."
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  rows={4}
                  autoFocus
                />
              </div>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowResolutionModal(false);
                    setTempResolutionNote('');
                    setPendingStatusChange({ ticketId: null, newStatus: '' });
                  }}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolutionSubmit}
                  disabled={!tempResolutionNote.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit & Change Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicianTickets;
