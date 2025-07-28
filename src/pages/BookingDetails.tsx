import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plane, Users, CreditCard, Mail, User, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockFlights, mockBookings, saveBookings, updateSeatStatus } from '../data';
import { Flight, Booking, Seat } from '../types';
import { generatePNR } from '../utils/generatePNR';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // adjust the path


const BookingDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: location.state?.formData?.fullName || '',
    email: location.state?.formData?.email || '',
    seatClass: location.state?.formData?.seatClass || 'Economy' as 'Economy' | 'Business' | 'First Class',
    passengers: location.state?.formData?.passengers || 1
  });

  useEffect(() => {
  // First try to get flight from location state (more reliable)
  if (location.state?.flight) {
    setFlight(location.state.flight);
    return;
  }
  
  // Fallback to finding by ID in mockFlights
  const selectedFlight = mockFlights.find(f => f.id === flightId);
  if (!selectedFlight) {
    toast.error('Flight not found');
    navigate('/book');
    return;
  }
  setFlight(selectedFlight);
}, [flightId, navigate, location.state]);

  const calculatePrice = () => {
    if (!flight || selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((total, seatNumber) => {
      const seat = flight.seats.find(s => s.number === seatNumber);
      return total + (seat?.price || 0);
    }, 0);
  };

  const getAvailableSeats = (seatClass: string) => {
    if (!flight) return [];
    return flight.seats.filter(
      seat => seat.class === seatClass && seat.status === 'Available'
    );
  };

  const handleSeatSelection = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < formData.passengers) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    } else {
      toast.error(`You can only select ${formData.passengers} seats`);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!flight) return;

  if (selectedSeats.length !== formData.passengers) {
    toast.error(`Please select ${formData.passengers} seats`);
    return;
  }

  const booking: Booking = {
    id: Math.random().toString(36).substr(2, 9),
    pnr: generatePNR(),
    fullName: formData.fullName,
    email: formData.email,
    flightNumber: flight.flightNumber,
    passengers: formData.passengers,
    timestamp: new Date().toISOString(),
    seatClass: formData.seatClass,
    seatNumbers: selectedSeats,
    price: calculatePrice(),
    flight: flight
  };

  try {
    // Save to Firebase
    const docRef = await addDoc(collection(db, 'bookings'), booking);
    console.log('Booking saved with ID:', docRef.id);
    
    // Update seat status in your local state/mock data
    updateSeatStatus(flight.id, selectedSeats, 'Booked');
    
    toast.success('Booking confirmed!');
    navigate('/booking-confirmation', { state: { booking } });
  } catch (error) {
    console.error('Error saving booking:', error);
    toast.error('Booking failed. Please try again.');
  }
};
  const renderSeatMap = () => {
    if (!flight) return null;

    const seatsByClass = {
      'First Class': flight.seats.filter(seat => seat.class === 'First Class'),
      'Business': flight.seats.filter(seat => seat.class === 'Business'),
      'Economy': flight.seats.filter(seat => seat.class === 'Economy')
    };

    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Select Your Seats</h3>
        {Object.entries(seatsByClass).map(([className, seats]) => (
          <div key={className} className="mb-8">
            <h4 className="text-md font-medium mb-2">{className}</h4>
            <div className="grid grid-cols-6 gap-2">
              {seats.map((seat) => (
                <button
                  key={seat.number}
                  onClick={() => handleSeatSelection(seat.number)}
                  disabled={seat.status === 'Booked' || 
                           (formData.seatClass !== seat.class) ||
                           (selectedSeats.length >= formData.passengers && !selectedSeats.includes(seat.number))}
                  className={`p-2 rounded-md text-sm font-medium transition-colors
                    ${seat.status === 'Booked' 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : selectedSeats.includes(seat.number)
                      ? 'bg-blue-600 text-white'
                      : formData.seatClass === seat.class
                      ? 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {seat.number}
                  {selectedSeats.includes(seat.number) && (
                    <Check className="h-4 w-4 inline-block ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!flight) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-4">Complete Your Booking</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-blue-100">From</p>
              <p className="text-xl font-semibold">{flight.origin}</p>
              <p className="text-blue-100">
                {new Date(flight.scheduledDeparture).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-blue-100">To</p>
              <p className="text-xl font-semibold">{flight.destination}</p>
              <p className="text-blue-100">
                {new Date(flight.scheduledArrival).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span>Full Name</span>
                </div>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>Email</span>
                </div>
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>Number of Passengers</span>
                </div>
              </label>
              <input
                type="number"
                min="1"
                max="9"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.passengers}
                onChange={(e) => {
                  const newPassengers = parseInt(e.target.value);
                  setFormData({ ...formData, passengers: newPassengers });
                  setSelectedSeats([]);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Plane className="h-5 w-5 text-gray-400" />
                  <span>Selected Class</span>
                </div>
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                {formData.seatClass}
              </div>
            </div>
          </div>

          {renderSeatMap()}

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4">Price Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Seats</span>
                <span>{selectedSeats.join(', ') || 'None selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Seat</span>
                <span>${calculatePrice() / (selectedSeats.length || 1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Seats</span>
                <span>{selectedSeats.length}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${calculatePrice()}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={selectedSeats.length !== formData.passengers}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <CreditCard className="h-5 w-5" />
            <span>Confirm Booking</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingDetails;