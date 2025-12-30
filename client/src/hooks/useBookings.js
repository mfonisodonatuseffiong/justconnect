// src/hooks/useBookings.js
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
    let isMounted = true;

    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // ✅ CORRECT ENDPOINTS — no extra /api/v1 (authAxios already has it)
        const endpoint = role === "professional"
          ? `/bookings/pro/${user.id}`
          : `/bookings/user/${user.id}`;

        const response = await authAxios.get(endpoint);

        if (!isMounted) return;

        if (response.data?.success) {
          const enrichedBookings = (response.data.data || []).map((b) => ({
            id: b.id || b._id,
            service_name: b.service_name || b.service_title || `Service #${b.service_id}`,
            professional_name: b.professional_name || `Professional #${b.professional_id}`,
            professional_location: b.professional_location || "Location not specified",
            date: b.date,
            time: b.time,
            status: b.status || "pending",
            notes: b.notes || "",
            address: b.address,
          }));

          setBookings(enrichedBookings);
          setTotalBookings(response.data.total || enrichedBookings.length);
        } else {
          setError(response.data?.message || "No bookings found");
          setBookings([]);
          setTotalBookings(0);
        }
      } catch (err) {
        if (!isMounted) return;

        const msg = err.response?.data?.message || err.message || "Network error";
        setError(msg);
        console.error("Bookings fetch error:", err);
        setBookings([]);
        setTotalBookings(0);
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