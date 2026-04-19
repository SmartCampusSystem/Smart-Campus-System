import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../api/axiosInstance';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings/my');
            
            // 🛑 වැදගත්: Backend එකෙන් ලැබෙන්නේ Array එකක් බව තහවුරු කර ගැනීම
            if (Array.isArray(response.data)) {
                setBookings(response.data);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            if (error.response?.status === 401) {
                toast.error("සැසිය අවසන් වී ඇත. කරුණාකර නැවත ලොග් වන්න.");
            } else {
                toast.error("දත්ත ලබා ගැනීමට නොහැකි විය.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-100';
            case 'PENDING': return 'text-yellow-600 bg-yellow-100';
            case 'REJECTED': return 'text-red-600 bg-red-100';
            case 'CANCELLED': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600';
        }
    };

    if (loading) return <div className="p-10 text-center">Loading your bookings...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">මගේ වෙන් කිරීම් (My Bookings)</h2>
            
            {bookings.length === 0 ? (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
                    ඔබ තවමත් කිසිදු වෙන් කිරීමක් සිදු කර නැත.
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold">සම්පත (Resource)</th>
                                <th className="p-4 font-semibold">ආරම්භය</th>
                                <th className="p-4 font-semibold">අවසානය</th>
                                <th className="p-4 font-semibold">තත්ත්වය (Status)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{booking.resourceId}</td>
                                    <td className="p-4">{new Date(booking.startTime).toLocaleString()}</td>
                                    <td className="p-4">{new Date(booking.endTime).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        {booking.rejectionReason && (
                                            <p className="text-xs text-red-500 mt-1 italic">හේතුව: {booking.rejectionReason}</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookings;