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
  type: 'number' | 'route';
  flightNumber?: string;
  origin?: string;
  destination?: string;
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