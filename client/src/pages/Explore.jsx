// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getProfessionals } from "../service/servicesService";
import authAxios from "../api";
import { Star, MapPin } from "lucide-react";

const Explore = () => {
  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Services");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const totalPages = Math.ceil(total / 9);

  // Read service from URL (?service=Electrical)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get("service");
    if (serviceParam) {
      setSelectedCategory(serviceParam);
    }
  }, [location.search]);

  // Fetch categories from database ONLY
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authAxios.get("/services");
        let services = Array.isArray(res.data) ? res.data : [];

        // Optional: remove duplicates by name (uncomment if needed)
        // services = [...new Map(services.map(s => [s.name, s])).values()];

        setCategories([
          { name: "All Services" },
          ...services.map((s) => ({
            name: s.name || s.title || s.service_name || "Unnamed Service",
          })),
        ]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([{ name: "All Services" }]);
      }
    };

    fetchCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch professionals
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);

        const params = {
          page,
          limit: 9,
          search: debouncedSearch || undefined,
        };

        if (selectedCategory !== "All Services") {
          params.service = selectedCategory;
        }

        const res = await getProfessionals(params);

        setProfessionals(res?.data || []);
        setTotal(res?.total || 0);
      } catch (error) {
        console.error("Error fetching professionals:", error);
        setProfessionals([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [selectedCategory, page, debouncedSearch]);

  const handleBook = (id) => {
    if (!user) {
      alert("Please log in or sign up to book a professional.");
      navigate("/auth/login");
      return;
    }
    navigate(`/book/${id}`);
  };

  const selectedCategoryName = selectedCategory;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-orange-50/30 to-rose-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">
            Explore {selectedCategoryName}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            {selectedCategory === "All Services"
              ? "Browse skilled, verified professionals across all services."
              : `Browse skilled, verified professionals in ${selectedCategoryName}.`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="flex w-full max-w-3xl gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="min-w-[200px] px-4 py-3 border border-orange-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill, or location..."
                className="w-full px-5 py-3 border border-orange-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700 placeholder-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-slate-500">Loading professionals...</p>
        ) : professionals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl font-semibold text-slate-700">
              No professionals available in {selectedCategoryName}.
            </p>
            <p className="mt-2 text-slate-500">
              Please check back later or try a different category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="group relative bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100/50 hover:border-orange-300/70 flex flex-col h-full transform hover:-translate-y-1"
                >
                  {/* Image with badge */}
                  <div className="relative">
                    <img
                      src={pro.avatar || `https://i.pravatar.cc/150?u=${pro.id}`}
                      alt={pro.name}
                      className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Profession badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-semibold rounded-full shadow-md backdrop-blur-sm">
                      {pro.service_name || pro.service || pro.category || selectedCategoryName || "Professional"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors duration-300">
                      {pro.name}
                    </h2>

                    {/* Rating stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => {
                        const starValue = i + 1;
                        const rating = Number(pro.rating) || 4.8;
                        const filled = starValue <= Math.round(rating);
                        return (
                          <Star
                            key={i}
                            size={18}
                            className={filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        );
                      })}
                      <span className="text-sm font-medium text-slate-600 ml-1">
                        {Number(pro.rating) ? Number(pro.rating).toFixed(1) : "4.8"}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({pro.rating_count || 38})
                      </span>
                    </div>

                    {/* Location */}
                    <p className="text-sm text-slate-600 mb-4 flex items-center gap-1.5">
                      <MapPin size={16} className="text-orange-500" />
                      {pro.location || "Location not available"}
                    </p>

                    {/* Book button at bottom */}
                    <div className="mt-auto">
                      <button
                        onClick={() => handleBook(pro.id)}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02]"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-6 py-3 rounded-full bg-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition"
                >
                  Prev
                </button>
                <span className="text-slate-700 font-semibold px-4 py-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-3 rounded-full bg-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Explore;