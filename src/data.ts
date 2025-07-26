
export const saveBookings = (bookings: any[]) => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};


import { Flight, Booking, Seat, Destination, TripPlan } from './types';

// Generate seat numbers for a flight
const generateSeats = (economyPrice: number, businessPrice: number, firstClassPrice: number): Seat[] => {
  const seats: Seat[] = [];
  
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

// Load destinations from localStorage or use default list
const savedDestinations = localStorage.getItem('destinations');
export const destinations: Destination[] = savedDestinations ? JSON.parse(savedDestinations) : [
  { id: '1', code: 'JFK', city: 'New York', country: 'United States', isActive: true },
  { id: '2', code: 'LAX', city: 'Los Angeles', country: 'United States', isActive: true },
  { id: '3', code: 'LHR', city: 'London', country: 'United Kingdom', isActive: true },
  { id: '4', code: 'CDG', city: 'Paris', country: 'France', isActive: true },
  { id: '5', code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', isActive: true }
];

// Save destinations to localStorage
export const saveDestinations = (destinations: Destination[]) => {
  localStorage.setItem('destinations', JSON.stringify(destinations));
};

// Load trip plans from localStorage or use empty array
const savedTripPlans = localStorage.getItem('tripPlans');
export const tripPlans: TripPlan[] = savedTripPlans ? JSON.parse(savedTripPlans) : [];

// Save trip plans to localStorage
export const saveTripPlans = (plans: TripPlan[]) => {
  localStorage.setItem('tripPlans', JSON.stringify(plans));
};

// Load bookings from localStorage or use empty array
const savedBookings = localStorage.getItem('bookings');
export const mockBookings: Booking[] = savedBookings ? JSON.parse(savedBookings) : [];

// Save bookings to localStorage
export const saveBookings = (bookings: any[]) => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'United Airlines',
    flightNumber: 'UA123',
    origin: 'JFK',
    destination: 'LAX',
    scheduledDeparture: '2024-03-20T10:00:00',
    actualDeparture: '2024-03-20T10:15:00',
    scheduledArrival: '2024-03-20T11:30:00',
    actualArrival: '2024-03-20T11:45:00',
    terminal: 'A',
    gate: 'A12',
    status: 'On Time',
    aircraftType: 'Boeing 737-800',
    economyPrice: 199,
    businessPrice: 499,
    firstClassPrice: 899,
    seats: generateSeats(199, 499, 899)
  },
  {
    id: '2',
    airline: 'United Airlines',
    flightNumber: 'UA456',
    origin: 'LAX',
    destination: 'JFK',
    scheduledDeparture: '2024-03-20T14:00:00',
    actualDeparture: '2024-03-20T14:30:00',
    scheduledArrival: '2024-03-20T22:00:00',
    actualArrival: '2024-03-20T22:30:00',
    terminal: 'B',
    gate: 'B15',
    status: 'Delayed',
    aircraftType: 'Boeing 787-9',
    economyPrice: 399,
    businessPrice: 899,
    firstClassPrice: 1499,
    seats: generateSeats(399, 899, 1499)
  },
  {
    id: '3',
    airline: 'United Airlines',
    flightNumber: 'UA789',
    origin: 'ORD',
    destination: 'DEN',
    scheduledDeparture: '2024-03-20T08:00:00',
    actualDeparture: '2024-03-20T08:00:00',
    scheduledArrival: '2024-03-20T10:00:00',
    actualArrival: '2024-03-20T09:45:00',
    terminal: 'C',
    gate: 'C22',
    status: 'Landed',
    aircraftType: 'Airbus A320',
    economyPrice: 299,
    businessPrice: 699,
    firstClassPrice: 1199,
    seats: generateSeats(299, 699, 1199)
  },
  {
    id: '4',
    airline: 'United Airlines',
    flightNumber: 'UA321',
    origin: 'SEA',
    destination: 'SFO',
    scheduledDeparture: '2024-03-20T16:00:00',
    actualDeparture: '',
    scheduledArrival: '2024-03-20T18:30:00',
    actualArrival: '',
    terminal: 'D',
    gate: 'D8',
    status: 'Cancelled',
    aircraftType: 'Boeing 737-900',
    economyPrice: 249,
    businessPrice: 599,
    firstClassPrice: 999,
    seats: generateSeats(249, 599, 999)
  }
];

// Load flights from localStorage or use default mockFlights
const savedFlights = localStorage.getItem('flights');
export const flights: Flight[] = savedFlights ? JSON.parse(savedFlights) : mockFlights;

// Save flights to localStorage
export const saveFlights = (flights: Flight[]) => {
  localStorage.setItem('flights', JSON.stringify(flights));
};

// Update seat status
export const updateSeatStatus = (flightId: string, seatNumbers: string[], status: 'Available' | 'Booked') => {
  const flightIndex = flights.findIndex(f => f.id === flightId);
  if (flightIndex === -1) return;

  const updatedFlight = { ...flights[flightIndex] };
  updatedFlight.seats = updatedFlight.seats.map(seat => {
    if (seatNumbers.includes(seat.number)) {
      return { ...seat, status };
    }
    return seat;
  });

  flights[flightIndex] = updatedFlight;
  saveFlights(flights);
};

// Add new destination
export const addDestination = (destination: Destination) => {
  destinations.push(destination);
  saveDestinations(destinations);
};

// Update destination
export const updateDestination = (id: string, updates: Partial<Destination>) => {
  const index = destinations.findIndex(d => d.id === id);
  if (index !== -1) {
    destinations[index] = { ...destinations[index], ...updates };
    saveDestinations(destinations);
  }
};

// Delete destination
export const deleteDestination = (id: string) => {
  const index = destinations.findIndex(d => d.id === id);
  if (index !== -1) {
    destinations.splice(index, 1);
    saveDestinations(destinations);
  }
};

// Add trip plan
export const addTripPlan = (plan: TripPlan) => {
  tripPlans.push(plan);
  saveTripPlans(tripPlans);
};

// Update trip plan
export const updateTripPlan = (id: string, updates: Partial<TripPlan>) => {
  const index = tripPlans.findIndex(p => p.id === id);
  if (index !== -1) {
    tripPlans[index] = { ...tripPlans[index], ...updates };
    saveTripPlans(tripPlans);
  }
};

// Delete trip plan
export const deleteTripPlan = (id: string) => {
  const index = tripPlans.findIndex(p => p.id === id);
  if (index !== -1) {
    tripPlans.splice(index, 1);
    saveTripPlans(tripPlans);
  }
};