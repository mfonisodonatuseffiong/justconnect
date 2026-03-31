import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authAxios from "../../api";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialBooking = location.state?.booking || null;

  const [booking, setBooking] = useState(initialBooking);
  const [loading, setLoading] = useState(!initialBooking);

  useEffect(() => {
    if (initialBooking) return;

    // If no booking in state, try to read id from query and fetch
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("id");
    if (!bookingId) {
      // delay redirect so UI can show something briefly
      const t = setTimeout(() => navigate("/user-dashboard/bookings"), 300);
      return () => clearTimeout(t);
    }

    const fetchBooking = async () => {
      setLoading(true);
      try {
        const res = await authAxios.get(`/bookings/${bookingId}`);
        if (res.data?.success) setBooking(res.data.data);
        else navigate("/user-dashboard/bookings");
      } catch (err) {
        console.error("fetch booking error", err);
        navigate("/user-dashboard/bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [initialBooking, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading booking...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">No booking found. Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold text-emerald-400 mb-4">Booking Confirmed 🎉</h1>
      <p className="text-lg text-slate-300 mb-6">
        Your booking with <span className="font-semibold">{booking.professional_name}</span> has been confirmed for{" "}
        <span className="font-semibold">{booking.date}</span> at{" "}
        <span className="font-semibold">{booking.time}</span>.
      </p>
      <button
        onClick={() => navigate("/user-dashboard/bookings")}
        className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
      >
        View All Bookings
      </button>
    </div>
  );
};

export default BookingConfirmation;
