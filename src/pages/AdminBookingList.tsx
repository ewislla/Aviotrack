import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Mail, Eye, Table } from 'lucide-react';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { mockBookings } from '../data';
import { Booking } from '../types';

const AdminBookingList = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const resendConfirmationEmail = async (booking: Booking) => {
    try {
      const templateParams = {
        to_email: booking.email,
        to_name: booking.fullName,
        booking_id: booking.pnr,
        flight_number: booking.flightNumber,
        origin: booking.flight.origin,
        destination: booking.flight.destination,
        departure_time: new Date(booking.flight.scheduledDeparture).toLocaleString(),
        arrival_time: new Date(booking.flight.scheduledArrival).toLocaleString(),
        seat_class: booking.seatClass,
        passengers: booking.passengers,
        total_price: booking.price
      };

      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        templateParams,
        'YOUR_PUBLIC_KEY'
      );

      toast.success('Confirmation email resent successfully');
    } catch (error) {
      console.error('Failed to resend email:', error);
      toast.error('Failed to resend confirmation email');
    }
  };

  const downloadTicket = (booking: Booking) => {
    navigate(`/confirmation/${booking.id}`, { state: { booking } });
  };

  const viewBookingDetails = (booking: Booking) => {
    navigate(`/confirmation/${booking.id}`, { state: { booking } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Table className="h-5 w-5" />
          <span>{mockBookings.length} total bookings</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class & Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.pnr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.fullName}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.flight.origin} → {booking.flight.destination}
                    </div>
                    <div className="text-sm text-gray-500">
                      Flight {booking.flightNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.seatClass}</div>
                    <div className="text-sm text-gray-500">${booking.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(booking.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(booking.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => downloadTicket(booking)}
                        className="text-green-600 hover:text-green-800"
                        title="Download Ticket"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => resendConfirmationEmail(booking)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Resend Email"
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingList;