import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authAxios from "../../api";
import DefaultAvatar from "../../assets/avatars/avatar-neutral.png";

const BrowseProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPro, setSelectedPro] = useState(null);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceIdFromUrl = searchParams.get("service");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await authAxios.get("/services");
      let cats = Array.isArray(res.data) ? res.data : [];
      if (!cats.find((c) => c.name === "Electrician")) {
        cats.push({ id: "electrician", name: "Electrician" });
      }
      setCategories(cats);
      if (serviceIdFromUrl) setSelectedCategory(serviceIdFromUrl);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([{ id: "electrician", name: "Electrician" }]);
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

        // Ensure correct category filtering
        if (selectedCategory) {
          pros = pros.filter(
            (pro) =>
              String(pro.service_id) === String(selectedCategory) ||
              String(pro.service_name).toLowerCase() === String(selectedCategory).toLowerCase()
          );
        }

        setProfessionals(pros);

        // Set service name for header
        if (selectedCategory) {
          const serviceRes = await authAxios.get(`/services/${selectedCategory}`);
          setServiceName(serviceRes.data?.name || selectedCategory);
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
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      <h1 className="text-xl font-bold mb-6 text-accent">
        {selectedCategory && serviceName
          ? `Professionals for ${serviceName}`
          : "Browse Professionals"}
      </h1>

      {/* Search Form */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-purple-950/40 border border-purple-800 focus:ring-2 focus:ring-accent focus:outline-none text-white text-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 rounded-lg bg-purple-950/40 border border-purple-800 focus:ring-2 focus:ring-purple-400 focus:outline-none text-white text-sm"
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
        <p className="text-gray-400">Loading...</p>
      ) : professionals.length === 0 ? (
        <p className="text-gray-400 text-center">
          No professionals found for this search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {professionals.map((pro) => (
            <motion.div
              key={pro.id}
              className="bg-purple-950/60 border border-purple-800 p-4 rounded-xl shadow-md hover:shadow-lg transition text-center"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={pro.profile_pic || pro.photo || DefaultAvatar}
                alt="Professional avatar"
                className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-purple-700"
              />
              <h3 className="mt-2 text-sm font-semibold text-purple-300">
                {pro.name || "Unnamed"}
              </h3>
              <p className="text-xs text-gray-400">{pro.service_name}</p>
              {pro.location && pro.location !== "Unknown" && (
                <p className="text-xs text-gray-400">{pro.location}</p>
              )}
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setSelectedPro(pro)}
                  className="px-3 py-1 text-sm rounded-lg bg-accent hover:bg-purple-600 text-white font-medium transition"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedPro && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-purple-950/80 border border-purple-800 p-6 rounded-2xl shadow-xl w-full max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold text-accent">Book Professional</h2>
                <button
                  onClick={() => setSelectedPro(null)}
                  className="text-xl text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="text-sm space-y-1 mb-4 text-gray-300">
                {selectedPro.location && selectedPro.location !== "Unknown" && (
                  <p>
                    <strong className="text-purple-300">Location:</strong> {selectedPro.location}
                  </p>
                )}
                {selectedPro.contact && (
                  <p>
                    <strong className="text-purple-300">Phone:</strong> {selectedPro.contact}
                  </p>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/user-dashboard/bookings/new/${selectedPro.id}`);
                }}
                className="space-y-3"
              >
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 rounded-lg bg-purple-950/40 border border-purple-800 focus:ring-2 focus:ring-accent focus:outline-none text-white text-sm"
                  required
                />
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-3 rounded-lg bg-purple-950/40 border border-purple-800 focus:ring-2 focus:ring-accent focus:outline-none text-white text-sm"
                  required
                />
                <textarea
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-purple-950/40 border border-purple-800 focus:ring-2 focus:ring-purple-400 focus:outline-none text-white text-sm"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-accent hover:bg-purple-600 rounded-lg text-white font-semibold transition"
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
