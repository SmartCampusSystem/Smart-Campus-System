"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Calendar, Clock, MapPin, ShieldCheck, 
    User, FileText, Info, CheckCircle2, Timer, XCircle,
    Copy, ExternalLink, Box, Fingerprint, Mail
} from 'lucide-react';
import api from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/bookings/${id}`);
            setBooking(response.data);
        } catch (error) {
            toast.error("Failed to fetch asset details");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSkeleton />;
    if (!booking) return <NotFound />;

    const statusSteps = [
        { label: 'Requested', date: booking.createdAt, icon: <FileText size={18}/>, completed: true },
        { label: 'Processing', date: booking.createdAt, icon: <Timer size={18}/>, completed: true },
        { label: booking.status, date: booking.updatedAt, icon: getStatusIcon(booking.status), current: true, failed: booking.status === 'REJECTED' || booking.status === 'CANCELLED' }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 selection:bg-[#0c5252] selection:text-white">
            <div className="max-w-7xl mx-auto p-6 md:p-12">
                
                {/* Navigation */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="group flex items-center gap-3 text-slate-400 hover:text-[#0c5252] mb-12 transition-all"
                >
                    <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:bg-[#0c5252] group-hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Timeline</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column: Tracking & Main Info */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{booking.resourceName || "Unidentified Asset"}</h1>
                                        <span className={`px-4 py-1 rounded-full text-[9px] font-black tracking-widest border ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Fingerprint size={14} className="text-[#0c5252]"/> REF-{booking.id.toString().slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 opacity-70">
                                            <Mail size={12} className="text-emerald-600"/> {booking.userEmail}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-3xl">
                                    <Box size={40} className="text-[#0c5252]" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Horizontal Progress Tracker */}
                            <div className="relative flex justify-between items-start mb-4">
                                <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-0"></div>
                                {statusSteps.map((step, idx) => (
                                    <div key={idx} className="relative z-10 flex flex-col items-center text-center px-2">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 
                                            ${step.failed ? 'bg-rose-500 text-white' : step.completed ? 'bg-[#0c5252] text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            {step.icon}
                                        </div>
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-tighter text-slate-800">{step.label}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                                            {new Date(step.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailCard 
                                icon={<Calendar size={20}/>} 
                                title="Allocation Period" 
                                value={`${formatDate(booking.startTime)} - ${formatDate(booking.endTime)}`}
                                subValue="Standard check-in/out protocol applied."
                            />
                            <DetailCard 
                                icon={<User size={20}/>} 
                                title="Assigned User" 
                                value={booking.userName || "Verified Account"}
                                subValue={booking.userEmail}
                            />
                        </div>

                        {/* Rejection/Cancellation Note if exists */}
                        {(booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
                            <div className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-8">
                                <div className="flex gap-4">
                                    <XCircle className="text-rose-500 shrink-0" />
                                    <div>
                                        <h4 className="text-rose-900 font-black text-sm uppercase tracking-widest mb-2">{booking.status === 'CANCELLED' ? 'Cancellation Report' : 'Rejection Report'}</h4>
                                        <p className="text-rose-700 font-medium italic">"{booking.rejectionReason || "No specific reason provided by administrator."}"</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Meta Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0c5252] rounded-[3rem] p-8 text-white shadow-xl">
                            <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Security Manifest</h4>
                            <div className="space-y-4">
                                <SecurityItem label="Encrypted Entry" value="AES-256" />
                                <SecurityItem label="Log Ref" value={`LOG-${booking.id.toString().slice(-5).toUpperCase()}`} />
                                <SecurityItem label="Permission" value="Level 4 Grant" />
                            </div>
                            <button className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                                Download Confirmation PDF
                            </button>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8">
                            <h4 className="text-slate-800 text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Info size={16} className="text-emerald-600"/> Resource Info
                            </h4>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">
                                This asset is subject to internal auditing. Please ensure all safety protocols are followed during the allocation period.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---

const DetailCard = ({ icon, title, value, subValue }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0c5252] mb-6 group-hover:bg-[#0c5252] group-hover:text-white transition-all">
            {icon}
        </div>
        <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-lg font-black text-slate-800 tracking-tight leading-tight mb-2">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{subValue}</p>
    </div>
);

const SecurityItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-white/10">
        <span className="text-[10px] font-bold text-emerald-200/60 uppercase">{label}</span>
        <span className="text-[10px] font-black uppercase tracking-widest">{value}</span>
    </div>
);

const getStatusStyles = (status) => {
    switch (status) {
        case 'APPROVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        case 'REJECTED': return 'text-rose-600 bg-rose-50 border-rose-100';
        case 'CANCELLED': return 'text-slate-600 bg-slate-50 border-slate-100';
        default: return 'text-amber-600 bg-amber-50 border-amber-100';
    }
};

const getStatusIcon = (status) => {
    if (status === 'APPROVED') return <CheckCircle2 size={18}/>;
    if (status === 'REJECTED' || status === 'CANCELLED') return <XCircle size={18}/>;
    return <Timer size={18}/>;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
};

const LoadingSkeleton = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c5252]"></div>
    </div>
);

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase">Record Not Found</h2>
    </div>
);

export default BookingDetails;