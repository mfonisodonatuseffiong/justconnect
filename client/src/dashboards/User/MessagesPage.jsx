import { useEffect, useState } from "react";
import authAxios from "../../utils/authAxios";
import { useAuthStore } from "../../store/authStore";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

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

  if (loading) {
    return (
      <p className="text-orange-500 text-center mt-24 animate-pulse">
        Loading messages…
      </p>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen p-6">
      <div className="bg-white border border-orange-200 rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center gap-2">
          <MessageCircle size={22} />
          Messages
        </h2>

        {messages.length === 0 ? (
          <p className="text-slate-600 text-center py-16">
            No messages yet
          </p>
        ) : (
          <ul className="space-y-4">
            {messages.map((m) => (
              <motion.li
                key={m._id}
                whileHover={{ scale: 1.01 }}
                className="
                  bg-white
                  border border-orange-200
                  rounded-xl
                  p-4
                  shadow-sm
                "
              >
                <p className="font-semibold text-slate-800">
                  From: {m.senderName}
                </p>

                <p className="text-slate-600 mt-1">
                  {m.content}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  {m.date}
                </p>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
