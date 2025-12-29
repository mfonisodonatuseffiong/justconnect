import { useEffect, useState } from "react";
import authAxios from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Loader, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  pending: "bg-orange-100 text-orange-700 border-orange-300",
  in_progress: "bg-amber-100 text-amber-700 border-amber-300",
  completed: "bg-rose-100 text-rose-700 border-rose-300",
  canceled: "bg-red-100 text-red-700 border-red-300",
};

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
      fetchBookings();
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-orange-500">
        <Loader className="animate-spin mr-2" />
        Loading bookings…
      </div>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen p-6">
      <div className="bg-white border border-orange-200 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-slate-600 text-center py-16">
            You have no bookings yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-orange-200 rounded-xl overflow-hidden">
              <thead className="bg-orange-100 text-orange-700">
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
                  <motion.tr
                    key={b.id}
                    whileHover={{ scale: 1.01 }}
                    className="border-t border-orange-200 hover:bg-orange-50 transition"
                  >
                    <td className="p-3 text-slate-800 font-medium">
                      {b.service_name || `Service #${b.service_id}`}
                    </td>

                    <td className="p-3 text-slate-600">
                      {b.professional_name || `Pro #${b.professional_id}`}
                    </td>

                    <td className="p-3 text-slate-600">{b.date}</td>
                    <td className="p-3 text-slate-600">{b.time}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                          STATUS_STYLES[b.status] ||
                          "bg-slate-100 text-slate-600 border-slate-300"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-3">
                      {b.status === "pending" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="
                            flex items-center gap-2
                            px-3 py-1
                            bg-red-500 text-white
                            rounded-lg
                            hover:bg-red-600
                            transition
                          "
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
