import React, {
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
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
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [chatRoom, setChatRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchBookings = useCallback(async () => {
    if (!user?.token) return;

    try {
      const response = await axios.get("http://localhost:5000/api/bookings/user", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = response?.data || [];
      setBookings(data);

      data.forEach((booking) => {
        if (booking.roomid && booking.status === "Accepted") {
          socket.emit("joinRoom", booking.roomid);
        }
      });
    } catch (err) {
      console.error("Failed to fetch bookings:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("chatAllowed", ({ roomId }) => {
      const matched = bookings.find((b) => b.roomid === roomId);
      if (matched) {
        setActiveChat(matched);
        setChatRoom(roomId);
        setMessages([]);
        socket.emit("joinRoom", roomId);
      }
    });

    socket.on("acceptedMessage", ({ message, roomId }) => {
      setNotification({ message, type: "accepted" });

      const acceptedBooking = bookings.find((b) => b.roomid === roomId);
      if (acceptedBooking) {
        setActiveChat(acceptedBooking);
        setChatRoom(roomId);
        setMessages([]);
        socket.emit("joinRoom", roomId);
      }

      setTimeout(() => setNotification(null), 5000);
    });

    socket.on("declineMessage", ({ message }) => {
      setNotification({ message, type: "declined" });
      setTimeout(() => setNotification(null), 5000);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatAllowed");
      socket.off("acceptedMessage");
      socket.off("declineMessage");
    };
  }, [bookings]);

  const handleCancelRequest = async (bookingId) => {
    if (!cancelReason.trim()) {
      setNotification({ message: "Please provide a reason before cancelling.", type: "error" });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        { reason: cancelReason },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setBookings((prev) => prev.filter((b) => b.id !== bookingId && b._id !== bookingId));
      setCancelModal(null);
      setCancelReason("");
    } catch (error) {
      console.error("Error cancelling booking:", error.message);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && chatRoom) {
      const msg = {
        roomId: chatRoom,
        sender: user.name,
        message,
      };
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  const handleOpenChat = (booking) => {
    setActiveChat(booking);
    setChatRoom(booking.roomid);
    setMessages([]);
    socket.emit("joinRoom", booking.roomid);
  };

  return (
    <div className="user-dashboard">
      <h2>Welcome, {user?.name}!</h2>

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
      ) : activeChat ? (
        <div className="chat-box">
          <h3>Chat with {activeChat.professional}</h3>
          <div className="messages">
            {messages.map((msg, i) => (
              <p key={i}>
                <strong>{msg.sender}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      ) : bookings.length > 0 ? (
        <div className="bookings-container">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id || booking.id}>
              <h3>{booking.jobDetails || "Service"}</h3>
              <p><strong>Professional:</strong> {booking.professional || "N/A"}</p>
              <p><strong>Contact:</strong> {booking.professionalContact || "N/A"}</p>
              <p><strong>Address:</strong> {booking.address || "N/A"}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Date:</strong> {booking.date || "N/A"}</p>
              <p><strong>Time:</strong> {booking.time || "N/A"}</p>

              <div className="booking-actions">
                {booking.status === "Accepted" && booking.roomid && (
                  <button className="btn chat" onClick={() => handleOpenChat(booking)}>
                    Start Chat
                  </button>
                )}
                <button className="btn cancel" onClick={() => setCancelModal(booking._id || booking.id)}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings available.</p>
      )}

      {cancelModal && (
        <div className="cancel-modal">
          <div className="modal-content">
            <h3>Cancel Booking</h3>
            <p>Please tell us why you’re cancelling this booking?</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Type your reason..."
            />
            <div className="modal-buttons">
              <button
                className="btn confirm"
                onClick={() => handleCancelRequest(cancelModal)}
                disabled={!cancelReason.trim()}
              >
                Confirm Cancel
              </button>
              <button className="btn close" onClick={() => setCancelModal(null)}>
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
