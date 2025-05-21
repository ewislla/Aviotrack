import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, User, Mail, Users, CreditCard } from 'lucide-react';
import { mockFlights } from '../data';
import { Flight } from '../types';

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    flightNumber: '',
    passengers: 1,
    seatClass: 'Economy' as 'Economy' | 'Business' | 'First Class'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedFlight = mockFlights.find(f => f.flightNumber === formData.flightNumber);
    if (!selectedFlight) return;

    navigate(`/book/${selectedFlight.id}`, { 
      state: { 
        formData,
        flight: selectedFlight
      }
    });
  };

  const getClassPrice = (flight: Flight, seatClass: string) => {
    switch (seatClass) {
      case 'Economy':
        return flight.economyPrice;
      case 'Business':
        return flight.businessPrice;
      case 'First Class':
        return flight.firstClassPrice;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Flight</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Plane className="h-5 w-5 text-gray-400" />
                <span>Flight Number</span>
              </div>
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.flightNumber}
              onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
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
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span>Seat Class</span>
              </div>
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.seatClass}
              onChange={(e) => setFormData({ ...formData, seatClass: e.target.value as typeof formData.seatClass })}
            >
              {mockFlights.find(f => f.flightNumber === formData.flightNumber) ? (
                <>
                  <option value="Economy">
                    Economy (${mockFlights.find(f => f.flightNumber === formData.flightNumber)?.economyPrice})
                  </option>
                  <option value="Business">
                    Business (${mockFlights.find(f => f.flightNumber === formData.flightNumber)?.businessPrice})
                  </option>
                  <option value="First Class">
                    First Class (${mockFlights.find(f => f.flightNumber === formData.flightNumber)?.firstClassPrice})
                  </option>
                </>
              ) : (
                <>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First Class">First Class</option>
                </>
              )}
            </select>
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
            />
          </div>

          {formData.flightNumber && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected Flight</span>
                <span className="font-semibold">{formData.flightNumber}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Price per Passenger</span>
                <span className="font-semibold">
                  ${getClassPrice(
                    mockFlights.find(f => f.flightNumber === formData.flightNumber)!,
                    formData.seatClass
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Total Price</span>
                <span className="text-lg font-bold text-blue-600">
                  ${getClassPrice(
                    mockFlights.find(f => f.flightNumber === formData.flightNumber)!,
                    formData.seatClass
                  ) * formData.passengers}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to Seat Selection
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;