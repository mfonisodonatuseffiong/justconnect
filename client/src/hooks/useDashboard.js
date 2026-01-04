// src/hooks/useDashboard.js
import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

const useDashboard = () => {
  const { user } = useAuthStore();

  const [dashboard, setDashboard] = useState({
    stats: {
      totalBookings: 0,
      pendingBookings: 0,
      completedBookings: 0,
    },
    recentBookings: [],
    weeklyRequests: [],
    bookingStatus: [],
    messages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await authAxios.get(`/dashboard/user/${user.id}`);

        if (!isMounted) return;

        if (res.data?.success) {
          const payload = res.data.data || {};

          setDashboard({
            stats: {
              totalBookings: payload.stats?.totalBookings || 0,
              pendingBookings: payload.stats?.pendingBookings || 0,
              completedBookings: payload.stats?.completedBookings || 0,
            },
            recentBookings: Array.isArray(payload.recentBookings)
              ? payload.recentBookings.map((b) => ({
                  id: b.id,
                  serviceName: b.service_name,
                  professionalName: b.professional_name,
                  professionalLocation: b.professional_location,
                  status: b.status,
                  date: b.date,
                }))
              : [],
            weeklyRequests: Array.isArray(payload.weeklyRequests)
              ? payload.weeklyRequests.map((r) => ({
                  day: r.day,
                  count: parseInt(r.count, 10),
                }))
              : [],
            bookingStatus: Array.isArray(payload.bookingStatus)
              ? payload.bookingStatus.map((s) => ({
                  status: s.status,
                  count: parseInt(s.count, 10),
                }))
              : [],
            messages: payload.messages || 0,
          });
        } else {
          setError(res.data?.message || "Failed to load dashboard");
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to fetch dashboard data"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return {
    dashboard,
    loading,
    error,
  };
};

export default useDashboard;
