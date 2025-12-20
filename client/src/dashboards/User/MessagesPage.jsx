// src/dashboards/User/MessagesPage.jsx
import { useEffect, useState } from "react";
import authAxios from "../../utils/authAxios";
import { useAuthStore } from "../../store/authStore";

const MessagesPage = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await authAxios.get(`/messages/user/${user?.id}`);
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchMessages();
  }, [user?.id]);

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="bg-black/70 rounded-xl p-6">
      <h2 className="text-xl font-bold text-accent mb-4">Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-400">No messages yet</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m._id} className="p-4 bg-gray-800 rounded-lg">
              <p className="text-white">From: {m.senderName}</p>
              <p className="text-gray-400">{m.content}</p>
              <p className="text-gray-400 text-sm">{m.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesPage;
