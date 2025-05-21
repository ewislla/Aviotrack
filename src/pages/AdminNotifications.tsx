import React, { useState } from 'react';
import { Bell, Send, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { mockFlights, mockBookings } from '../data';

const AdminNotifications = () => {
  const [selectedFlight, setSelectedFlight] = useState('');
  const [message, setMessage] = useState('');

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const flight = mockFlights.find(f => f.flightNumber === selectedFlight);
    if (!flight) return;

    const bookings = mockBookings.filter(b => b.flightNumber === selectedFlight);
    
    try {
      const emailPromises = bookings.map(booking => {
        const templateParams = {
          to_email: booking.email,
          to_name: booking.fullName,
          flight_number: booking.flightNumber,
          message: message,
          origin: flight.origin,
          destination: flight.destination
        };

        return emailjs.send(
          'YOUR_SERVICE_ID',
          'YOUR_TEMPLATE_ID',
          templateParams,
          'YOUR_PUBLIC_KEY'
        );
      });

      await Promise.all(emailPromises);
      toast.success(`Notification sent to ${bookings.length} passengers`);
      setMessage('');
    } catch (error) {
      console.error('Failed to send notifications:', error);
      toast.error('Failed to send notifications');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Send Flight Notification</h1>
          </div>
          
          <form onSubmit={sendNotification} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Flight
              </label>
              <select
                value={selectedFlight}
                onChange={(e) => setSelectedFlight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a flight</option>
                {mockFlights.map((flight) => (
                  <option key={flight.id} value={flight.flightNumber}>
                    {flight.flightNumber} - {flight.origin} to {flight.destination}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
                placeholder="Enter your notification message..."
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Notification
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Recent Notifications</h2>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-5 h-5 mr-2" />
              <span>{mockBookings.length} passengers notified</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-blue-900">New Booking Alert</h3>
                  <p className="text-sm text-blue-800 mt-1">Flight AB123 has been booked by John Doe</p>
                </div>
                <span className="text-xs text-blue-700">5 min ago</span>
              </div>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-green-900">Payment Confirmed</h3>
                  <p className="text-sm text-green-800 mt-1">Payment received for booking #12345</p>
                </div>
                <span className="text-xs text-green-700">1 hour ago</span>
              </div>
            </div>

            <div className="border-l-4 border-gray-300 bg-gray-50 p-4 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">System Update</h3>
                  <p className="text-sm text-gray-800 mt-1">Flight schedules have been updated for next week</p>
                </div>
                <span className="text-xs text-gray-600">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;