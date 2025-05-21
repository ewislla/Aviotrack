import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Plane } from 'lucide-react';
import { mockFlights } from '../data';
import 'leaflet/dist/leaflet.css';

// Custom plane icon
const planeIcon = new L.DivIcon({
  className: 'custom-plane-icon',
  html: '<div class="bg-blue-600 p-2 rounded-full text-white transform -rotate-45"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const FlightTracker = () => {
  const [planes, setPlanes] = useState(mockFlights.map(flight => ({
    ...flight,
    position: getRandomPosition(),
    progress: 0
  })));

  function getRandomPosition() {
    return [
      20 + Math.random() * 40,
      -100 + Math.random() * 50
    ];
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPlanes(prevPlanes => 
        prevPlanes.map(plane => ({
          ...plane,
          progress: (plane.progress + 0.01) % 1,
          position: getRandomPosition()
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Live Flight Tracker</h1>
          <p className="text-gray-600">Track all our flights in real-time across the globe</p>
        </div>

        <div className="h-[600px] rounded-lg overflow-hidden shadow-inner">
          <MapContainer
            center={[30, -95]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {planes.map((plane) => (
              <React.Fragment key={plane.id}>
                <Marker
                  position={plane.position as [number, number]}
                  icon={planeIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{plane.airline}</h3>
                      <p>Flight: {plane.flightNumber}</p>
                      <p>{plane.origin} → {plane.destination}</p>
                      <p className="text-sm text-gray-600">Status: {plane.status}</p>
                    </div>
                  </Popup>
                </Marker>
                <Polyline
                  positions={[
                    plane.position as [number, number],
                    getRandomPosition() as [number, number]
                  ]}
                  color="#2563eb"
                  weight={2}
                  opacity={0.5}
                  dashArray="5, 10"
                />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {planes.map((plane) => (
            <div key={plane.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-full text-white">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{plane.flightNumber}</h3>
                  <p className="text-sm text-gray-600">{plane.origin} → {plane.destination}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  plane.status === 'On Time' ? 'bg-green-100 text-green-800' :
                  plane.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {plane.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightTracker;