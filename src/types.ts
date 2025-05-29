export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Destination {
  id: string;
  code: string;
  city: string;
  country: string;
  isActive: boolean;
}

export interface TripPlan {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  numberOfPassengers: number;
  status: 'planned' | 'booked' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Seat {
  id: string;
  number: string;
  class: 'Economy' | 'Business' | 'First Class';
  status: 'Available' | 'Booked';
  price: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  actualDeparture: string;
  scheduledArrival: string;
  actualArrival: string;
  terminal: string;
  gate: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Landed';
  aircraftType: string;
  economyPrice: number;
  businessPrice: number;
  firstClassPrice: number;
  seats: Seat[];
}

export interface Booking {
  id: string;
  pnr: string;
  fullName: string;
  email: string;
  flightNumber: string;
  passengers: number;
  timestamp: string;
  seatClass: 'Economy' | 'Business' | 'First Class';
  seatNumbers: string[];
  price: number;
  flight: Flight;
}

export interface SearchParams {
  type: 'route' | 'number';
  origin?: string;
  destination?: string;
  flightNumber?: string;
}

export interface NewFlight {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  terminal: string;
  gate: string;
  aircraftType: string;
  economyPrice: number;
  businessPrice: number;
  firstClassPrice: number;
}

export interface FlightPlanRequest {
  id: string;
  name: string;
  email: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  preferences: string[];
  additionalNotes: string;
  status: 'pending' | 'contacted' | 'completed';
  timestamp: string;
}

export interface Airport {
  id: string;
  name: string;
  city: string;
  country: string;
  code: string;
  latitude: number;
  longitude: number;
}

export interface SearchParams {
  type: 'route' | 'number';
  origin?: string;
  destination?: string;
  flightNumber?: string; // Add this missing property
}