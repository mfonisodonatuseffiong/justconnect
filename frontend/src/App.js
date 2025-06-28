import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Introduction from "./components/Introduction";
import Features from "./components/Features";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Statistics from "./components/Statistics";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

import Plumbers from "./components/Plumbers";
import ProfessionalDashboard from "./components/ProfessionalDashboard";
import UserDashboard from "./components/UserDashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfessionalLogin from "./components/ProfessionalLogin";

function RedirectAuthenticatedUser() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "professional") {
      navigate("/professional-dashboard");
    } else if (role === "user") {
      navigate("/user-dashboard");
    }
  }, [navigate]);

  return null;
}

function App() {
  const [bookingRequests, setBookingRequests] = useState([]);

  // Handles new booking requests from the Plumbers component
  const handleBookingRequest = (bookingDetails) => {
    setBookingRequests((prevRequests) => [
      ...prevRequests,
      { ...bookingDetails, status: "Pending", notification: "" },
    ]);
  };

  // Handles status updates in the ProfessionalDashboard
  const updateBookingStatus = (id, status) => {
    setBookingRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              notification:
                status === "Accepted"
                  ? "Your booking request has been accepted by the professional."
                  : "Unfortunately, the professional is not available at the moment. Your booking request has been declined.",
            }
          : request
      )
    );
  };

  return (
    <AuthProvider>
      <Router>
        <RedirectAuthenticatedUser />
        <div className="App">
          <Navbar />
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Introduction />
                  <Features />
                  <About />
                  <Testimonials />
                  <Statistics />
                  <FAQ />
                  <Contact />
                  <Footer />
                  <BackToTop />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/professional-login" element={<ProfessionalLogin />} />
            <Route path="/plumbers" element={<Plumbers onBookingRequest={handleBookingRequest} />} />
            <Route
              path="/professional-dashboard"
              element={
                <PrivateRoute>
                  <ProfessionalDashboard
                    bookingRequests={bookingRequests}
                    updateBookingStatus={updateBookingStatus}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard bookingRequests={bookingRequests} />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
