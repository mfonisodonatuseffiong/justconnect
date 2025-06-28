import React, { useContext, useEffect, useState } from "react";
import "./Profession.css";
import "./Dashboard.css";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const ProfessionalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings/professional", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, [user]);

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Update local state to reflect change
      setBookings(prev =>
        prev.map(booking =>
          booking.id === id ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status", error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}!</h2>
      {bookings.length > 0 ? (
        <div className="grid-container">
          {bookings.map((request) => (
            <div className="grid-item" key={request.id}>
              <h3>Booking Request</h3>
              <p><strong>User:</strong> {request.user}</p>
              <p><strong>Contact:</strong> {request.contact}</p>
              <p><strong>Address:</strong> {request.address}</p>
              <p><strong>Job Details:</strong> {request.jobDetails}</p>
              <p><strong>Status:</strong> {request.status || "Pending"}</p>
              <p><strong>Date:</strong> {request.date || "Not provided"}</p>
              <p><strong>Time:</strong> {request.time || "Not provided"}</p>
              <div className="action-buttons">
                <button
                  className="btn request"
                  onClick={() => updateBookingStatus(request.id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  className="btn decline"
                  onClick={() => updateBookingStatus(request.id, "Declined")}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No booking requests available.</p>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
