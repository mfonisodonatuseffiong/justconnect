import { useEffect, useState } from "react";
import authAxios from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Loader, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      if (!user?.id) return;
      const res = await authAxios.get(`/bookings/user/${user.id}`);
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  const handleCancel = async (id) => {
    try {
      await authAxios.delete(`/bookings/${id}`);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // refresh list
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <Loader className="animate-spin mr-2" /> Loading bookings...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">You have no bookings yet.</p>
      ) : (
        <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-accent">
            <tr>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Professional</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-3">{b.service_name || `Service #${b.service_id}`}</td>
                <td className="p-3">{b.professional_name || `Pro #${b.professional_id}`}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.time}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      b.status === "pending"
                        ? "bg-yellow-600 text-black"
                        : b.status === "in_progress"
                        ? "bg-blue-600 text-white"
                        : b.status === "completed"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-3">
                  {b.status === "pending" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;
