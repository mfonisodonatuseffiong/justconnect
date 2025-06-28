import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = user?.token;
        const response = await axios.get("http://localhost:5000/api/bookings/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const userBookings = bookings.filter((booking) => booking.user === user.name);

  return (
    <div className="user-dashboard">
      <h2>Welcome, {user.name}!</h2>
      <p>Here are your bookings:</p>
      {loading ? (
        <p>Loading...</p>
      ) : userBookings.length > 0 ? (
        <div className="bookings-container">
          {userBookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <h3>{booking.jobDetails} Service</h3>
              <p><strong>Professional:</strong> {booking.professional}</p>
              <p><strong>Contact:</strong> {booking.professionalContact}</p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p><strong>Status:</strong> <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings available.</p>
      )}
    </div>
  );
};

export default UserDashboard;
