import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "./UserDashboard.css";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
});

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const servicesRef = useRef(null);

  const fetchBookings = useCallback(async () => {
    try {
      const token = user?.token;
      const response = await axios.get("http://localhost:5000/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📦 Raw bookings from API:", response.data);
      setBookings(response.data);

      response.data.forEach((booking) => {
        if (booking.roomid) {
          console.log("🟢 Joining room:", booking.roomid);
          socket.emit("joinRoom", booking.roomid);
        }
      });
    } catch (err) {
      console.error("❌ Failed to fetch bookings:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchBookings();
    }
  }, [fetchBookings, user?.token]);

  useEffect(() => {
    if (location.hash === "#services" && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    const handleMessage = ({ message, type }) => {
      console.log("📩 Notification:", type, message);
      setNotification({ message, type });
      fetchBookings();
      setTimeout(() => setNotification(null), 5000);
    };

    socket.on("declineMessage", (payload) =>
      handleMessage({ ...payload, type: "declined" })
    );
    socket.on("acceptedMessage", (payload) =>
      handleMessage({ ...payload, type: "accepted" })
    );

    return () => {
      socket.off("declineMessage");
      socket.off("acceptedMessage");
    };
  }, [fetchBookings]);

  // 🔍 Filter bookings for current logged-in user
  const userId = user?.id;
  const userName = user?.name?.toLowerCase();

  const userBookings = bookings.filter((booking) => {
    const matchById = booking.user_id === userId;
    const matchByName = (booking.user || booking.user_name || "")
      .toLowerCase()
      .includes(userName);
    return matchById || matchByName;
  });

  return (
    <div className="user-dashboard">
      <h2>Welcome, {user?.name}!</h2>
      <p>Here are your bookings:</p>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button className="close-btn" onClick={() => setNotification(null)}>
            ❌
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : userBookings.length > 0 ? (
        <div className="bookings-container">
          {userBookings.map((booking) => (
            <div className="booking-card" key={booking._id || booking.id}>
              <h3>{booking.jobDetails || "Service"}</h3>
              <p><strong>Professional:</strong> {booking.professional}</p>
              <p><strong>Contact:</strong> {booking.professionalContact}</p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>

              {booking.status === "Accepted" && booking.roomid && (
                <button
                  className="btn chat"
                  onClick={() =>
                    navigate(`/chat/${booking.roomid}?sender=${user.name}`)
                  }
                >
                  Go to Chat
                </button>
              )}
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
