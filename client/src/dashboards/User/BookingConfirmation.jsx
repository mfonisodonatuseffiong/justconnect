import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    // If user navigates directly without state, send them back
    navigate("/user-dashboard/bookings");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold text-emerald-400 mb-4">
        Booking Confirmed 🎉
      </h1>
      <p className="text-lg text-slate-300 mb-6">
        Your booking with <span className="font-semibold">{booking.professional_name}</span> 
        has been confirmed for <span className="font-semibold">{booking.date}</span> at{" "}
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
