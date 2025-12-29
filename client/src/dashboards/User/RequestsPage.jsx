// src/dashboards/User/RequestsPage.jsx
import useBookings from "../../hooks/useBookings";
import { CalendarCheck, FileText, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS = {
  pending: "#f97316",     // orange
  completed: "#fb7185",   // rose
  canceled: "#ef4444",    // red
  unknown: "#9ca3af",     // gray
};

const RequestsPage = () => {
  const { bookings, loading, error } = useBookings("user");

  if (loading)
    return (
      <p className="text-orange-500 text-center mt-24 animate-pulse">
        Loading requests…
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 text-center mt-24">{error}</p>
    );

  return (
    <div className="bg-orange-50 min-h-[70vh] rounded-2xl p-6 shadow-md border border-orange-200">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        My Requests
      </h2>

      {bookings.length === 0 ? (
        <p className="text-slate-600 text-center py-16">
          No requests yet
        </p>
      ) : (
        <ul className="grid gap-4">
          {bookings.map((b) => {
            const color = STATUS_COLORS[b.status] || STATUS_COLORS.unknown;
            let StatusIcon;
            if (b.status === "completed") StatusIcon = CalendarCheck;
            else if (b.status === "pending") StatusIcon = FileText;
            else if (b.status === "canceled") StatusIcon = XCircle;
            else StatusIcon = FileText;

            return (
              <motion.li
                key={b._id}
                className="bg-white border border-orange-200 rounded-2xl p-4 flex items-center justify-between shadow hover:scale-[1.02] transition-transform"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    Service: {b.service_id}
                  </p>
                  <p className="text-slate-600">Date: {b.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon size={24} className="text-white" style={{ color }} />
                  <span className="font-semibold" style={{ color }}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RequestsPage;
