// src/dashboards/User/BookingsPage.jsx
import { useState } from "react";
import useBookings from "../../hooks/useBookings";
import authAxios from "../../api";
import toast from "react-hot-toast";
import { CalendarCheck, FileText, XCircle, User, MapPin, Briefcase, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_COLORS = {
  pending: "#f97316",
  completed: "#fb7185",
  cancelled: "#ef4444",
  unknown: "#9ca3af",
};

const STATUS_ICONS = {
  pending: FileText,
  completed: CalendarCheck,
  cancelled: XCircle,
  unknown: FileText,
};

const BookingsPage = () => {
  const { bookings, loading, error, refetch } = useBookings("user");
  const [cancelModal, setCancelModal] = useState(null); // { id, service_name }

  const handleCancel = async () => {
    if (!cancelModal) return;

    try {
      const res = await authAxios.post(`/bookings/${cancelModal.id}/cancel`);

      toast.success(res.data.message);
      if (res.data.warning) {
        toast(res.data.warning, { icon: "⚠️", duration: 8000 });
      }

      // Immediately remove the cancelled booking from UI
      refetch(); // This will reload fresh data — cancelled booking will be gone

      setCancelModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-8 border-orange-200 border-t-orange-500"
        />
        <p className="mt-6 text-xl text-orange-600 font-medium">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <XCircle size={64} className="mx-auto text-red-400 mb-4" />
        <p className="text-xl text-red-600 font-semibold">{error}</p>
        <p className="text-slate-500 mt-2">Please try again later</p>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.status !== "cancelled");

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-500">
          Your Bookings
        </h1>
        <p className="mt-4 text-xl text-slate-600">Track and manage all your service appointments</p>
      </motion.div>

      {/* Bookings List */}
      {activeBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Briefcase size={56} className="text-orange-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-700">No active bookings</p>
          <p className="text-slate-500 mt-3 text-lg">
            Cancelled bookings are removed from this list.
          </p>
        </motion.div>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-8">
          <AnimatePresence>
            {activeBookings.map((b, index) => {
              const color = STATUS_COLORS[b.status] || STATUS_COLORS.unknown;
              const StatusIcon = STATUS_ICONS[b.status] || STATUS_ICONS.unknown;

              const shortId = b.id || b._id ? String(b.id || b._id).slice(-6).toUpperCase() : "UNKNOWN";

              return (
                <motion.div
                  key={b.id || b._id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {b.service_name || "Service Booking"}
                        </h3>
                        <p className="text-orange-600 font-medium mt-1">Booking ID: #{shortId}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                        <div className="flex items-center gap-3">
                          <User size={20} className="text-orange-500" />
                          <div>
                            <p className="text-sm text-slate-500">Professional</p>
                            <p className="font-semibold">{b.professional_name || "Not assigned"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <CalendarCheck size={20} className="text-orange-500" />
                          <div>
                            <p className="text-sm text-slate-500">Date & Time</p>
                            <p className="font-semibold">
                              {b.date ? new Date(b.date).toLocaleDateString() : "Not set"} at {b.time || "Not set"}
                            </p>
                          </div>
                        </div>

                        {b.address && (
                          <div className="flex items-center gap-3 sm:col-span-2">
                            <MapPin size={20} className="text-orange-500" />
                            <div>
                              <p className="text-sm text-slate-500">Address</p>
                              <p className="font-semibold">{b.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-lg text-white"
                        style={{
                          background: `linear-gradient(135deg, ${color}dd, ${color})`,
                          boxShadow: `0 10px 30px ${color}40`,
                        }}
                      >
                        <StatusIcon size={28} />
                        <span className="capitalize">{b.status || "unknown"}</span>
                      </div>

                      {b.status === "pending" && (
                        <button
                          onClick={() => setCancelModal({ id: b.id || b._id, service_name: b.service_name })}
                          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setCancelModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Cancel Booking?</h2>
                <button onClick={() => setCancelModal(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to cancel your booking for <strong>{cancelModal.service_name || "this service"}</strong>?
              </p>
              <p className="text-sm text-slate-500 mb-8">
                Repeated cancellations may temporarily restrict your ability to make new bookings.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsPage;