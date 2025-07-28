
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Clock, 
  MapPin, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Navigation,
  Thermometer,
  Wind,
  Cloud
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Flight, SearchParams } from '../types';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const FlightStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const searchParams = location.state as SearchParams;

  useEffect(() => {
    if (!searchParams) {
      navigate('/');
      return;
    }
    fetchFlights();
  }, [searchParams, navigate]);

  // Update current time every second for real-time calculations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh flight data every minute
  useEffect(() => {
    if (!searchParams) return;
    
    const refreshTimer = setInterval(() => {
      fetchFlights();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshTimer);
  }, [searchParams]);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const flightsRef = collection(db, 'flights');
      let q;

      if (searchParams.type === 'number' && searchParams.flightNumber) {
        q = query(
          flightsRef,
          where('flightNumber', '==', searchParams.flightNumber.toUpperCase())
        );
      } else if (searchParams.type === 'route' && searchParams.origin && searchParams.destination) {
        q = query(
          flightsRef,
          where('origin', '==', searchParams.origin.toUpperCase()),
          where('destination', '==', searchParams.destination.toUpperCase()),
          orderBy('scheduledDeparture')
        );
      } else {
        setFlights([]);
        setLoading(false);
        return;
      }

      const querySnapshot = await getDocs(q);
      const flightData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Flight[];

      setFlights(flightData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching flights:', error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on time':
      case 'boarding':
        return 'text-green-600 bg-green-50';
      case 'delayed':
        return 'text-orange-600 bg-orange-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'landed':
        return 'text-blue-600 bg-blue-50';
      case 'in flight':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on time':
      case 'landed':
        return <CheckCircle className="h-5 w-5" />;
      case 'delayed':
      case 'cancelled':
        return <AlertCircle className="h-5 w-5" />;
      case 'in flight':
        return <Navigation className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const calculateFlightProgress = (flight: Flight) => {
    const now = currentTime;
    const departure = new Date(flight.actualDeparture || flight.scheduledDeparture);
    const arrival = new Date(flight.scheduledArrival);
    
    // If flight is cancelled, return 0
    if (flight.status.toLowerCase() === 'cancelled') return 0;
    
    // If flight has landed, return 100
    if (flight.status.toLowerCase() === 'landed') return 100;
    
    // If flight hasn't departed yet
    if (now < departure) return 0;
    
    // If flight should have arrived
    if (now > arrival) return 100;
    
    const totalDuration = arrival.getTime() - departure.getTime();
    const elapsed = now.getTime() - departure.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const getTimeRemaining = (flight: Flight) => {
    const now = currentTime;
    const departure = new Date(flight.actualDeparture || flight.scheduledDeparture);
    const arrival = new Date(flight.scheduledArrival);
    
    if (flight.status.toLowerCase() === 'cancelled') {
      return t('flightStatus.flightCancelled') || 'Flight Cancelled';
    }
    
    if (flight.status.toLowerCase() === 'landed') {
      return t('flightStatus.flightLanded') || 'Flight Landed';
    }
    
    // Flight hasn't departed yet
    if (now < departure) {
      const timeToDeparture = departure.getTime() - now.getTime();
      const hours = Math.floor(timeToDeparture / (1000 * 60 * 60));
      const minutes = Math.floor((timeToDeparture % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours <= 0 && minutes <= 0) {
        return 'Departing Now';
      }
      
      return `${t('flightStatus.departsIn') || 'Departs in'} ${hours}h ${minutes}m`;
    }
    
    // Flight is in progress
    if (now >= departure && now < arrival) {
      const timeToArrival = arrival.getTime() - now.getTime();
      const hours = Math.floor(timeToArrival / (1000 * 60 * 60));
      const minutes = Math.floor((timeToArrival % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours <= 0 && minutes <= 0) {
        return 'Landing Now';
      }
      
      return `${t('flightStatus.landsIn') || 'Lands in'} ${hours}h ${minutes}m`;
    }
    
    // Flight should have landed
    const timeSinceLanding = now.getTime() - arrival.getTime();
    const hoursSince = Math.floor(timeSinceLanding / (1000 * 60 * 60));
    const minutesSince = Math.floor((timeSinceLanding % (1000 * 60 * 60)) / (1000 * 60));
    
    return `Landed ${hoursSince}h ${minutesSince}m ago`;
  };

  const formatDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const duration = arr.getTime() - dep.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Mock weather data for demonstration
  const getWeatherInfo = () => ({
    temperature: '22°C',
    conditions: 'Clear',
    windSpeed: '15 km/h',
    visibility: '10 km'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('flightStatus.title')}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchFlights}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <div className="text-sm text-gray-500">
                Auto-updating every minute
              </div>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {t('flightStatus.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {flights.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('flightStatus.noFlights')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('flightStatus.noFlightsDesc')}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('flightStatus.searchAgain')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {flights.map((flight) => {
              const progress = calculateFlightProgress(flight);
              const weather = getWeatherInfo();
              
              return (
                <div key={flight.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Flight Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full">
                          <Plane className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{flight.flightNumber}</h2>
                          <p className="text-blue-100">{flight.airline}</p>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(flight.status)} text-sm font-medium`}>
                        {getStatusIcon(flight.status)}
                        <span className="text-gray-800">{t(`flightStatus.${flight.status.toLowerCase().replace(' ', '')}`) || flight.status}</span>
                      </div>
                    </div>

                    {/* Route Information */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{flight.origin}</p>
                        <p className="text-blue-200 text-sm">{t('flightStatus.departure')}</p>
                        <p className="text-lg">{formatTime(flight.scheduledDeparture)}</p>
                        {flight.actualDeparture && (
                          <p className="text-sm text-blue-200">
                            {t('flightStatus.actual')}: {formatTime(flight.actualDeparture)}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 px-8">
                        <div className="relative">
                          <div className="flex items-center justify-center mb-2">
                            <ArrowRight className="h-6 w-6" />
                          </div>
                          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-2">
                            <div 
                              className="bg-white h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-center text-sm">
                            {formatDuration(flight.scheduledDeparture, flight.scheduledArrival)}
                          </p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-3xl font-bold">{flight.destination}</p>
                        <p className="text-blue-200 text-sm">{t('flightStatus.arrival')}</p>
                        <p className="text-lg">{formatTime(flight.scheduledArrival)}</p>
                        {flight.actualArrival && (
                          <p className="text-sm text-blue-200">
                            {t('flightStatus.actual')}: {formatTime(flight.actualArrival)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Flight Info */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Flight Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('flightStatus.aircraft')}:</span>
                            <span className="font-medium">{flight.aircraftType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('flightStatus.terminal')}:</span>
                            <span className="font-medium">{flight.terminal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t('flightStatus.gate')}:</span>
                            <span className="font-medium">{flight.gate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Current Status */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
                        <div className="space-y-2">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">{t('flightStatus.estimatedTimeRemaining')}</p>
                            <p className="font-semibold text-gray-900">{getTimeRemaining(flight)}</p>
                          </div>
                          {(flight.status.toLowerCase() === 'in flight' || 
                           (calculateFlightProgress(flight) > 0 && calculateFlightProgress(flight) < 100 && 
                            flight.status.toLowerCase() !== 'cancelled' && flight.status.toLowerCase() !== 'landed')) && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">{t('flightStatus.altitude') || 'Altitude'}:</span>
                                <span className="font-medium">35,000 ft</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">{t('flightStatus.speed') || 'Speed'}:</span>
                                <span className="font-medium">550 mph</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Progress:</span>
                                <span className="font-medium">{Math.round(calculateFlightProgress(flight))}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Weather Conditions */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 mb-3">{t('flightStatus.weatherConditions')}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Thermometer className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-600">Temperature:</span>
                            </div>
                            <span className="font-medium">{weather.temperature}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Cloud className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-600">Conditions:</span>
                            </div>
                            <span className="font-medium">{weather.conditions}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Wind className="h-4 w-4 text-gray-600" />
                              <span className="text-gray-600">Wind:</span>
                            </div>
                            <span className="font-medium">{weather.windSpeed}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Available Fares - Only show for bookable flights */}
                    {flight.economyPrice && 
                     (flight.status.toLowerCase() === 'on time' || 
                      flight.status.toLowerCase() === 'delayed' || 
                      flight.status.toLowerCase() === 'boarding') && (
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">{t('flightStatus.availableFares')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-1">{t('flightStatus.economy')}</p>
                            <p className="text-2xl font-bold text-gray-900">${flight.economyPrice}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-1">{t('flightStatus.business')}</p>
                            <p className="text-2xl font-bold text-gray-900">${flight.businessPrice}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-600 mb-1">{t('flightStatus.firstClass')}</p>
                            <p className="text-2xl font-bold text-gray-900">${flight.firstClassPrice}</p>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <button
                            onClick={() => navigate('/book', { 
                              state: { 
                                preselectedFlight: flight,
                                origin: flight.origin,
                                destination: flight.destination
                              }
                            })}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                          >
                            {t('flightStatus.bookNow')}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Message for non-bookable flights */}
                    {(flight.status.toLowerCase() === 'landed' || 
                      flight.status.toLowerCase() === 'cancelled' ||
                      flight.status.toLowerCase() === 'in flight') && (
                      <div className="border-t pt-6">
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                          <p className="text-gray-700">
                            {flight.status.toLowerCase() === 'landed' && 'This flight has already landed and is no longer available for booking.'}
                            {flight.status.toLowerCase() === 'cancelled' && 'This flight has been cancelled and is not available for booking.'}
                            {flight.status.toLowerCase() === 'in flight' && 'This flight is currently in progress and no longer available for booking.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightStatus;
