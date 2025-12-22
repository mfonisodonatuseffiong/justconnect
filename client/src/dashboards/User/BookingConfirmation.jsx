import { useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">
        Booking Confirmed ✅
      </h1>
      <p className="text-gray-600 mb-6">
        Your booking has been created successfully. You’ll receive notifications
        and messages shortly.
      </p>
      <button
        onClick={() => navigate("/user-dashboard/bookings")}
        className="mt-2 bg-orange-500 hover:bg-purple-600 transition px-6 py-2 rounded-xl text-white font-semibold shadow-md"
      >
        View My Bookings
      </button>
    </div>
  );
};

export default BookingConfirmation;
