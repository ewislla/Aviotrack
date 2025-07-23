import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Table, Edit2, Save, X, Users, Plane, Plus, DollarSign, MapPin, Mail, Calendar, Check } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import { Flight, Booking, Airport, FlightPlanRequest } from '../types';
import {
  getAllFlights,
  addFlight,
  updateFlight,
  getAllBookings,
  getAllAirports,
  getAllFlightPlanRequests,
  updateFlightPlanRequest
} from '../services/firebaseService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [airports, setAirports] = useState([]);
  const [flightPlanRequests, setFlightPlanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFlight, setEditingFlight] = useState(null);
  const [editedFlightData, setEditedFlightData] = useState(null);
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [newFlight, setNewFlight] = useState({
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
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [flightsData, bookingsData, airportsData, requestsData] = await Promise.all([
        getAllFlights(),
        getAllBookings(),
        getAllAirports(),
        getAllFlightPlanRequests()
      ]);
      
const [flights, setFlights] = useState<Flight[]>([]);
const [bookings, setBookings] = useState<Booking[]>([]);
const [airports, setAirports] = useState<Airport[]>([]);
const [flightPlanRequests, setFlightPlanRequests] = useState<FlightPlanRequest[]>([]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = (economyPrice: number, businessPrice: number, firstClassPrice: number) => {
    const seats = [];
    
    // First Class (Rows 1-2)
    for (let row = 1; row <= 2; row++) {
      for (let col of ['A', 'C', 'D', 'F']) {
        seats.push({
          id: `${row}${col}`,
          number: `${row}${col}`,
          class: 'First Class',
          status: 'Available',
          price: firstClassPrice
        });
      }
    }

    // Business Class (Rows 3-7)
    for (let row = 3; row <= 7; row++) {
      for (let col of ['A', 'C', 'D', 'F']) {
        seats.push({
          id: `${row}${col}`,
          number: `${row}${col}`,
          class: 'Business',
          status: 'Available',
          price: businessPrice
        });
      }
    }

    // Economy Class (Rows 8-32)
    for (let row = 8; row <= 32; row++) {
      for (let col of ['A', 'B', 'C', 'D', 'E', 'F']) {
        seats.push({
          id: `${row}${col}`,
          number: `${row}${col}`,
          class: 'Economy',
          status: 'Available',
          price: economyPrice
        });
      }
    }

    return seats;
  };

  const handleAddFlight = async () => {
    if (!newFlight.origin || !newFlight.destination) {
      toast.error('Please select both origin and destination airports');
      return;
    }

    if (newFlight.origin === newFlight.destination) {
      toast.error('Origin and destination cannot be the same');
      return;
    }

    try {
      const flightData = {
        ...newFlight,
        actualDeparture: '',
        actualArrival: '',
        status: 'On Time',
        seats: generateSeats(newFlight.economyPrice, newFlight.businessPrice, newFlight.firstClassPrice)
      };

      await addFlight(flightData);
      await loadData(); // Refresh data
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
      toast.success('Flight added successfully');
    } catch (error) {
      console.error('Error adding flight:', error);
      toast.error('Error adding flight');
    }
  };

  const handleSaveEdit = async () => {
    if (editedFlightData) {
      try {
        await updateFlight(editedFlightData.id, editedFlightData);
        await loadData(); // Refresh data
        setEditingFlight(null);
        setEditedFlightData(null);
        toast.success('Flight updated successfully');
      } catch (error) {
        console.error('Error updating flight:', error);
        toast.error('Error updating flight');
      }
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await updateFlightPlanRequest(requestId, { status: newStatus });
      await loadData(); // Refresh data
      toast.success('Request status updated');
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Error updating request status');
    }
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
        toast.success('Prices updated successfully');
      }
    }
    setShowPriceModal(false);
  };

  const getStatusColor = (status: FlightPlanRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Example logout logic
    localStorage.removeItem('user'); // Or whatever key you use
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Link
            to="/admin/airports"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-flex items-center space-x-2"
          >
            <MapPin className="h-5 w-5" />
            <span>Manage Airports</span>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
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
            <button
              className={`px-6 py-3 flex items-center space-x-2 ${
                activeTab === 'requests'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              <Calendar className="h-5 w-5" />
              <span>Flight Plan Requests</span>
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
                  <Select
                    options={airportOptions}
                    value={airportOptions.find(option => option.value === newFlight.origin)}
                    onChange={(option) => setNewFlight({...newFlight, origin: option?.value || ''})}
                    className="text-sm"
                    placeholder="Select origin airport"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <Select
                    options={airportOptions}
                    value={airportOptions.find(option => option.value === newFlight.destination)}
                    onChange={(option) => setNewFlight({...newFlight, destination: option?.value || ''})}
                    className="text-sm"
                    placeholder="Select destination airport"
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
          ) : activeTab === 'bookings' ? (
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
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flightPlanRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{request.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-600">Start: {new Date(request.startDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">End: {new Date(request.endDate).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {request.status === 'pending' && (
                            <button
                              onClick={() => updateRequestStatus(request.id, 'contacted')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Mark as Contacted"
                            >
                              <Mail className="h-5 w-5" />
                            </button>
                          )}
                          {request.status === 'contacted' && (
                            <button
                              onClick={() => updateRequestStatus(request.id, 'completed')}
                              className="text-green-600 hover:text-green-800"
                              title="Mark as Completed"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                        </div>
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