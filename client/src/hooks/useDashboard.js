// src/hooks/useDashboard.js
import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

const useDashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await authAxios.get(`/dashboard/user/${user?.id}`);
        if (isMounted) {
          if (res.data?.success) {
            setData(res.data);
          } else {
            setError(res.data?.message || "Failed to fetch dashboard data");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch dashboard data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (user?.id) fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return { data, loading, error };
};

export default useDashboard;
