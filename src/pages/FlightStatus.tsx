import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Clock, MapPin } from 'lucide-react';
import { mockFlights } from '../data';
import { Flight, SearchParams } from '../types';

const FlightStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state as SearchParams;

  const filteredFlights = mockFlights.filter((flight) => {
    if (searchParams.type === 'number') {
      return flight.flightNumber.toLowerCase() === searchParams.flightNumber?.toLowerCase();
    } else {
      return (
        flight.origin.toLowerCase() === searchParams.origin?.toLowerCase() &&
        flight.destination.toLowerCase() === searchParams.destination?.toLowerCase()
      );
    }
  });

  const handleBookFlight = (flight: Flight) => {
    navigate(`/book/${flight.id}`);
  };

  const getStatusColor = (status: Flight['status']) => {
    switch (status) {
      case 'On Time':
        return 'text-green-600';
      case 'Delayed':
        return 'text-yellow-600';
      case 'Cancelled':
        return 'text-red-600';
      case 'Landed':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Flight Status Results</h1>
      
      {filteredFlights.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No flights found matching your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFlights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Plane className="h-8 w-8 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-semibold">{flight.airline}</h2>
                    <p className="text-gray-600">Flight {flight.flightNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-lg font-semibold ${getStatusColor(flight.status)}`}>
                    {flight.status}
                  </span>
                  {flight.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleBookFlight(flight)}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">Departure</p>
                      <p className="text-lg">{flight.origin}</p>
                      <div className="text-sm text-gray-600">
                        <p>Terminal {flight.terminal} • Gate {flight.gate}</p>
                        <div className="mt-1">
                          <p>Scheduled: {new Date(flight.scheduledDeparture).toLocaleString()}</p>
                          {flight.actualDeparture && (
                            <p>Actual: {new Date(flight.actualDeparture).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">Arrival</p>
                      <p className="text-lg">{flight.destination}</p>
                      <div className="text-sm text-gray-600">
                        <p>Terminal {flight.terminal} • Gate {flight.gate}</p>
                        <div className="mt-1">
                          <p>Scheduled: {new Date(flight.scheduledArrival).toLocaleString()}</p>
                          {flight.actualArrival && (
                            <p>Actual: {new Date(flight.actualArrival).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Clock className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">Flight Duration</p>
                      <p className="text-sm text-gray-600">
                        {Math.round(
                          (new Date(flight.scheduledArrival).getTime() -
                            new Date(flight.scheduledDeparture).getTime()) /
                            (1000 * 60)
                        )}{' '}
                        minutes
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Aircraft</p>
                    <p className="text-sm text-gray-600">{flight.aircraftType}</p>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Available Fares</h3>
                    <div className="space-y-2">
                      <p className="text-sm">Economy: ${flight.economyPrice}</p>
                      <p className="text-sm">Business: ${flight.businessPrice}</p>
                      <p className="text-sm">First Class: ${flight.firstClassPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightStatus;