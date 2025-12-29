import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authAxios from "../../api";
import DefaultAvatar from "../../assets/avatars/avatar-neutral.png";
import { useAuthStore } from "../../store/authStore";
import { Calendar, Clock, MapPin, Phone, Mail, MessageSquare, X } from "lucide-react";

const BrowseProfessionals = () => {
  const { user } = useAuthStore();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPro, setSelectedPro] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    time: "",
    notes: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceIdFromUrl = searchParams.get("service");

  // Prefill user info when opening booking modal
  useEffect(() => {
    if (selectedPro && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      }));
    }
  }, [selectedPro, user]);

  // Fetch categories/services
  const fetchCategories = async () => {
    try {
      const res = await authAxios.get("/services");
      const cats = Array.isArray(res.data) ? res.data : [];
      if (!cats.find((c) => c.name === "Electrician")) {
        cats.push({ id: "1", name: "Electrician" });
      }
      setCategories(cats);
      if (serviceIdFromUrl) setSelectedCategory(serviceIdFromUrl);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([{ id: "1", name: "Electrician" }]);
      if (serviceIdFromUrl) setSelectedCategory(serviceIdFromUrl);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch professionals
  useEffect(() => {
    const fetchPros = async () => {
      setLoading(true);
      setProfessionals([]);
      setServiceName("");

      try {
        const params = [];
        if (selectedCategory) params.push(`service=${selectedCategory}`);
        if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
        const url = params.length ? `/professionals?${params.join("&")}` : "/professionals";

        const res = await authAxios.get(url);
        let pros = Array.isArray(res.data) ? res.data : [];

        pros = pros.map((pro) => ({
          ...pro,
          service_name: pro.service_name || "Uncategorized",
          service_id: pro.service_id || pro.serviceId, // Ensure service_id is available
        }));

        if (selectedCategory) {
          pros = pros.filter(
            (pro) =>
              String(pro.service_id) === String(selectedCategory) ||
              String(pro.service_name).toLowerCase() ===
                categories.find((c) => c.id === selectedCategory)?.name?.toLowerCase()
          );
        }

        setProfessionals(pros);

        if (selectedCategory) {
          const cat = categories.find((c) => String(c.id) === String(selectedCategory));
          setServiceName(cat?.name || "Service");
        }
      } catch (err) {
        console.error("Failed to fetch professionals:", err);
        setProfessionals([]);
        setServiceName("");
      } finally {
        setLoading(false);
      }
    };

    fetchPros();
  }, [selectedCategory, searchTerm, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // FIXED: Booking submission to match backend exactly
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.date || !formData.time) {
      alert("Please fill in all required fields.");
      return;
    }

    // CRITICAL: Use exact field names backend expects
    const bookingData = {
      professional_id: selectedPro.id,           // ← underscore, not camelCase
      service_id: selectedPro.service_id,        // ← must exist on selectedPro
      date: formData.date,
      time: formData.time,
      notes: formData.notes || null,
      // Optional extra info (not used by backend but safe to send)
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
    };

    try {
      const response = await authAxios.post("/bookings", bookingData);

      alert("Booking confirmed successfully! 🎉");
      console.log("Booking created:", response.data);

      // Reset form and close modal
      setSelectedPro(null);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        date: "",
        time: "",
        notes: "",
      });

      navigate("/user-dashboard/bookings");
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      const message =
        err.response?.data?.message ||
        "Failed to book professional. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 space-y-10 text-slate-800">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-400">
          {selectedCategory && serviceName
            ? `Top ${serviceName}s Near You`
            : "Browse Trusted Professionals"}
        </h1>
        <p className="mt-2 text-slate-600">Find and book the best service providers instantly</p>
      </motion.section>

      {/* Filters */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by location or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-5 py-4 rounded-xl border border-orange-200 bg-white shadow-sm focus:ring-4 focus:ring-orange-300 focus:border-orange-400 focus:outline-none text-slate-700 placeholder-slate-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-5 py-4 rounded-xl border border-orange-200 bg-white shadow-sm focus:ring-4 focus:ring-orange-300 focus:border-orange-400 focus:outline-none text-slate-700"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Professionals Grid */}
      {loading ? (
        <p className="text-center text-slate-500 text-lg">Loading professionals...</p>
      ) : professionals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No professionals found for your search.</p>
          <p className="text-slate-400 mt-2">Try adjusting filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {professionals.map((pro) => (
            <motion.div
              key={pro.id}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white border border-orange-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="relative w-28 h-28 mx-auto mb-4">
                <img
                  src={pro.profile_pic || pro.photo || DefaultAvatar}
                  alt={pro.name}
                  className="w-full h-full rounded-full object-cover border-4 border-orange-100 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-400/20 to-transparent" />
              </div>

              <h3 className="text-lg font-bold text-slate-800">{pro.name || "Professional"}</h3>
              <p className="text-orange-600 font-medium mt-1">{pro.service_name}</p>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {pro.location && pro.location !== "Unknown" && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin size={16} className="text-orange-500" />
                    <span>{pro.location}</span>
                  </div>
                )}
                {pro.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <Phone size={16} className="text-orange-500" />
                    <span>{pro.phone}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPro(pro)}
                className="mt-6 w-full py-3 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                Book Now
                <Calendar size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPro(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-orange-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-orange-500 to-rose-400 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Book Appointment</h2>
                    <p className="mt-1 opacity-90">with {selectedPro.name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPro(null)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                {[
                  { name: "fullName", icon: <Mail />, placeholder: "Full Name *", required: true },
                  { name: "phone", icon: <Phone />, placeholder: "Phone Number *", required: true },
                  { name: "email", icon: <Mail />, placeholder: "Email (optional)" },
                  { name: "address", icon: <MapPin />, placeholder: "Service Address *", required: true },
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500">
                      {field.icon}
                    </div>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-orange-200 bg-orange-50/50 focus:bg-white focus:ring-4 focus:ring-orange-300 focus:border-orange-400 focus:outline-none text-slate-700"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-orange-200 bg-orange-50/50 focus:bg-white focus:ring-4 focus:ring-orange-300 focus:border-orange-400 focus:outline-none text-slate-700"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-orange-200 bg-orange-50/50 focus:bg-white focus:ring-4 focus:ring-orange-300 focus:border-orange-400 focus:outline-none text-slate-700"
                    />
                  </div>
                </div>

                <div className="relative">
                  <MessageSquare className="absolute left-4 top-5 text-orange-500" size={20} />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional notes or special requests (optional)"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-orange-200 bg-orange-50/50 focus:bg-white focus:ring-4 focus:ring-orange-300 focus:border-orange-400 focus:outline-none text-slate-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-rose-500 transition transform hover:scale-105"
                >
                  Confirm Booking
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowseProfessionals;