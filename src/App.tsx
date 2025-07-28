import React, { useEffect } from "react";
import "./i18n";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import FlightStatus from "./pages/FlightStatus";
import FlightSchedule from "./pages/FlightSchedule";
import FlightTracker from "./pages/FlightTracker";
import Booking from "./pages/Booking";
import BookingDetails from "./pages/BookingDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import ContactUs from "./pages/ContactUs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookingList from "./pages/AdminBookingList";
import AdminNotifications from "./pages/AdminNotifications";
import AdminAirports from "./pages/AdminAirports";
import TravelGuide from "./pages/TravelGuide";
import VacationCounselor from "./pages/VacationCounselor";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        window.location.href = "/admin/login";
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/status" element={<FlightStatus />} />
              <Route path="/schedule" element={<FlightSchedule />} />
              <Route path="/tracker" element={<FlightTracker />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/book/:flightId" element={<BookingDetails />} />
              <Route
                path="/confirmation/:bookingId"
                element={<BookingConfirmation />}
              />
              <Route
                path="/booking-details/:flightId"
                element={<BookingDetails />}
              />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/travel-guide" element={<TravelGuide />} />
              <Route
                path="/vacation-counselor"
                element={<VacationCounselor />}
              />
              <Route
                path="/booking-details/:flightId"
                element={<BookingDetails />}
              />
              <Route
                path="/confirmation/:bookingId"
                element={<BookingConfirmation />}
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute>
                    <AdminBookingList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute>
                    <AdminNotifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/airports"
                element={
                  <ProtectedRoute>
                    <AdminAirports />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;