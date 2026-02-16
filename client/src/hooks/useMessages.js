// src/hooks/useMessages.js
import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

const useMessages = (role = "user") => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const endpoint =
          role === "professional"
            ? `/messages/pro/${user.id}`
            : `/messages/user/${user.id}`;
        const res = await authAxios.get(endpoint);
        setConversations(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [role, user?.id]);

  const sendMessage = async (recipientId, content) => {
    const res = await authAxios.post("/messages", {
      senderId: user.id,
      recipientId,
      content,
    });
    return res.data;
  };

  return { conversations, loading, error, sendMessage };
};

export default useMessages;
