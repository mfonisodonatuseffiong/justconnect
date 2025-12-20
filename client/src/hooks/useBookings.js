import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore"; // to get user ID

const useBookings = (role = "user") => {
  const { user } = useAuthStore(); // get logged-in user
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        let endpoint = "";
        if (role === "professional") {
          endpoint = `/bookings/pro/${user?.id}`;
        } else if (role === "user") {
          endpoint = `/bookings/user/${user?.id}`;
        }

        const response = await authAxios.get(endpoint);

        if (isMounted) {
          if (response.data?.success) {
            setBookings(response.data.data || []);
            setTotalBookings(response.data.total || 0);
          } else {
            setError(response.data?.message || "Failed to fetch bookings");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch bookings");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (user?.id) fetchBookings(); // only fetch if user is loaded

    return () => {
      isMounted = false;
    };
  }, [role, user?.id]);

  return {
    bookings,
    totalBookings,
    loading,
    error,
  };
};

export default useBookings;
