import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

/**
 * Custom hook to fetch bookings for a user or professional
 * @param {"user" | "professional"} role - Role of the logged-in user
 * @returns { bookings, totalBookings, loading, error }
 */
const useBookings = (role = "user") => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // prevent state update on unmounted component

    const fetchBookings = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Determine API endpoint based on role
        let endpoint = "";
        if (role === "professional") {
          endpoint = `/bookings/pro/${user.id}`;
        } else {
          endpoint = `/bookings/user/${user.id}`;
        }

        const response = await authAxios.get(endpoint);

        if (isMounted) {
          if (response.data?.success) {
            // Enriched bookings data
            const enrichedBookings = (response.data.data || []).map((b) => ({
              id: b.id,
              service_name: b.service_name || `Service #${b.service_id}`,
              professional_name: b.professional_name || `Professional #${b.professional_id}`,
              professional_location: b.professional_location || "Unknown",
              date: b.date,
              time: b.time,
              status: b.status || "pending",
              notes: b.notes || "",
            }));

            setBookings(enrichedBookings);
            setTotalBookings(response.data.total || enrichedBookings.length);
          } else {
            setError(response.data?.message || "Failed to fetch bookings");
            setBookings([]);
            setTotalBookings(0);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Failed to fetch bookings");
          setBookings([]);
          setTotalBookings(0);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [role, user?.id]);

  return { bookings, totalBookings, loading, error };
};

export default useBookings;
