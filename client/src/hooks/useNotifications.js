// src/hooks/useNotifications.js
import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

export default function useNotifications() {
  const { user } = useAuthStore();
  const [counts, setCounts] = useState({ messages: 0, notifications: 0 });

  useEffect(() => {
    if (!user?.id) return;

    const fetchCounts = async () => {
      try {
        const res = await authAxios.get(`/notifications/user/${user.id}`);
        setCounts({
          messages: res.data?.messagesUnread || 0,
          notifications: res.data?.notificationsUnread || 0,
        });
      } catch (err) {
        console.error("Error fetching notification counts:", err);
      }
    };

    fetchCounts();
  }, [user?.id]);

  return counts;
}
