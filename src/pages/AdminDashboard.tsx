import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Edit2, Save, X, Users, Plane, Plus, DollarSign } from 'lucide-react';
import { mockFlights, mockBookings, saveFlights } from '../data';
import { Flight, Booking, NewFlight } from '../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'flights' | 'bookings'>('flights');
  const [editingFlight, setEditingFlight] = useState<string | null>(null);
  const [editedFlightData, setEditedFlightData] = useState<Flight | null>(null);
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [prices, setPrices] = useState({
    economy: 0,
    business: 0,
    firstClass: 0
  });
  const [newFlight, setNewFlight] = useState<NewFlight>({
    airline: '',
    flightNumber: '',
    origin: '',
    destination: '',
    scheduledDeparture: '',
    scheduledArrival: '',
    terminal: '',
    gate: '',
    aircraftType: '',
    economyPrice: 0,
    businessPrice: 0,
    firstClassPrice: 0
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight.id);
    setEditedFlightData(flight);
  };

  const handleSaveEdit = () => {
    if (editedFlightData) {
      const flightIndex = mockFlights.findIndex(f => f.id === editedFlightData.id);
      if (flightIndex !== -1) {
        mockFlights[flightIndex] = editedFlightData;
        saveFlights(mockFlights);
      }
      setEditingFlight(null);
      setEditedFlightData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingFlight(null);
    setEditedFlightData(null);
  };

  const handleAddFlight = () => {
    const flight: Flight = {
      id: Math.random().toString(36).substr(2, 9),
      ...newFlight,
      actualDeparture: '',
      actualArrival: '',
      status: 'On Time',
      seats: []
    };
    mockFlights.push(flight);
    saveFlights(mockFlights);
    setShowAddFlight(false);
    setNewFlight({
      airline: '',
      flightNumber: '',
      origin: '',
      destination: '',
      scheduledDeparture: '',
      scheduledArrival: '',
      terminal: '',
      gate: '',
      aircraftType: '',
      economyPrice: 0,
      businessPrice: 0,
      firstClassPrice: 0
    });
  };

  const openPriceModal = (flight: Flight) => {
    setSelectedFlight(flight);
    setPrices({
      economy: flight.economyPrice,
      business: flight.businessPrice,
      firstClass: flight.firstClassPrice
    });
    setShowPriceModal(true);
  };

  const handleSavePrices = () => {
    if (selectedFlight) {
      const flightIndex = mockFlights.findIndex(f => f.id === selectedFlight.id);
      if (flightIndex !== -1) {
        mockFlights[flightIndex] = {
          ...mockFlights[flightIndex],
          economyPrice: prices.economy,
          businessPrice: prices.business,
          firstClassPrice: prices.firstClass
        };
        saveFlights(mockFlights);
      }
    }
    setShowPriceModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 flex items-center space-x-2 ${
                activeTab === 'flights'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('flights')}
            >
              <Plane className="h-5 w-5" />
              <span>Flights</span>
            </button>
            <button
              className={`px-6 py-3 flex items-center space-x-2 ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              <Users className="h-5 w-5" />
              <span>Bookings</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'flights' && (
            <div className="mb-6">
              <button
                onClick={() => setShowAddFlight(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Flight</span>
              </button>
            </div>
          )}

          {showAddFlight && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Flight</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.airline}
                    onChange={(e) => setNewFlight({...newFlight, airline: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.flightNumber}
                    onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.origin}
                    onChange={(e) => setNewFlight({...newFlight, origin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.destination}
                    onChange={(e) => setNewFlight({...newFlight, destination: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Departure</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.scheduledDeparture}
                    onChange={(e) => setNewFlight({...newFlight, scheduledDeparture: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Arrival</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.scheduledArrival}
                    onChange={(e) => setNewFlight({...newFlight, scheduledArrival: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terminal</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.terminal}
                    onChange={(e) => setNewFlight({...newFlight, terminal: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gate</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.gate}
                    onChange={(e) => setNewFlight({...newFlight, gate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft Type</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.aircraftType}
                    onChange={(e) => setNewFlight({...newFlight, aircraftType: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Economy Price</label>
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.economyPrice}
                    onChange={(e) => setNewFlight({...newFlight, economyPrice: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Price</label>
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.businessPrice}
                    onChange={(e) => setNewFlight({...newFlight, businessPrice: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Class Price</label>
                  <input
                    type="number"
                    className="w-full border rounded-md px-3 py-2"
                    value={newFlight.firstClassPrice}
                    onChange={(e) => setNewFlight({...newFlight, firstClassPrice: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={handleAddFlight}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Flight
                </button>
                <button
                  onClick={() => setShowAddFlight(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showPriceModal && selectedFlight && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Edit Flight Prices</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Economy Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        value={prices.economy}
                        onChange={(e) => setPrices({ ...prices, economy: parseInt(e.target.value) })}
                        className="pl-10 w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        value={prices.business}
                        onChange={(e) => setPrices({ ...prices, business: parseInt(e.target.value) })}
                        className="pl-10 w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Class Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        value={prices.firstClass}
                        onChange={(e) => setPrices({ ...prices, firstClass: parseInt(e.target.value) })}
                        className="pl-10 w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowPriceModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePrices}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flights' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prices
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockFlights.map((flight) => (
                    <tr key={flight.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingFlight === flight.id ? (
                          <input
                            type="text"
                            className="border rounded px-2 py-1"
                            value={editedFlightData?.flightNumber}
                            onChange={(e) =>
                              setEditedFlightData(prev => prev ? {
                                ...prev,
                                flightNumber: e.target.value
                              } : null)
                            }
                          />
                        ) : (
                          flight.flightNumber
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {flight.origin} → {flight.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingFlight === flight.id ? (
                          <select
                            className="border rounded px-2 py-1"
                            value={editedFlightData?.status}
                            onChange={(e) =>
                              setEditedFlightData(prev => prev ? {
                                ...prev,
                                status: e.target.value as Flight['status']
                              } : null)
                            }
                          >
                            <option value="On Time">On Time</option>
                            <option value="Delayed">Delayed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Landed">Landed</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            flight.status === 'On Time' ? 'bg-green-100 text-green-800' :
                            flight.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                            flight.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {flight.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openPriceModal(flight)}
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <DollarSign className="h-4 w-4" />
                          <span>Edit Prices</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingFlight === flight.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Save className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditFlight(flight)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passenger Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passengers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.pnr}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.flightNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.passengers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(booking.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;