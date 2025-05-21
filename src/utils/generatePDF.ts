// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Booking } from '../types';

export const generateTicket = async (booking: Booking, qrCode: string) => {
  const ticket = document.createElement('div');
  ticket.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1e40af; margin: 0;">Flight Ticket</h1>
        <p style="color: #64748b; margin: 10px 0;">Booking Reference: ${booking.pnr}</p>
      </div>

      <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h2 style="color: #1e40af; margin: 0;">${booking.flight.airline}</h2>
            <p style="color: #64748b; margin: 5px 0;">Flight ${booking.flight.flightNumber}</p>
          </div>
          <div>
            <img src="${qrCode}" alt="QR Code" style="width: 100px; height: 100px;"/>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <p style="color: #64748b; margin: 0;">From</p>
            <h3 style="color: #1e3a8a; margin: 5px 0;">${booking.flight.origin}</h3>
            <p style="color: #64748b; margin: 0;">
              ${new Date(booking.flight.scheduledDeparture).toLocaleString()}
            </p>
          </div>
          <div style="text-align: right;">
            <p style="color: #64748b; margin: 0;">To</p>
            <h3 style="color: #1e3a8a; margin: 5px 0;">${booking.flight.destination}</h3>
            <p style="color: #64748b; margin: 0;">
              ${new Date(booking.flight.scheduledArrival).toLocaleString()}
            </p>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <h3 style="color: #1e3a8a; margin: 0;">Passenger Information</h3>
          <p style="color: #64748b; margin: 5px 0;">Name: ${booking.fullName}</p>
          <p style="color: #64748b; margin: 5px 0;">Class: ${booking.seatClass}</p>
          <p style="color: #64748b; margin: 5px 0;">Seat Numbers: ${booking.seatNumbers.join(', ')}</p>
          <p style="color: #64748b; margin: 5px 0;">Passengers: ${booking.passengers}</p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="color: #1e3a8a; margin: 0;">Flight Details</h3>
            <p style="color: #1e3a8a; font-size: 24px; font-weight: bold; margin: 0;">$${booking.price}</p>
          </div>
          <p style="color: #64748b; margin: 5px 0;">Terminal: ${booking.flight.terminal}</p>
          <p style="color: #64748b; margin: 5px 0;">Gate: ${booking.flight.gate}</p>
        </div>
      </div>

      <div style="text-align: center; color: #64748b; font-size: 12px;">
        <p>This is a system-generated ticket. Valid ID proof is mandatory during check-in.</p>
      </div>
    </div>
  `;

  const opt = {
    margin: 1,
    filename: `flight-ticket-${booking.pnr}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(ticket).save();
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
};