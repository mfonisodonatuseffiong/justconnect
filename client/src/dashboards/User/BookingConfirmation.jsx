import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, Bell, ArrowRight } from "lucide-react";

const BookingConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-rose-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="
          bg-white
          border-2 border-orange-200
          rounded-3xl
          shadow-2xl
          p-10 lg:p-16
          text-center
          max-w-2xl
          mx-auto
        "
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center shadow-xl"
        >
          <CheckCircle size={80} className="text-white" />
        </motion.div>

        {/* Main Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl lg:text-5xl font-extrabold text-slate-800 mb-6"
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg mx-auto"
        >
          Your service request has been successfully submitted. 
          The professional has been notified and will reach out soon.
        </motion.p>

        {/* Real-time Updates Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-orange-50/70 border border-orange-200 rounded-2xl p-8 mb-10"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            You'll be notified in real-time
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shadow-md">
                <Bell size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Notifications</p>
                <p className="text-sm text-slate-600">
                  Updates on status changes (accepted, in progress, completed)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shadow-md">
                <MessageCircle size={24} className="text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Direct Messages</p>
                <p className="text-sm text-slate-600">
                  Chat with your professional directly in the app
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate("/user-dashboard/bookings")}
            className="
              inline-flex items-center justify-center gap-3
              px-10 py-4
              rounded-2xl
              bg-gradient-to-r from-orange-500 to-rose-500
              text-white font-bold text-lg
              shadow-xl hover:shadow-2xl
              hover:scale-105
              transition-all duration-300
            "
          >
            View My Bookings
            <ArrowRight size={22} />
          </button>

          <button
            onClick={() => navigate("/user-dashboard/messages")}
            className="
              inline-flex items-center justify-center gap-3
              px-10 py-4
              rounded-2xl
              bg-white border-4 border-orange-300
              text-orange-600 font-bold text-lg
              shadow-xl hover:bg-orange-500 hover:text-white
              transition-all duration-300
            "
          >
            Check Messages
            <MessageCircle size={22} />
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 text-sm text-slate-500"
        >
          Thank you for using JustConnect! We're here to make things easier.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;