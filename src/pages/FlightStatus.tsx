
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Clock, MapPin, Timer, Calendar, AlertCircle } from 'lucide-react';
import { Flight, SearchParams } from '../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

const FlightStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state as SearchParams;
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        let q;
        
        if (searchParams.type === 'number') {
          q = query(
            collection(db, 'flights'),
            where('flightNumber', '==', searchParams.flightNumber?.toUpperCase())
          );
        } else {
          q = query(
            collection(db, 'flights'),
            where('origin', '==', searchParams.origin?.toUpperCase()),
            where('destination', '==', searchParams.destination?.toUpperCase())
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedFlights = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Flight[];

        setFlights(fetchedFlights);
      } catch (error) {
        console.error('Error fetching flights:', error);
        toast.error('Failed to fetch flight data');
      } finally {
        setLoading(false);
      }
    };

    if (searchParams) {
      fetchFlights();
    }

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, [searchParams]);

  const handleBookFlight = (flight: Flight) => {
    navigate(`/booking-details/${flight.id}`);
  };

  const getStatusColor = (status: Flight['status']) => {
    switch (status) {
      case 'On Time':
        return 'text-green-600 bg-green-100';
      case 'Delayed':
        return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      case 'Landed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTimeRemaining = (flight: Flight) => {
    const now = currentTime.getTime();
    const departureTime = new Date(flight.scheduledDeparture).getTime();
    const arrivalTime = new Date(flight.scheduledArrival).getTime();
    
    if (flight.status === 'Landed') {
      return { text: 'Flight has landed', color: 'text-blue-600' };
    }
    
    if (flight.status === 'Cancelled') {
      return { text: 'Flight cancelled', color: 'text-red-600' };
    }

    if (now < departureTime) {
      const timeToDeparture = departureTime - now;
      const hours = Math.floor(timeToDeparture / (1000 * 60 * 60));
      const minutes = Math.floor((timeToDeparture % (1000 * 60 * 60)) / (1000 * 60));
      return { 
        text: `Departs in ${hours}h ${minutes}m`, 
        color: 'text-gray-600' 
      };
    }
    
    if (now >= departureTime && now < arrivalTime) {
      const timeToArrival = arrivalTime - now;
      const hours = Math.floor(timeToArrival / (1000 * 60 * 60));
      const minutes = Math.floor((timeToArrival % (1000 * 60 * 60)) / (1000 * 60));
      return { 
        text: `Lands in ${hours}h ${minutes}m`, 
        color: 'text-green-600' 
      };
    }
    
    return { text: 'Flight should have landed', color: 'text-red-600' };
  };

  const getFlightProgress = (flight: Flight) => {
    const now = currentTime.getTime();
    const departureTime = new Date(flight.scheduledDeparture).getTime();
    const arrivalTime = new Date(flight.scheduledArrival).getTime();
    
    if (now < departureTime) return 0;
    if (now > arrivalTime) return 100;
    
    const totalDuration = arrivalTime - departureTime;
    const elapsed = now - departureTime;
    return Math.round((elapsed / totalDuration) * 100);
  };

  const formatFlightDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const duration = (arr.getTime() - dep.getTime()) / (1000 * 60 * 60);
    return `${Math.floor(duration)}h ${Math.floor((duration % 1) * 60)}m`;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Flight Status Results</h1>
        <div className="text-sm text-gray-600">
          Last updated: {currentTime.toLocaleTimeString()}
        </div>
      </div>
      
      {flights.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No flights found</h2>
          <p className="text-gray-600">No flights found matching your search criteria.</p>
          <button
            onClick={() => navigate('/flight-status')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Search Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {flights.map((flight) => {
            const timeRemaining = calculateTimeRemaining(flight);
            const progress = getFlightProgress(flight);
            const departureDateTime = formatDateTime(flight.scheduledDeparture);
            const arrivalDateTime = formatDateTime(flight.scheduledArrival);

            return (
              <div key={flight.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600 p-3 rounded-full">
                        <Plane className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{flight.airline}</h2>
                        <p className="text-gray-600">Flight {flight.flightNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(flight.status)}`}>
                        {flight.status}
                      </div>
                      <div className={`text-sm mt-1 ${timeRemaining.color}`}>
                        <Timer className="h-4 w-4 inline mr-1" />
                        {timeRemaining.text}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Departure</p>
                          <p className="text-xl font-semibold">{flight.origin}</p>
                          <div className="text-sm text-gray-600">
                            <p>Terminal {flight.terminal} • Gate {flight.gate}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{departureDateTime.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Scheduled: {departureDateTime.time}</span>
                              </div>
                              {flight.actualDeparture && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Actual: {formatDateTime(flight.actualDeparture).time}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Arrival</p>
                          <p className="text-xl font-semibold">{flight.destination}</p>
                          <div className="text-sm text-gray-600">
                            <p>Terminal {flight.terminal} • Gate {flight.gate}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{arrivalDateTime.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Scheduled: {arrivalDateTime.time}</span>
                              </div>
                              {flight.actualArrival && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Actual: {formatDateTime(flight.actualArrival).time}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Flight Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">{progress}% Complete</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">Flight Duration</p>
                        <p className="text-sm text-gray-600">
                          {formatFlightDuration(flight.scheduledDeparture, flight.scheduledArrival)}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Aircraft</p>
                        <p className="text-sm text-gray-600">{flight.aircraftType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900">Available Fares</h3>
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <span>Economy: ${flight.economyPrice}</span>
                          <span>Business: ${flight.businessPrice}</span>
                          <span>First Class: ${flight.firstClassPrice}</span>
                        </div>
                      </div>
                      {flight.status !== 'Cancelled' && flight.status !== 'Landed' && (
                        <button
                          onClick={() => handleBookFlight(flight)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FlightStatus;
