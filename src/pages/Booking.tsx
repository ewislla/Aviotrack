import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, User, Mail, Users, CreditCard } from 'lucide-react';
import Select from 'react-select';
import { mockFlights } from '../data';
import { airports, groupedAirports, countries } from '../data/airports';
import { Flight } from '../types';

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    from: '',
    to: '',
    passengers: 1,
    seatClass: 'Economy' as 'Economy' | 'Business' | 'First Class'
  });

  const [availableFlights, setAvailableFlights] = useState<Flight[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedCountryFrom, setSelectedCountryFrom] = useState<string>('');
  const [selectedCountryTo, setSelectedCountryTo] = useState<string>('');

  const countryOptions = useMemo(() => 
    countries.map(country => ({
      value: country,
      label: country
    })),
    []
  );

  const airportOptionsFrom = useMemo(() => 
    selectedCountryFrom
      ? groupedAirports[selectedCountryFrom]?.map(airport => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) - ${airport.name}`
        })) || []
      : airports.map(airport => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) - ${airport.name}, ${airport.country}`
        })),
    [selectedCountryFrom]
  );

  const airportOptionsTo = useMemo(() => 
    selectedCountryTo
      ? groupedAirports[selectedCountryTo]?.map(airport => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) - ${airport.name}`
        })) || []
      : airports.map(airport => ({
          value: airport.code,
          label: `${airport.city} (${airport.code}) - ${airport.name}, ${airport.country}`
        })),
    [selectedCountryTo]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const flights = mockFlights.filter(
      flight => 
        flight.origin === formData.from &&
        flight.destination === formData.to
    );
    setAvailableFlights(flights);
    setSearched(true);
  };

  const handleSelectFlight = (flight: Flight) => {
    navigate(`/book/${flight.id}`, { 
      state: { 
        formData: {
          ...formData,
          flightNumber: flight.flightNumber
        },
        flight
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Flight</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="space-y-6">
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-gray-400" />
                    <span>From Country</span>
                  </div>
                </label>
                <Select
                  options={countryOptions}
                  className="w-full"
                  placeholder="Select departure country"
                  onChange={(option) => {
                    setSelectedCountryFrom(option?.value || '');
                    setFormData({ ...formData, from: '' });
                  }}
                  isClearable
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-gray-400" />
                    <span>From Airport</span>
                  </div>
                </label>
                <Select
                  options={airportOptionsFrom}
                  className="w-full"
                  placeholder="Select departure airport"
                  onChange={(option) => setFormData({ ...formData, from: option?.value || '' })}
                  value={airportOptionsFrom.find(option => option.value === formData.from)}
                  isDisabled={!selectedCountryFrom && !formData.from}
                  required
                  isClearable
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-gray-400" />
                    <span>To Country</span>
                  </div>
                </label>
                <Select
                  options={countryOptions}
                  className="w-full"
                  placeholder="Select arrival country"
                  onChange={(option) => {
                    setSelectedCountryTo(option?.value || '');
                    setFormData({ ...formData, to: '' });
                  }}
                  isClearable
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 text-gray-400" />
                    <span>To Airport</span>
                  </div>
                </label>
                <Select
                  options={airportOptionsTo}
                  className="w-full"
                  placeholder="Select arrival airport"
                  onChange={(option) => setFormData({ ...formData, to: option?.value || '' })}
                  value={airportOptionsTo.find(option => option.value === formData.to)}
                  isDisabled={!selectedCountryTo && !formData.to}
                  required
                  isClearable
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>Passengers</span>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span>Class</span>
                </div>
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.seatClass}
                onChange={(e) => setFormData({ ...formData, seatClass: e.target.value as typeof formData.seatClass })}
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search Flights
          </button>
        </form>

        {searched && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Available Flights</h2>
            {availableFlights.length === 0 ? (
              <p className="text-gray-600">No flights found for this route.</p>
            ) : (
              <div className="space-y-4">
                {availableFlights.map((flight) => (
                  <div key={flight.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{flight.airline} - {flight.flightNumber}</p>
                        <p className="text-gray-600">
                          {new Date(flight.scheduledDeparture).toLocaleString()} - 
                          {new Date(flight.scheduledArrival).toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                          Terminal {flight.terminal} • Gate {flight.gate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          From ${formData.seatClass === 'Economy' ? flight.economyPrice :
                                formData.seatClass === 'Business' ? flight.businessPrice :
                                flight.firstClassPrice}
                        </p>
                        <button
                          onClick={() => handleSelectFlight(flight)}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;