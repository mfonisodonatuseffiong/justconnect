import React, { useContext, useEffect, useState, useCallback } from "react";
import "./Profession.css";
import "./Dashboard.css";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ProfessionalDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);

  // 🔁 Fetch pending bookings
  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bookings/professional",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const pendingBookings = response.data.filter(
        (b) => b.status === "Pending"
      );
      setBookings(pendingBookings);

      // Join each room for socket communication
      pendingBookings.forEach((booking) => {
        if (booking.roomid) {
          socket.emit("joinRoom", booking.roomid);
        }
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [user.token]);

  useEffect(() => {
    if (user?.token) {
      fetchBookings();
    }
  }, [fetchBookings, user]);

  // ✅ Accept or Decline handler
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/bookings/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const { user: bookingUser, roomid } = res.data;

      const message =
        newStatus === "Accepted"
          ? `${user.name} has accepted your request.`
          : `Sorry, ${user.name} has declined your booking request.`;

      // Emit to room based on action
      socket.emit(
        newStatus === "Accepted" ? "bookingAccepted" : "bookingDeclined",
        { user: bookingUser, roomId: roomid, message }
      );

      // Remove the handled booking from list
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleClose = (id) => {
    setHiddenIds((prev) => [...prev, id]);
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}!</h2>
      {bookings.length > 0 ? (
        <div className="grid-container">
          {bookings.map(
            (request) =>
              !hiddenIds.includes(request.id) && (
                <div className="grid-item" key={request.id}>
                  <h3>Booking Request</h3>
                  <p><strong>User:</strong> {request.user}</p>
                  <p><strong>Contact:</strong> {request.contact}</p>
                  <p><strong>Address:</strong> {request.address}</p>
                  <p><strong>Job Details:</strong> {request.jobDetails}</p>
                  <p><strong>Status:</strong> {request.status}</p>
                  <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {request.time}</p>

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
                    <button
                      className="btn close"
                      onClick={() => handleClose(request.id)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      ) : (
        <p>No pending booking requests.</p>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
