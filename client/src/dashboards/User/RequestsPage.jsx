// src/dashboards/User/RequestsPage.jsx
import useBookings from "../../hooks/useBookings";
import { CalendarCheck, FileText, XCircle, User, MapPin, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_CONFIG = {
  pending: { color: "#f97316", icon: FileText },         // orange
  completed: { color: "#fb7185", icon: CalendarCheck }, // rose
  canceled: { color: "#ef4444", icon: XCircle },         // red
  unknown: { color: "#9ca3af", icon: FileText },        // gray
};

const RequestsPage = () => {
  const { bookings, loading, error } = useBookings("user");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-8 border-orange-200 border-t-orange-500"
        />
        <p className="mt-6 text-xl text-orange-600 font-medium">Loading your requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <XCircle size={64} className="mx-auto text-red-400 mb-4" />
        <p className="text-xl text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800">
          My Requests
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          View and track all your service requests in one place
        </p>
      </motion.div>

      {/* Requests List */}
      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <FileText size={56} className="text-orange-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-700">No requests yet</p>
          <p className="text-slate-500 mt-3 text-lg">
            Your service requests will appear here once submitted
          </p>
        </motion.div>
      ) : (
        <div className="max-w-5xl mx-auto grid gap-8">
          {bookings.map((request, index) => {
            const status = request.status || "unknown";
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={request.id || request._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white border-2 border-orange-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  {/* Left: Main Details */}
                  <div className="space-y-6 flex-1">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {request.service_name || "Service Request"}
                      </h3>
                      <p className="text-orange-600 font-medium mt-1">
                        Request ID: #{(request.id || request._id)?.slice(-6).toUpperCase()}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-orange-500" />
                        <div>
                          <p className="text-sm text-slate-500">Professional</p>
                          <p className="font-semibold text-slate-800">
                            {request.professional_name || "Not assigned"}
                          </p>
                        </div>
                      </div>

                      {request.professional_location && request.professional_location !== "Unknown" && (
                        <div className="flex items-center gap-3">
                          <MapPin size={20} className="text-orange-500" />
                          <div>
                            <p className="text-sm text-slate-500">Location</p>
                            <p className="font-semibold text-slate-800">
                              {request.professional_location}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <CalendarCheck size={20} className="text-orange-500" />
                        <div>
                          <p className="text-sm text-slate-500">Requested Date</p>
                          <p className="font-semibold text-slate-800">
                            {request.date ? new Date(request.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }) : "Not set"}
                          </p>
                        </div>
                      </div>

                      {request.time && (
                        <div className="flex items-center gap-3">
                          <Clock size={20} className="text-orange-500" />
                          <div>
                            <p className="text-sm text-slate-500">Preferred Time</p>
                            <p className="font-semibold text-slate-800">{request.time}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {request.notes && (
                      <div className="flex items-start gap-3">
                        <MessageSquare size={20} className="text-orange-500 mt-1" />
                        <div>
                          <p className="text-sm text-slate-500">Your Notes</p>
                          <p className="italic text-slate-700">"{request.notes}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Status Badge */}
                  <div className="flex flex-col items-center">
                    <div
                      className="px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-lg text-white"
                      style={{
                        background: `linear-gradient(135deg, ${config.color}dd, ${config.color})`,
                        boxShadow: `0 10px 30px ${config.color}40`,
                      }}
                    >
                      <StatusIcon size={28} />
                      <span className="capitalize">{status.replace("_", " ")}</span>
                    </div>
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

export default RequestsPage;