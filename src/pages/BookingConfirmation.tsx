import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail, Plane } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QRCode from 'qrcode';
import { Booking } from '../types';
import { generateTicket } from '../utils/generatePDF';
import { sendConfirmationEmail } from '../utils/sendEmail';
import { addBooking } from '../services/firebaseService';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [qrCode, setQrCode] = useState('');

 useEffect(() => {
  if (!location.state?.booking) {
    navigate('/'); // redirect to home page
    return;
  }

  const bookingData = location.state.booking;
  setBooking(bookingData);
  generateQRCode(bookingData.pnr);

  // Save booking to Firebase
  const saveBooking = async () => {
    try {
      await addBooking(bookingData);
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };
  
  saveBooking();
}, [location.state, navigate]);




  const generateQRCode = async (pnr: string) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(pnr);
      setQrCode(qrCodeDataUrl);
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  };

  const handleDownloadTicket = async () => {
    if (!booking || !qrCode) return;
    const success = await generateTicket(booking, qrCode);
    if (success) {
      toast.success('Ticket downloaded successfully!');
    } else {
      toast.error('Failed to generate ticket');
    }
  };

  const handleResendEmail = async () => {
    if (!booking) return;
    const success = await sendConfirmationEmail(booking);
    if (success) {
      toast.success('Confirmation email sent!');
    } else {
      toast.error('Failed to send confirmation email');
    }
  };

  useEffect(() => {
    if (booking) {
      sendConfirmationEmail(booking).then(success => {
        if (success) {
          toast.success(`Confirmation email sent to ${booking.email}`);
        }
      });
    }
  }, [booking]);

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
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your flight has been booked successfully.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <span className="text-blue-600 font-mono">{booking.pnr}</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">From</p>
                <p className="font-semibold">{booking.flight.origin}</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.flight.scheduledDeparture).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">To</p>
                <p className="font-semibold">{booking.flight.destination}</p>
                <p className="text-sm text-gray-500">
                  {new Date(booking.flight.scheduledArrival).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2">Passenger Information</h3>
              <p><span className="text-gray-600">Name:</span> {booking.fullName}</p>
              <p><span className="text-gray-600">Email:</span> {booking.email}</p>
              <p><span className="text-gray-600">Class:</span> {booking.seatClass}</p>
              <p><span className="text-gray-600">Seat Numbers:</span> {booking.seatNumbers.join(', ')}</p>
              <p><span className="text-gray-600">Passengers:</span> {booking.passengers}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2">Flight Information</h3>
              <p><span className="text-gray-600">Airline:</span> {booking.flight.airline}</p>
              <p><span className="text-gray-600">Flight:</span> {booking.flight.flightNumber}</p>
              <p><span className="text-gray-600">Aircraft:</span> {booking.flight.aircraftType}</p>
              <p><span className="text-gray-600">Terminal:</span> {booking.flight.terminal}</p>
              <p><span className="text-gray-600">Gate:</span> {booking.flight.gate}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price</span>
                <span className="text-xl font-bold">${booking.price}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadTicket}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download Ticket</span>
          </button>
          <button
            onClick={handleResendEmail}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
          >
            <Mail className="h-5 w-5" />
            <span>Resend Email</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:underline flex items-center justify-center space-x-2"
          >
            <Plane className="h-5 w-5" />
            <span>Search More Flights</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;