import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./ChatRoom.css";

const socket = io("http://localhost:5000");

const ChatRoom = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const sender = searchParams.get("sender");

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", roomId);
    }

    const handleReceiveMessage = ({ sender, message }) => {
      setChat((prev) => [...prev, { sender, message }]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    socket.emit("sendMessage", { roomId, sender, message });

    // Update local chat
    setChat((prev) => [...prev, { sender, message }]);

    // Show toast
    setToast("Message sent");
    setTimeout(() => setToast(null), 2000);

    setMessage("");
  };

  return (
    <div className="chat-room">
      <h2>Chat Room: {roomId}</h2>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.sender === sender ? "own" : "other"
            }`}
          >
            <span className="chat-sender">{msg.sender}:</span>{" "}
            <span className="chat-text">{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>

      {/* ✅ Toast notification */}
      {toast && <div className="chat-toast">{toast}</div>}
    </div>
  );
};

export default ChatRoom;
