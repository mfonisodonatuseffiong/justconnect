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
  const [activeChat, setActiveChat] = useState(null);
  const [chatRoom, setChatRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/bookings/professional",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      // normalize status (lowercase check)
      const filtered = response.data.filter(
        (b) =>
          b.status?.toLowerCase() === "pending" ||
          b.status?.toLowerCase() === "accepted"
      );

      setBookings(filtered);

      filtered.forEach((b) => {
        if (b.roomid) socket.emit("joinRoom", b.roomid);
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [user.token]);

  useEffect(() => {
    if (user?.token) fetchBookings();

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("chatAllowed", (payload) => {
      const { roomId } = payload;
      const matched = bookings.find((b) => b.roomid === roomId);
      if (matched) {
        setActiveChat(matched);
        setChatRoom(roomId);
        setMessages([]);
        socket.emit("joinRoom", roomId);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatAllowed");
    };
  }, [fetchBookings, bookings, user]);

  const updateBookingStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/bookings/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const updatedBooking = res.data.booking;
      const { roomid, user_id } = updatedBooking;

      const notify =
        newStatus === "Accepted"
          ? `${user.name} accepted your request.`
          : `${user.name} declined your booking request.`;

      socket.emit(
        newStatus === "Accepted" ? "bookingAccepted" : "bookingDeclined",
        { user: user_id, roomId: roomid, message: notify }
      );

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      if (newStatus.toLowerCase() === "accepted") openChat(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const openChat = (booking) => {
    setActiveChat(booking);
    setChatRoom(booking.roomid);
    setMessages([]);
    socket.emit("joinRoom", booking.roomid);
  };

  const handleSendMessage = () => {
    if (message.trim() && chatRoom) {
      const msg = {
        roomId: chatRoom,
        sender: user.name,
        message: message,
      };
      socket.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}!</h2>

      {!activeChat ? (
        bookings.filter((b) => b.status?.toLowerCase() === "pending").length > 0 ? (
          <div className="grid-container">
            {bookings
              .filter((b) => b.status?.toLowerCase() === "pending")
              .map((request) => (
                <div className="grid-item" key={request.id}>
                  <h3>Booking Request</h3>
                  <p>
                    <strong>User:</strong> {request.user_name}
                  </p>
                  <p>
                    <strong>Contact:</strong> {request.contact}
                  </p>
                  <p>
                    <strong>Address:</strong> {request.address}
                  </p>
                  <p>
                    <strong>Job Details:</strong> {request.jobdetails}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {request.date
                      ? new Date(request.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Time:</strong> {request.time || "N/A"}
                  </p>

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
          <p>No pending booking requests.</p>
        )
      ) : (
        <div className="chat-box">
          <h3>Chat with {activeChat.user_name}</h3>
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
      )}
    </div>
  );
};

export default ProfessionalDashboard;
