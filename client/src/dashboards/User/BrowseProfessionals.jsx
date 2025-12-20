import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authAxios from "../../api";

const BrowseProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  const [serviceName, setServiceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(serviceId || "");
  const [selectedPro, setSelectedPro] = useState(null);
  const navigate = useNavigate();

  // Fetch professionals with optional filters
  const fetchPros = async (term = "", category = "") => {
    setLoading(true);
    try {
      let url = "/professionals";
      const params = [];

      if (category) params.push(`service=${category}`);
      if (term) params.push(`search=${encodeURIComponent(term)}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await authAxios.get(url);

      // Use res.data.professionals instead of res.data
      const result = Array.isArray(res.data.professionals)
        ? res.data.professionals
        : [];
      setProfessionals(result);

      if (category) {
        const serviceRes = await authAxios.get(`/services/${category}`);
        setServiceName(serviceRes.data?.name || "");
      } else {
        setServiceName("");
      }
    } catch (err) {
      console.error("❌ Failed to fetch professionals:", err);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await authAxios.get("/services");
      const result = Array.isArray(res.data) ? res.data : [];
      setCategories(result);
    } catch (err) {
      console.error("❌ Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchPros("", selectedCategory);
    fetchCategories();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPros(searchTerm, selectedCategory);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        {selectedCategory && serviceName
          ? `Showing professionals for ${serviceName}`
          : "Browse Professionals"}
      </h1>

      {/* Search + Category Filter */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Search by name, service, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 text-white"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80 transition"
        >
          Search
        </button>
      </form>

      {/* Professionals Grid */}
      {loading ? (
        <p className="text-gray-400">Loading professionals...</p>
      ) : professionals.length === 0 ? (
        <p className="text-gray-400">
          No professionals found {serviceName ? `for ${serviceName}` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={pro.photo || "default-avatar.png"}
                alt={pro.name}
                className="w-24 h-24 rounded-full mb-2 mx-auto"
              />
              <h3 className="text-lg font-semibold text-center">{pro.name}</h3>
              <p className="text-center text-gray-400">{pro.service_name}</p>
              <p className="text-center">⭐ {pro.rating}</p>
              <p className="text-center">₦{pro.price}/hour</p>

              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => setSelectedPro(pro)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animated Slide-In Modal */}
      <AnimatePresence>
        {selectedPro && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-end justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-t-lg shadow-lg w-full md:w-1/2"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedPro.name}</h2>
                <button
                  onClick={() => setSelectedPro(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <img
                src={selectedPro.photo || "default-avatar.png"}
                alt={selectedPro.name}
                className="w-24 h-24 rounded-full mb-4 mx-auto"
              />
              <p className="text-gray-400 mb-2">{selectedPro.service_name}</p>
              <p className="mb-2">⭐ {selectedPro.rating}</p>
              <p className="mb-4">₦{selectedPro.price}/hour</p>
              <p className="text-sm text-gray-300 mb-4">
                {selectedPro.bio || "No bio available."}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedPro(null)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    navigate(`/user-dashboard/bookings/new/${selectedPro.id}`)
                  }
                  className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
                >
                  Hire
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowseProfessionals;
