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

  if (loading) return <p className="text-gray-400">Loading messages...</p>;

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="bg-purple-950/60 border border-purple-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-accent mb-6">Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((m) => (
              <li
                key={m._id}
                className="p-4 bg-purple-950/40 border border-purple-800 rounded-xl shadow-md"
              >
                <p className="text-purple-300 font-semibold">
                  From: {m.senderName}
                </p>
                <p className="text-gray-300">{m.content}</p>
                <p className="text-gray-500 text-sm">{m.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
