import useBookings from "../../hooks/useBookings";
import { CalendarCheck, FileText, XCircle, User, Clock, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS = {
  pending: "#f97316",     // orange-500
  completed: "#fb7185",   // rose-400
  canceled: "#ef4444",    // red-500
  unknown: "#9ca3af",     // gray-400
};

const STATUS_ICONS = {
  pending: FileText,
  completed: CalendarCheck,
  canceled: XCircle,
  unknown: FileText,
};

const BookingsPage = () => {
  const { bookings, loading, error } = useBookings("user");

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
      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Briefcase size={56} className="text-orange-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-700">No bookings yet</p>
          <p className="text-slate-500 mt-3 text-lg">
            Start by browsing professionals and booking your first service!
          </p>
        </motion.div>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-8">
          {bookings.map((b, index) => {
            const color = STATUS_COLORS[b.status] || STATUS_COLORS.unknown;
            const StatusIcon = STATUS_ICONS[b.status] || STATUS_ICONS.unknown;

            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="
                  bg-white
                  border-2 border-orange-200
                  rounded-3xl
                  p-8
                  shadow-xl
                  hover:shadow-2xl
                  transition-all duration-300
                "
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left: Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {b.service_title || b.service_id || "Service Booking"}
                      </h3>
                      <p className="text-orange-600 font-medium mt-1">
                        Booking ID: #{b._id?.slice(-6).toUpperCase()}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-orange-500" />
                        <div>
                          <p className="text-sm text-slate-500">Professional</p>
                          <p className="font-semibold">{b.professional_name || b.professional_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CalendarCheck size={20} className="text-orange-500" />
                        <div>
                          <p className="text-sm text-slate-500">Date & Time</p>
                          <p className="font-semibold">
                            {new Date(b.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            at {b.time}
                          </p>
                        </div>
                      </div>

                      {b.address && (
                        <div className="flex items-center gap-3 sm:col-span-2">
                          <MapPin size={20} className="text-orange-500" />
                          <div>
                            <p className="text-sm text-slate-500">Service Address</p>
                            <p className="font-semibold">{b.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status Badge */}
                  <div className="flex flex-col items-center">
                    <div
                      className="
                        px-8 py-4
                        rounded-2xl
                        shadow-lg
                        flex items-center gap-3
                        font-bold text-lg
                        text-white
                      "
                      style={{
                        background: `linear-gradient(135deg, ${color}dd, ${color})`,
                        boxShadow: `0 10px 30px ${color}40`,
                      }}
                    >
                      <StatusIcon size={28} />
                      <span className="capitalize">{b.status}</span>
                    </div>

                    {b.notes && (
                      <p className="mt-4 text-sm text-slate-600 italic text-center max-w-xs">
                        "{b.notes}"
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;