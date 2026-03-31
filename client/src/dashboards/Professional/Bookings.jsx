import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  FileText,
  XCircle,
  User,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Home,
  Venus,
} from "lucide-react";

import useBookings from "../../hooks/useBookings";
import authAxios from "../../utils/authAxios";
import toast from "react-hot-toast";

/* ---------------- Status Config ---------------- */
const STATUS_COLORS = {
  pending: "#f97316",
  accepted: "#3b82f6",
  completed: "#22c55e",
  declined: "#ef4444",
  rescheduled: "#a855f7",
  unknown: "#9ca3af",
};

const STATUS_ICONS = {
  pending: FileText,
  accepted: CalendarCheck,
  completed: CheckCircle,
  declined: XCircle,
  rescheduled: Clock,
  unknown: FileText,
};

const BookingsPro = () => {
  const { bookings, loading, error, refetch } = useBookings("professional");
  const [updating, setUpdating] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdating(true);
      const res = await authAxios.put(`/bookings/${id}/status`, { status });
      if (res.data?.success) {
        toast.success(`Booking ${status}`);
        refetch();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-8 border-orange-200 border-t-orange-500"
        />
      </div>
    );
  }

  if (error) return <p className="text-center text-rose-600 py-10">{error}</p>;

  // Filter out completed/cancelled from active list
  const activeBookings = bookings.filter(
    (b) => b.status !== "completed" && b.status !== "declined"
  );

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-500">
          Client Bookings
        </h1>
        <p className="mt-4 text-lg text-slate-600">Manage your service appointments</p>
      </motion.div>

      {/* Empty State */}
      {activeBookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-slate-600">No active bookings.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-8">
          <AnimatePresence>
            {activeBookings.map((b, index) => {
              const color = STATUS_COLORS[b.status] || STATUS_COLORS.unknown;
              const StatusIcon = STATUS_ICONS[b.status] || STATUS_ICONS.unknown;
              const shortId = String(b.id || "UNKNOWN").slice(-6).toUpperCase();

              return (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left Section */}
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        {b.client_profile_picture ? (
                          <img
                            src={b.client_profile_picture}
                            alt={b.client_name}
                            className="w-16 h-16 rounded-full border-2 border-orange-300 object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {b.client_name ? b.client_name.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800">{b.service_name}</h3>
                          <p className="text-orange-600 font-medium mt-1">Booking ID: #{shortId}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-slate-700">
                        <InfoRow icon={<User size={20} />} label="Client" value={b.client_name || `User #${b.user_id}`} />
                        <InfoRow icon={<Mail size={20} />} label="Email" value={b.client_email || "Not provided"} />
                        <InfoRow icon={<Phone size={20} />} label="Phone" value={b.client_phone || "Not provided"} />
                        <InfoRow icon={<MapPin size={20} />} label="Location" value={b.client_location || "Not provided"} />
                        <InfoRow icon={<Home size={20} />} label="Address" value={b.client_address || "Not provided"} />
                        <InfoRow icon={<Venus size={20} />} label="Sex" value={b.client_sex || "Not provided"} />
                        <InfoRow
                          icon={<CalendarCheck size={20} />}
                          label="Date & Time"
                          value={`${b.date ? new Date(b.date).toLocaleDateString() : "Not set"} at ${b.time || "Not set"}`}
                        />
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-lg text-white capitalize"
                        style={{
                          background: `linear-gradient(135deg, ${color}dd, ${color})`,
                          boxShadow: `0 10px 30px ${color}40`,
                        }}
                      >
                        <StatusIcon size={26} />
                        {b.status}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {b.status === "pending" && (
                          <>
                            <button
                              disabled={updating}
                              onClick={() => handleUpdateStatus(b.id, "accepted")}
                              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              Accept
                            </button>
                            <button
                              disabled={updating}
                              onClick={() => handleUpdateStatus(b.id, "declined")}
                              className="px-5 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {b.status === "accepted" && (
                          <button
                            disabled={updating}
                            onClick={() => handleUpdateStatus(b.id, "completed")}
                            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                          >
                            Mark Completed
                          </button>
                        )}
                        {b.status === "rescheduled" && (
                          <button
                            disabled={updating}
                            onClick={() => handleUpdateStatus(b.id, "pending")}
                            className="px-5 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition"
                          >
                            Reset to Pending
                          </button>
                        )}
                      </div>

                      {/* View Details Modal Trigger */}
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="mt-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

            {/* Modal */}
            {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-slate-500 hover:text-rose-600 transition"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Booking Details
            </h2>

            <div className="space-y-3 text-slate-700">
              <InfoRow icon={<User size={20} />} label="Client" value={selectedBooking.client_name} />
              <InfoRow icon={<Mail size={20} />} label="Email" value={selectedBooking.client_email} />
              <InfoRow icon={<Phone size={20} />} label="Phone" value={selectedBooking.client_phone} />
              <InfoRow icon={<MapPin size={20} />} label="Location" value={selectedBooking.client_location} />
              <InfoRow icon={<Home size={20} />} label="Address" value={selectedBooking.client_address} />
              <InfoRow icon={<Venus size={20} />} label="Sex" value={selectedBooking.client_sex} />
              <InfoRow
                icon={<CalendarCheck size={20} />}
                label="Date & Time"
                value={`${selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString() : "Not set"} at ${selectedBooking.time || "Not set"}`}
              />
              <InfoRow icon={<FileText size={20} />} label="Notes" value={selectedBooking.notes || "No notes"} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Info Row Component ---------------- */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-orange-500">{icon}</div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default BookingsPro;

