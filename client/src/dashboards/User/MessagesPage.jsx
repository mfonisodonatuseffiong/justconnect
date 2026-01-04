import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import authAxios from "../../utils/authAxios";
import { useAuthStore } from "../../store/authStore";
import { MessageCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const MessagesPage = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatUnlockedBookings, setChatUnlockedBookings] = useState({});
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;
      try {
        const res = await authAxios.get(`/messages/user/${user.id}`);
        const fetchedMessages = res.data?.data || res.data?.messages || [];
        const sorted = fetchedMessages.sort(
          (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        setMessages(sorted);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user?.id]);

  // Socket.IO connection
  useEffect(() => {
    if (!user?.id) return;
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Messages page connected to Socket.IO");
      newSocket.emit("authenticate", user.id);
    });

    newSocket.on("new_message", (message) => {
      console.log("New message received:", message);
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id || m._id === message._id);
        if (exists) return prev;
        return [message, ...prev];
      });
    });

    newSocket.on("chat_unlocked", ({ bookingId }) => {
      setChatUnlockedBookings((prev) => ({ ...prev, [bookingId]: true }));
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user?.id]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedBookingId) return;

    const msg = {
      sender_id: user.id,
      receiver_id: null, // set based on context (professional id)
      content: newMessage,
      booking_id: selectedBookingId,
    };

    socket.emit("send_message", msg);
    setMessages((prev) => [msg, ...prev]);
    setNewMessage("");
  };

  // Format timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday
      ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-8 border-orange-200 border-t-orange-500"
        />
        <p className="mt-6 text-xl text-orange-600 font-medium">Loading your messages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 flex items-center justify-center gap-4">
          <MessageCircle size={48} className="text-orange-500" />
          Your Messages
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          Stay connected with professionals — updates appear in real-time
        </p>
      </motion.div>

      {/* Messages List */}
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-xl border border-orange-200"
          >
            <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle size={56} className="text-orange-400" />
            </div>
            <p className="text-2xl font-semibold text-slate-700">No messages yet</p>
            <p className="text-slate-500 mt-3 text-lg">
              Messages from professionals will appear here instantly after booking
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id || msg._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white border-2 border-orange-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {(msg.sender_name || msg.senderName || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">
                        {msg.sender_name || msg.senderName || "Professional"}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <Clock size={14} />
                        {formatDate(msg.createdAt || msg.date || msg.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pl-16">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {msg.content || msg.message}
                  </p>
                </div>

                {msg.booking_id && (
                  <div className="mt-4 pl-16">
                    <p className="text-sm text-orange-600 font-medium">
                      Related to Booking #{(msg.booking_id || "").slice(-6).toUpperCase()}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Composer */}
        {selectedBookingId && (
          chatUnlockedBookings[selectedBookingId] ? (
            <form onSubmit={handleSend} className="flex gap-3 mt-6">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-2 border-orange-200 rounded-xl px-4 py-2"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold"
              >
                Send
              </button>
            </form>
          ) : (
            <div className="p-4 bg-orange-100 text-orange-700 rounded-xl text-center mt-6">
              Chat will be available once the professional accepts your booking.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
