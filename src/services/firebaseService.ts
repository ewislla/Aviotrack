import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

// Flight Services
export const getAllFlights = async () => {
  try {
    const flightsCollection = collection(db, 'flights');
    const flightSnapshot = await getDocs(flightsCollection);
    return flightSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};

export const addFlight = async (flightData: any) => {
  try {
    const flightsCollection = collection(db, 'flights');
    const docRef = await addDoc(flightsCollection, {
      ...flightData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding flight:', error);
    throw error;
  }
};

export const updateFlight = async (flightId: string, updates: any) => {
  try {
    const flightDoc = doc(db, 'flights', flightId);
    await updateDoc(flightDoc, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating flight:', error);
    throw error;
  }
};

export const deleteFlight = async (flightId: string) => {
  try {
    const flightDoc = doc(db, 'flights', flightId);
    await deleteDoc(flightDoc);
  } catch (error) {
    console.error('Error deleting flight:', error);
    throw error;
  }
};

// Booking Services
export const getAllBookings = async () => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const bookingSnapshot = await getDocs(query(bookingsCollection, orderBy('timestamp', 'desc')));
    return bookingSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const addBooking = async (bookingData: any) => {
  try {
    const bookingsCollection = collection(db, 'bookings');
    const docRef = await addDoc(bookingsCollection, {
      ...bookingData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
};

// Airport Services
export const getAllAirports = async () => {
  try {
    const airportsCollection = collection(db, 'airports');
    const airportSnapshot = await getDocs(airportsCollection);
    return airportSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching airports:', error);
    throw error;
  }
};

export const addAirport = async (airportData: any) => {
  try {
    const airportsCollection = collection(db, 'airports');
    const docRef = await addDoc(airportsCollection, airportData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding airport:', error);
    throw error;
  }
};

export const updateAirport = async (airportId: string, updates: any) => {
  try {
    const airportDoc = doc(db, 'airports', airportId);
    await updateDoc(airportDoc, updates);
  } catch (error) {
    console.error('Error updating airport:', error);
    throw error;
  }
};

export const deleteAirport = async (airportId: string) => {
  try {
    const airportDoc = doc(db, 'airports', airportId);
    await deleteDoc(airportDoc);
  } catch (error) {
    console.error('Error deleting airport:', error);
    throw error;
  }
};

// Flight Plan Request Services
export const getAllFlightPlanRequests = async () => {
  try {
    const requestsCollection = collection(db, 'flightPlanRequests');
    const requestSnapshot = await getDocs(query(requestsCollection, orderBy('timestamp', 'desc')));
    return requestSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching flight plan requests:', error);
    throw error;
  }
};

export const addFlightPlanRequest = async (requestData: any) => {
  try {
    const requestsCollection = collection(db, 'flightPlanRequests');
    const docRef = await addDoc(requestsCollection, {
      ...requestData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding flight plan request:', error);
    throw error;
  }
};

export const updateFlightPlanRequest = async (requestId: string, updates: any) => {
  try {
    const requestDoc = doc(db, 'flightPlanRequests', requestId);
    await updateDoc(requestDoc, updates);
  } catch (error) {
    console.error('Error updating flight plan request:', error);
    throw error;
  }
};