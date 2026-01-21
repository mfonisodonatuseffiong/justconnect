// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getProfessionals } from "../service/servicesService";
import authAxios from "../api";

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

  // Read category from URL (e.g. ?category=Plumbing)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Fetch categories (real ones from backend)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authAxios.get("/services");
        const services = Array.isArray(res.data) ? res.data : [];
        setCategories([
          { name: "All Services" },
          ...services.map((s) => ({ name: s.name || s.title || "Unnamed" })),
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

  // Fetch professionals – send category NAME (not ID)
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);

        const params = {
          page,
          limit: 9,
          search: debouncedSearch || undefined,
        };

        // Only filter if not "All Services"
        if (selectedCategory !== "All Services") {
          params.service = selectedCategory; // ← name like "Plumbing"
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
            {/* Category dropdown – uses NAME as value */}
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

            {/* Search */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white p-6 rounded-xl shadow-md border border-orange-200 hover:shadow-lg transition"
                >
                  <img
                    src={pro.avatar || `https://i.pravatar.cc/150?u=${pro.id}`}
                    alt={pro.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-lg font-bold text-slate-800 text-center">
                    {pro.name}
                  </h2>
                  <p className="text-sm text-slate-600 text-center">
                    {pro.service?.name || pro.service || selectedCategoryName}
                  </p>
                  <p className="text-sm text-slate-500 text-center">
                    {pro.location || "Location not available"}
                  </p>
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => handleBook(pro.id)}
                      className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      Book Now
                    </button>
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
                  className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-slate-700 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50"
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