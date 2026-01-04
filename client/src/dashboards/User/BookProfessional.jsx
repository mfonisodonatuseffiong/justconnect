// src/dashboards/User/BookProfessional.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authAxios from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Calendar, Clock, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

const BookProfessional = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    service_id: "",
    date: "",
    time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [showDuplicateCard, setShowDuplicateCard] = useState(false);
  const [professionalName, setProfessionalName] = useState("this professional");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Fetch professional name
  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await authAxios.get(`/professionals/${id}`);
        if (res.data.success) {
          setProfessionalName(res.data.data.name || "this professional");
        }
      } catch (err) {
        console.error("Failed to load professional name");
      }
    };
    fetchName();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.service_id || !form.date || !form.time) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await authAxios.post("/bookings", {
        professional_id: id,
        service_id: form.service_id,
        date: form.date,
        time: form.time,
        notes: form.notes || null,
      });

      if (res.data.success) {
        const newBooking = res.data.data;
        // ✅ Redirect only — no success toast
        navigate("/booking-confirmation", {
          state: { booking: newBooking },
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create booking";

      if (message.includes("pending booking") || message.includes("already have")) {
        setShowDuplicateCard(true);
      } else {
        // ✅ Toast only for errors
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = () => {
    navigate("/user-dashboard/bookings");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-rose-50 p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white/90 backdrop-blur-lg border-2 border-orange-200 rounded-3xl shadow-2xl overflow-hidden">
          {/* Duplicate Card */}
          <AnimatePresence>
            {showDuplicateCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-10 lg:p-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-32 h-32 mx-auto mb-8 bg-orange-100 rounded-full flex items-center justify-center shadow-xl"
                >
                  <AlertTriangle size={72} className="text-orange-600" />
                </motion.div>

                <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-6">
                  Pending Booking with {professionalName}
                </h2>

                <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                  You already have a pending booking with <strong>{professionalName}</strong>.
                  Please wait for confirmation or cancel the existing one before booking again.
                </p>

                <button
                  onClick={handleAcknowledge}
                  className="px-12 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xl shadow-2xl hover:shadow-orange-300/50 transition-all duration-300"
                >
                  OK, Take Me to My Bookings
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <AnimatePresence>
            {!showDuplicateCard && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 lg:p-16"
              >
                <h1 className="text-4xl font-extrabold text-slate-800 mb-8 text-center">
                  Book {professionalName}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText size={20} className="text-orange-500" />
                    </div>
                    <input
                      type="text"
                      name="service_id"
                      placeholder="Service (e.g., Plumbing Repair)"
                      value={form.service_id}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 
                                 transition-all text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  {/* Date */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar size={20} className="text-orange-500" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 
                                 transition-all text-slate-800"
                    />
                  </div>

                  {/* Time */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock size={20} className="text-orange-500" />
                    </div>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 
                                 transition-all text-slate-800"
                    />
                  </div>

                  {/* Notes */}
                  <div className="relative">
                    <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                      <FileText size={20} className="text-orange-500 mt-1" />
                    </div>
                    <textarea
                      name="notes"
                      placeholder="Additional notes (optional)"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      disabled={loading}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 
                                 transition-all text-slate-800 placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-2xl font-bold text-xl text-white 
                               bg-gradient-to-r from-orange-500 to-rose-500 shadow-2xl 
                               hover:shadow-orange-300/50 disabled:opacity-70 disabled:cursor-not-allowed 
                               transition-all duration-300"
                  >
                    {loading ? "Creating Booking..." : "Confirm Booking"}
                  </motion.button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-8">
                  By confirming, you agree to our fair cancellation policy.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default BookProfessional;
