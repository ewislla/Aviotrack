
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Plane, Clock, MapPin, Wifi, WifiOff, Battery, Signal } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Flight } from '../types';
import 'leaflet/dist/leaflet.css';

// Airport coordinates database
const airportCoordinates: { [key: string]: [number, number] } = {
  'JFK': [40.6413, -73.7781],
  'LAX': [33.9425, -118.4081],
  'LHR': [51.4700, -0.4543],
  'CDG': [49.0097, 2.5479],
  'DXB': [25.2532, 55.3657],
  'ORD': [41.9742, -87.9073],
  'DEN': [39.8561, -104.6737],
  'SEA': [47.4502, -122.3088],
  'SFO': [37.6213, -122.3790],
  'NRT': [35.7720, 140.3929],
  'FRA': [50.0379, 8.5622],
  'AMS': [52.3105, 4.7683],
  'SIN': [1.3644, 103.9915],
  'HKG': [22.3080, 113.9185],
  'ICN': [37.4602, 126.4407]
};

// Custom plane icon with rotation
const createPlaneIcon = (rotation: number, status: string) => {
  const color = status === 'On Time' ? '#10b981' : 
               status === 'Delayed' ? '#f59e0b' : 
               status === 'Cancelled' ? '#ef4444' : '#3b82f6';
  
  return new L.DivIcon({
    className: 'custom-plane-icon',
    html: `<div class="plane-marker" style="transform: rotate(${rotation}deg); color: ${color};">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
               <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
             </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const FlightTracker = () => {
  const [flights, setFlights] = useState<(Flight & { 
    position: [number, number], 
    progress: number,
    bearing: number,
    altitude: number,
    speed: number,
    isTracking: boolean 
  })[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);

  // Calculate bearing between two points
  const calculateBearing = (start: [number, number], end: [number, number]): number => {
    const startLat = start[0] * Math.PI / 180;
    const startLng = start[1] * Math.PI / 180;
    const endLat = end[0] * Math.PI / 180;
    const endLng = end[1] * Math.PI / 180;

    const dLng = endLng - startLng;
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  // Interpolate position between origin and destination
  const interpolatePosition = (
    origin: [number, number], 
    destination: [number, number], 
    progress: number
  ): [number, number] => {
    const lat = origin[0] + (destination[0] - origin[0]) * progress;
    const lng = origin[1] + (destination[1] - origin[1]) * progress;
    return [lat, lng];
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        // Get only active flights (not cancelled or landed)
        const q = query(
          collection(db, "flights"),
          where("status", "in", ["On Time", "Delayed"])
        );
        const snapshot = await getDocs(q);
        
        const fetchedFlights = snapshot.docs.map((doc) => {
          const flightData = doc.data() as Flight;
          const originCoords = airportCoordinates[flightData.origin] || [0, 0];
          const destCoords = airportCoordinates[flightData.destination] || [0, 0];
          
          // Calculate flight progress based on time
          const now = new Date().getTime();
          const departure = new Date(flightData.scheduledDeparture).getTime();
          const arrival = new Date(flightData.scheduledArrival).getTime();
          const totalDuration = arrival - departure;
          const elapsed = now - departure;
          const progress = Math.max(0, Math.min(1, elapsed / totalDuration));
          
          return {
            ...flightData,
            id: doc.id,
            position: interpolatePosition(originCoords, destCoords, progress),
            progress,
            bearing: calculateBearing(originCoords, destCoords),
            altitude: 35000 + Math.random() * 5000, // Realistic cruising altitude
            speed: 450 + Math.random() * 100, // Realistic cruising speed
            isTracking: Math.random() > 0.1 // 90% of flights have tracking
          };
        });
        
        setFlights(fetchedFlights);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
    
    // Update positions every 30 seconds for more realistic tracking
    const interval = setInterval(() => {
      setFlights(prevFlights => 
        prevFlights.map(flight => {
          const now = new Date().getTime();
          const departure = new Date(flight.scheduledDeparture).getTime();
          const arrival = new Date(flight.scheduledArrival).getTime();
          const totalDuration = arrival - departure;
          const elapsed = now - departure;
          const newProgress = Math.max(0, Math.min(1, elapsed / totalDuration));
          
          const originCoords = airportCoordinates[flight.origin] || [0, 0];
          const destCoords = airportCoordinates[flight.destination] || [0, 0];
          
          return {
            ...flight,
            progress: newProgress,
            position: interpolatePosition(originCoords, destCoords, newProgress),
            // Add slight variations to simulate real flight paths
            altitude: flight.altitude + (Math.random() - 0.5) * 1000,
            speed: flight.speed + (Math.random() - 0.5) * 20
          };
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getFlightStatus = (flight: any) => {
    if (flight.progress >= 1) return 'Arrived';
    if (flight.progress > 0) return 'In Flight';
    return 'Preparing';
  };

  const formatDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const duration = (arr.getTime() - dep.getTime()) / (1000 * 60 * 60);
    return `${Math.floor(duration)}h ${Math.floor((duration % 1) * 60)}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Live Flight Tracker</h1>
          <p className="text-gray-600">Real-time tracking of active flights with live position updates</p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">On Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Delayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">In Flight</span>
            </div>
          </div>
        </div>

        <div className="h-[600px] rounded-lg overflow-hidden shadow-inner mb-8">
          <MapContainer
            center={[30, -95]}
            zoom={3}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Airport markers */}
            {Object.entries(airportCoordinates).map(([code, coords]) => (
              <Circle
                key={code}
                center={coords}
                radius={50000}
                fillColor="#3b82f6"
                fillOpacity={0.2}
                stroke={false}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{code}</h3>
                    <p className="text-sm text-gray-600">Airport</p>
                  </div>
                </Popup>
              </Circle>
            ))}
            
            {/* Flight markers and paths */}
            {flights.map((flight) => {
              const originCoords = airportCoordinates[flight.origin] || [0, 0];
              const destCoords = airportCoordinates[flight.destination] || [0, 0];
              
              return (
                <React.Fragment key={flight.id}>
                  {/* Flight path */}
                  <Polyline
                    positions={[originCoords, destCoords]}
                    color="#e5e7eb"
                    weight={2}
                    opacity={0.5}
                    dashArray="5, 10"
                  />
                  {/* Progress line */}
                  <Polyline
                    positions={[originCoords, flight.position]}
                    color={flight.status === 'On Time' ? '#10b981' : '#f59e0b'}
                    weight={3}
                    opacity={0.8}
                  />
                  {/* Aircraft marker */}
                  <Marker
                    position={flight.position}
                    icon={createPlaneIcon(flight.bearing, flight.status)}
                    eventHandlers={{
                      click: () => setSelectedFlight(flight.id)
                    }}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{flight.flightNumber}</h3>
                          {flight.isTracking ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                          ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{flight.airline}</p>
                        <p className="text-sm"><strong>{flight.origin}</strong> → <strong>{flight.destination}</strong></p>
                        <div className="mt-2 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={`font-medium ${
                              flight.status === 'On Time' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {getFlightStatus(flight)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Altitude:</span>
                            <span>{Math.round(flight.altitude).toLocaleString()} ft</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Speed:</span>
                            <span>{Math.round(flight.speed)} mph</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Progress:</span>
                            <span>{Math.round(flight.progress * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <div 
              key={flight.id} 
              className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all ${
                selectedFlight === flight.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedFlight(selectedFlight === flight.id ? null : flight.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-full text-white">
                    <Plane className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{flight.flightNumber}</h3>
                    <p className="text-xs text-gray-500">{flight.airline}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {flight.isTracking ? (
                    <Signal className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                  <Battery className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{flight.origin} → {flight.destination}</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(flight.scheduledDeparture, flight.scheduledArrival)}</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    flight.status === 'On Time' ? 'bg-green-100 text-green-800' :
                    flight.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {getFlightStatus(flight)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${flight.progress * 100}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Altitude:</span>
                    <br />
                    {Math.round(flight.altitude).toLocaleString()} ft
                  </div>
                  <div>
                    <span className="font-medium">Speed:</span>
                    <br />
                    {Math.round(flight.speed)} mph
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {flights.length === 0 && (
          <div className="text-center py-8">
            <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No active flights to track at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightTracker;
