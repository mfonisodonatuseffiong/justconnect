// src/dashboards/User/SettingsPage.jsx
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import authAxios from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, MapPin, Phone, CheckCircle, XCircle } from "lucide-react";

const SettingsPage = () => {
  const { user, setUser } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.location || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authAxios.put(`/users/${user.id}`, form);

      // ✅ Always merge with existing user to persist full object
      const updatedUser = res.data?.user
        ? { ...user, ...res.data.user }
        : { ...user, ...form };

      setUser(updatedUser); // ✅ persists to localStorage

      setFeedback({ type: "success", message: "Settings updated successfully!" });
      setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to update settings. Please try again." });
      setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-rose-50 p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/90 backdrop-blur-lg border-2 border-orange-200 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-10 text-white">
            <h1 className="text-4xl lg:text-5xl font-extrabold">Account Settings</h1>
            <p className="mt-4 text-xl opacity-90">
              Update your personal information and preferences
            </p>
          </div>

          <div className="p-10 lg:p-16 relative">
            {/* Feedback Card */}
            <AnimatePresence>
              {feedback.message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
                >
                  <div
                    className={`px-10 py-5 rounded-3xl shadow-2xl flex items-center gap-5 text-white font-bold text-2xl ${
                      feedback.type === "success" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {feedback.type === "success" ? <CheckCircle size={48} /> : <XCircle size={48} />}
                    {feedback.message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <User size={28} className="text-orange-500" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={20} className="text-orange-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-800"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={20} className="text-orange-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-800"
                    />
                  </div>

                  {/* Location */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin size={20} className="text-orange-500" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Location (e.g., Lagos, Nigeria)"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-800"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={20} className="text-orange-500" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="
                    inline-flex items-center gap-3
                    px-12 py-5 rounded-2xl
                    bg-gradient-to-r from-orange-500 to-rose-500
                    text-white font-bold text-xl
                    shadow-2xl hover:shadow-orange-300/50
                    disabled:opacity-70 disabled:cursor-not-allowed
                    transition-all duration-300
                  "
                >
                  {loading ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
