// src/dashboards/User/BookingsPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  FileText,
  XCircle,
  User,
  MapPin,
  Briefcase,
  X,
} from "lucide-react";

import useBookings from "../../hooks/useBookings";
import authAxios from "../../api";

/* ---------------- Status Config ---------------- */
const STATUS_COLORS = {
  pending: "#f97316",
  completed: "#22c55e",
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
  const [confirmation, setConfirmation] = useState(null);

  /* ---------------- Cancel Booking ---------------- */
  const handleCancel = async () => {
    if (!cancelModal) return;

    try {
      const res = await authAxios.post(
        `/bookings/${cancelModal.id}/cancel`
      );

      setConfirmation(
        res.data?.message || "Booking cancelled successfully"
      );
      setCancelModal(null);
      refetch();
    } catch (err) {
      setConfirmation(
        err.response?.data?.message || "Failed to cancel booking"
      );
    }
  };

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-8 border-orange-200 border-t-orange-500"
        />
        <p className="mt-6 text-xl text-orange-600 font-medium">
          Loading your bookings…
        </p>
      </div>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <div className="text-center py-20">
        <XCircle size={64} className="mx-auto text-red-400 mb-4" />
        <p className="text-xl text-red-600 font-semibold">{error}</p>
        <p className="text-slate-500 mt-2">
          Please try again later
        </p>
      </div>
    );
  }

  const activeBookings = bookings.filter(
    (b) => b.status !== "cancelled"
  );

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-500">
          Bookings
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          Track and manage your service appointments
        </p>
      </motion.div>

      {/* Confirmation Banner */}
      {confirmation && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl bg-green-100 text-green-700 font-semibold text-center shadow">
          {confirmation}
        </div>
      )}

      {/* Empty State */}
      {activeBookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Briefcase size={56} className="text-orange-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-700">
            No active bookings
          </p>
          <p className="text-slate-500 mt-3 text-lg">
            Cancelled bookings are hidden from this list.
          </p>
        </motion.div>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-8">
          <AnimatePresence>
            {activeBookings.map((b, index) => {
              const color =
                STATUS_COLORS[b.status] ||
                STATUS_COLORS.unknown;
              const StatusIcon =
                STATUS_ICONS[b.status] ||
                STATUS_ICONS.unknown;

              const shortId = String(
                b.id || b._id || "UNKNOWN"
              )
                .slice(-6)
                .toUpperCase();

              return (
                <motion.div
                  key={b.id || b._id}
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left */}
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {b.service_name || "Service Booking"}
                        </h3>
                        <p className="text-orange-600 font-medium mt-1">
                          Booking ID: #{shortId}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                        <InfoRow
                          icon={<User size={20} />}
                          label="Professional"
                          value={b.professional_name || "Not assigned"}
                        />

                        <InfoRow
                          icon={<CalendarCheck size={20} />}
                          label="Date & Time"
                          value={`${
                            b.date
                              ? new Date(b.date).toLocaleDateString()
                              : "Not set"
                          } at ${b.time || "Not set"}`}
                        />

                        {b.address && (
                          <InfoRow
                            icon={<MapPin size={20} />}
                            label="Address"
                            value={b.address}
                            full
                          />
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-lg text-white capitalize"
                        style={{
                          background: `linear-gradient(135deg, ${color}dd, ${color})`,
                          boxShadow: `0 10px 30px ${color}40`,
                        }}
                      >
                        <StatusIcon size={28} />
                        {b.status || "unknown"}
                      </div>

                      {b.status === "pending" && (
                        <button
                          onClick={() =>
                            setCancelModal({
                              id: b.id || b._id,
                              service_name: b.service_name,
                            })
                          }
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

      {/* ---------------- Cancel Modal ---------------- */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  Cancel Booking
                </h3>
                <button
                  onClick={() => setCancelModal(null)}
                  className="text-slate-500 hover:text-slate-800"
                >
                  <X size={22} />
                </button>
              </div>

              <p className="text-slate-600 mb-6">
                Are you sure you want to cancel{" "}
                <span className="font-semibold text-slate-800">
                  {cancelModal.service_name}
                </span>
                ?
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setCancelModal(null)}
                  className="px-5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  No
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
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

/* ---------------- Small Component ---------------- */
const InfoRow = ({ icon, label, value, full }) => (
  <div
    className={`flex items-center gap-3 ${
      full ? "sm:col-span-2" : ""
    }`}
  >
    <div className="text-orange-500">{icon}</div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default BookingsPage;
