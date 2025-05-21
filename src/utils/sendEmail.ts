import emailjs from '@emailjs/browser';
import { Booking } from '../types';

export const sendConfirmationEmail = async (booking: Booking) => {
  try {
    const templateParams = {
      to_email: booking.email,
      to_name: booking.fullName,
      booking_id: booking.pnr,
      flight_number: booking.flightNumber,
      origin: booking.flight.origin,
      destination: booking.flight.destination,
      departure_time: new Date(booking.flight.scheduledDeparture).toLocaleString(),
      arrival_time: new Date(booking.flight.scheduledArrival).toLocaleString(),
      seat_class: booking.seatClass,
      passengers: booking.passengers,
      total_price: booking.price
    };

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};