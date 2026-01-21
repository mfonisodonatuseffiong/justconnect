import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, MapPin, Briefcase } from "lucide-react";
import Card from "../components/commonUI/Card";
import SelectDropdown from "../components/commonUI/selectDropdownList";
import { getProfessionals } from "../service/servicesService";
import { useAuthHook } from "../hooks/authHooks";
import authAxios from "../api"; // adjust path if needed

export default function Service() {
  const { isAuthenticated } = useAuthHook();
  const locationHook = useLocation();

  // Read query param "service" from URL
  const params = new URLSearchParams(locationHook.search);
  const initialService = params.get("service") || "";

  const [filters, setFilters] = useState({ location: "", category: initialService, search: "" });
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;
  const [error, setError] = useState(null);

  // Dynamic categories from backend
  const [categories, setCategories] = useState([]);

  // Fetch real categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authAxios.get("/services");
        const cats = Array.isArray(res.data) ? res.data.map(c => c.name || c.title || c.service_name) : [];

        // Fallback if backend empty/fails
        if (cats.length === 0) {
          cats.push(
            "Plumbing", "Electrical", "Carpentry", "Painting",
            "Mechanic", "Cleaning", "Hair & Beauty", "Tailor",
            "Driver", "Chef", "Tech Repair", "Mason", "Gardener", "Tutoring", "Music Lessons", "Photography", "Childcare", "Auto Repair"
          );
        }

        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // Fallback hardcoded
        setCategories([
          "Plumbing", "Electrical", "Carpentry", "Painting",
          "Mechanic", "Cleaning", "Hair & Beauty", "Tailor",
          "Driver", "Chef", "Tech Repair", "Mason", "Gardener", "Tutoring", "Music Lessons", "Photography", "Childcare", "Auto Repair"
        ]);
      }
    };

    fetchCategories();
  }, []);

  const fetchProfessionals = async () => {
    if (!isAuthenticated) {
      setProfessionals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await getProfessionals({
        service: filters.category || undefined,
        location: filters.location || undefined,
        search: filters.search || undefined,
        page,
        limit,
        token,
      });

      setProfessionals(res.data || []);
      setTotalPages(Math.ceil((res.total || res.data?.length || 0) / limit));
    } catch (err) {
      console.error("Error fetching professionals:", err);
      setProfessionals([]);
      setError("Failed to fetch professionals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [filters, page, isAuthenticated]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  return (
    <div className="min-h-screen mt-[6rem] p-2">
      {/* Our Services cards – now using dynamic categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-center text-gray-600 mb-10">
          We connect clients with verified professionals for all kinds of artisan jobs.
        </p>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => handleFilterChange("category", cat)}
              className="cursor-pointer transform hover:scale-105 transition"
            >
              <Card
                img={null}
                name={cat}
                profession={cat}
                location="Available Nationwide"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Professionals list (only if logged in) */}
      <div className="mb-8 bg-gradient-to-tl from-brand via-primary-gray to-brand p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Find & Hire Skilled <span className="text-accent">Professionals</span>
        </h1>

        {/* Filters */}
        <div className="max-w-7xl mx-auto mt-6 grid sm:grid-cols-3 gap-4 p-4 rounded-2xl shadow-lg">
          <SelectDropdown
            value={filters.location}
            onChange={(val) => handleFilterChange("location", val)}
            options={["", "Lagos", "Abuja", "Port Harcourt"]}
            placeholder="All Locations"
            icon={MapPin}
          />
          <SelectDropdown
            value={filters.category}
            onChange={(val) => handleFilterChange("category", val)}
            options={["", ...categories]}
            placeholder="All Services"
            icon={Briefcase}
          />
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
            <Search className="w-5 h-5 text-accent" />
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-transparent w-full outline-none"
              onChange={(e) => handleFilterChange("search", e.target.value.toLowerCase())}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-20">Loading professionals...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-20">{error}</p>
      ) : professionals.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-xl font-semibold text-slate-700">
            {filters.category
              ? `No professionals available in ${filters.category} at the moment.`
              : "No professionals match your filters."}
          </p>
          <p className="mt-3 text-slate-500">
            Please check back later or try a different category/location.
          </p>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {professionals.map((pro) => (
              <Card
                key={pro.id}
                img={pro.photo || pro.avatar || "https://i.pravatar.cc/150"}
                name={pro.name}
                profession={pro.service_name || pro.service || pro.category || "N/A"}
                location={pro.location || "Unknown"}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 rounded bg-primary-gray text-white disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 rounded bg-primary-gray text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}