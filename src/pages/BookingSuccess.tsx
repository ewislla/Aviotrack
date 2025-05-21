import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Booking } from '../types';

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking as Booking;

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">No booking information available.</p>
        <Link to="/book" className="text-blue-600 hover:underline mt-4 block">
          Return to booking page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2 text-left">
            <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
            <p><span className="font-medium">Name:</span> {booking.fullName}</p>
            <p><span className="font-medium">Email:</span> {booking.email}</p>
            <p><span className="font-medium">Flight Number:</span> {booking.flightNumber}</p>
            <p><span className="font-medium">Passengers:</span> {booking.passengers}</p>
            <p><span className="font-medium">Booked on:</span> {new Date(booking.timestamp).toLocaleString()}</p>
          </div>
        </div>

        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Search More Flights
          </Link>
          <Link
            to="/book"
            className="inline-block bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300"
          >
            Book Another Flight
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;