

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// This is a comprehensive list of major international airports worldwide
export const airports: Airport[] = [
  // North America
  { id: '1', code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', latitude: 33.6367, longitude: -84.4281 },
  { id: '2', code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9416, longitude: -118.4085 },
  { id: '3', code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States', latitude: 41.9742, longitude: -87.9073 },
  { id: '4', code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', latitude: 32.8968, longitude: -97.0380 },
  { id: '5', code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States', latitude: 39.8561, longitude: -104.6737 },
  { id: '6', code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781 },
  { id: '7',  code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', latitude: 37.7749, longitude: -122.4194 },
  { id: '8', code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', latitude: 43.6777, longitude: -79.6248 },
  { id: '9', code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', latitude: 49.1967, longitude: -123.1815 },
  { id: '10', code: 'MEX', name: 'Benito Juárez International Airport', city: 'Mexico City', country: 'Mexico', latitude: 19.4363, longitude: -99.0721 },

  // Europe
  { id: '11', code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543 },
  { id: '12', code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479 },
  { id: '13', code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622 },
  { id: '14', code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.3105, longitude: 4.7683 },
  { id: '15', code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.4983, longitude: -3.5676 },
  { id: '16', code: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy', latitude: 41.8045, longitude: 12.2508 },
  { id: '17', code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', latitude: 41.2619, longitude: 28.7419 },
  { id: '18', code: 'DME', name: 'Moscow Domodedovo Airport', city: 'Moscow', country: 'Russia', latitude: 55.4103, longitude: 37.9026 },
  { id: '19', code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', latitude: 55.6180, longitude: 12.6508 },
  { id: '20', code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', latitude: 47.4582, longitude: 8.5555 },

  // Asia
  { id: '21', code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', latitude: 40.0799, longitude: 116.6031 },
  { id: '22', code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', latitude: 35.5494, longitude: 139.7798 },
  { id: '23', code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.3644, longitude: 103.9915 },
  { id: '24', code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.4602, longitude: 126.4407 },
  { id: '25', code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', latitude: 13.6900, longitude: 100.7501 },
  { id: '26', code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', latitude: 28.5562, longitude: 77.1000 },
  { id: '27', code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2532, longitude: 55.3657 },
  { id: '28', code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', latitude: 25.2609, longitude: 51.6138 },
  { id: '29', code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', latitude: 2.7456, longitude: 101.7072 },
  { id: '30', code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia', latitude: -6.1275, longitude: 106.6537 },

  // South America
  { id: '31', code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', latitude: -23.4356, longitude: -46.4731 },
  { id: '32', code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', country: 'Argentina', latitude: -34.8222, longitude: -58.5358 },
  { id: '33', code: 'BOG', name: 'El Dorado International Airport', city: 'Bogotá', country: 'Colombia', latitude: 4.7016, longitude: -74.1469 },
  { id: '34', code: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', country: 'Chile', latitude: -33.3928, longitude: -70.7934 },
  { id: '35', code: 'LIM', name: 'Jorge Chávez International Airport', city: 'Lima', country: 'Peru', latitude: -12.0219, longitude: -77.1143 },

  // Africa
  { id: '36', code: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', latitude: -26.1367, longitude: 28.2411 },
  { id: '37', code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', latitude: 30.1219, longitude: 31.4056 },
  { id: '38', code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa', latitude: -33.9715, longitude: 18.6021 },
  { id: '39', code: 'ADD', name: 'Bole International Airport', city: 'Addis Ababa', country: 'Ethiopia', latitude: 8.9778, longitude: 38.7989 },
  { id: '40', code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', country: 'Kenya', latitude: -1.3192, longitude: 36.9278 },

  // Oceania
  { id: '41', code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', latitude: -33.9399, longitude: 151.1753 },
  { id: '42', code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', latitude: -37.6690, longitude: 144.8410 },
  { id: '43', code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', latitude: -27.3842, longitude: 153.1175 },
  { id: '44', code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand', latitude: -37.0082, longitude: 174.7850 },
  { id: '45', code: 'WLG', name: 'Wellington International Airport', city: 'Wellington', country: 'New Zealand', latitude: -41.3272, longitude: 174.8051 }
];

// Group airports by country for easier filtering
export const groupedAirports = airports.reduce((acc, airport) => {
  if (!acc[airport.country]) {
    acc[airport.country] = [];
  }
  acc[airport.country].push(airport);
  return acc;
}, {} as Record<string, Airport[]>);

// Get unique list of countries
export const countries = [...new Set(airports.map(airport => airport.country))].sort();