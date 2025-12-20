import { useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Booking Confirmed ✅</h1>
      <p>
        Your booking has been created successfully. You’ll receive notifications
        and messages shortly.
      </p>
      <button
        onClick={() => navigate("/user-dashboard/bookings")}
        className="mt-4 bg-accent px-4 py-2 rounded text-white"
      >
        View My Bookings
      </button>
    </div>
  );
};

export default BookingConfirmation;
