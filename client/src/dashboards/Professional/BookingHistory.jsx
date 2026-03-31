import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  FileText,
  XCircle,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";

import useBookings from "../../hooks/useBookings";

/* ---------------- Status Config ---------------- */
const STATUS_COLORS = {
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_ICONS = {
  completed: CheckCircle,
  cancelled: XCircle,
};

const BookingHistory = () => {
  const { bookings, loading, error } = useBookings("professional");
  const [filter] = useState(["completed", "cancelled"]);

  const historyBookings = bookings.filter((b) =>
    filter.includes(b.status)
  );

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

  if (error)
    return (
      <p className="text-center text-rose-600 py-10">
        {error}
      </p>
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
          Booking History
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Completed and cancelled appointments
        </p>
      </motion.div>

      {/* Empty State */}
      {historyBookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-slate-600">
            No past bookings yet.
          </p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-8">
          <AnimatePresence>
            {historyBookings.map((b, index) => {
              const color = STATUS_COLORS[b.status];
              const StatusIcon = STATUS_ICONS[b.status];
              const shortId = String(b.id || b._id || "UNKNOWN")
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
                    {/* Left Section */}
                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          {b.service_name}
                        </h3>
                        <p className="text-orange-600 font-medium mt-1">
                          Booking ID: #{shortId}
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-slate-700">
                        <InfoRow icon={<User size={20} />} label="Client" value={b.client_name || `User #${b.user_id}`} />
                        <InfoRow icon={<CalendarCheck size={20} />} label="Date & Time" value={`${b.date ? new Date(b.date).toLocaleDateString() : "Not set"} at ${b.time || "Not set"}`} />
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
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
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

export default BookingHistory;
