// src/dashboards/User/BookProfessional.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authAxios from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Calendar, Clock, FileText, CheckCircle2 } from "lucide-react";

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
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Fetch professional name
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const res = await authAxios.get(`/professionals/${id}`);
        console.log("Professional API response:", res.data); // ← DEBUG: check what name comes back

        if (res.data?.success) {
          const name = res.data.data?.name || res.data.data?.username || "this professional";
          setProfessionalName(name);
        } else {
          setProfessionalName("this professional");
        }
      } catch (err) {
        console.error("Failed to load professional:", err);
        setProfessionalName("this professional");
      }
    };

    fetchProfessional();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.service_id || !form.date || !form.time) {
      setSuccessMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const res = await authAxios.post("/bookings", {
        professional_id: id,
        service_id: form.service_id,
        date: form.date,
        time: form.time,
        notes: form.notes || null,
      });

      console.log("Booking created response:", res.data); // ← DEBUG

      if (res.data?.success) {
        setSuccessMessage(`Booking with ${professionalName} confirmed successfully! 🎉`);

        setTimeout(() => {
          navigate("/booking-confirmation", {
            state: { booking: res.data.data },
          });
        }, 1800);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create booking";

      console.error("Booking error:", err.response?.data); // ← DEBUG

      if (
        message.toLowerCase().includes("pending") ||
        message.toLowerCase().includes("already have") ||
        message.toLowerCase().includes("active booking")
      ) {
        setShowDuplicateCard(true);
      } else {
        setSuccessMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = () => {
    navigate("/user-dashboard/bookings");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-rose-50/40 p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Duplicate Booking Warning */}
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
                  You already have a pending booking
                </h2>

                <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                  There is already a <strong>pending</strong> booking with{" "}
                  <span className="font-bold text-orange-600">
                    {professionalName}
                  </span>
                  . Please wait for confirmation or cancel the existing one before booking again.
                </p>

                <button
                  onClick={handleAcknowledge}
                  className="px-12 py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-bold text-xl shadow-2xl hover:shadow-orange-300/50 transition-all duration-300"
                >
                  OK, Show My Bookings
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Booking Form */}
          <AnimatePresence>
            {!showDuplicateCard && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 lg:p-12"
              >
                <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-10 text-center">
                  Book {professionalName}
                </h1>

                {/* Success / Error Message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-8 p-5 rounded-2xl text-center font-medium shadow-md ${
                      successMessage.includes("success")
                        ? "bg-green-100 border border-green-300 text-green-800"
                        : "bg-rose-100 border border-rose-300 text-rose-800"
                    }`}
                  >
                    {successMessage}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Service */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <FileText size={22} className="text-orange-600" />
                    </div>
                    <input
                      type="text"
                      name="service_id"
                      placeholder="Service (e.g., Plumbing Repair)"
                      value={form.service_id}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100/30 transition-all text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  {/* Date */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Calendar size={22} className="text-orange-600" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      disabled={loading}
                      className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100/30 transition-all text-slate-800"
                    />
                  </div>

                  {/* Time */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Clock size={22} className="text-orange-600" />
                    </div>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100/30 transition-all text-slate-800"
                    />
                  </div>

                  {/* Notes */}
                  <div className="relative">
                    <div className="absolute top-5 left-5 pointer-events-none">
                      <FileText size={22} className="text-orange-600" />
                    </div>
                    <textarea
                      name="notes"
                      placeholder="Additional notes (optional)"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      disabled={loading}
                      className="w-full pl-14 pr-5 py-5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100/30 transition-all text-slate-800 placeholder-slate-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 rounded-2xl font-bold text-xl text-white bg-gradient-to-r from-orange-600 to-rose-600 shadow-2xl hover:shadow-orange-300/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? "Creating Booking..." : "Confirm Booking"}
                  </motion.button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-8">
                  By confirming, you agree to our fair usage & cancellation policy.
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