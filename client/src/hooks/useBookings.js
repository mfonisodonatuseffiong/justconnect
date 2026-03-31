import { useEffect, useState, useCallback } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

/**
 * Custom hook to fetch bookings for a user or professional
 * @param {"user" | "professional"} role - Role of the logged-in user
 * @returns { bookings, totalBookings, loading, error, refresh }
 */
const useBookings = (role = "user") => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ Correct endpoint based on role
      const endpoint =
        role === "professional"
          ? `/bookings/professional/${user.id}`
          : `/bookings/user/${user.id}`;

      const response = await authAxios.get(endpoint);

      if (response.data?.success) {
        // ✅ Preserve full backend payload
        const enrichedBookings = (response.data.data || []).map((b) => ({
          id: b.id || b._id,
          service_name:
            b.service_name || b.service_title || `Service #${b.service_id}`,
          client_name: b.client_name || `User #${b.user_id}`,
          client_email: b.client_email || null,
          client_phone: b.client_phone || null,
          client_location: b.client_location || null,
          client_address: b.client_address || null,
          client_sex: b.client_sex || null,
          professional_name:
            b.professional_name || `Professional #${b.professional_id}`,
          professional_location: b.professional_location || null,
          date: b.date,
          time: b.time,
          status: b.status || "pending",
          notes: b.notes || "",
        }));

        setBookings(enrichedBookings);
        setTotalBookings(response.data.total || enrichedBookings.length);
      } else {
        setError(response.data?.message || "No bookings found");
        setBookings([]);
        setTotalBookings(0);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Network error";
      setError(msg);
      console.error("Bookings fetch error:", err);
      setBookings([]);
      setTotalBookings(0);
    } finally {
      setLoading(false);
    }
  }, [role, user?.id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ✅ Expose refresh function
  return { bookings, totalBookings, loading, error, refresh: fetchBookings };
};

export default useBookings;
