import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import Card from "../components/commonUI/Card";
import SelectDropdown from "../components/commonUI/selectDropdownList";
import { getProfessionals } from "../service/servicesService";
import { useAuthHook } from "../hooks/authHooks";

const categories = [
  "", "Electrician", "Plumber", "Carpenter", "Painter",
  "Mechanic", "Cleaner", "Hair Stylist", "Tailor",
  "Driver", "Chef", "Technician", "Mason", "Gardener", "Teacher"
];

const locations = ["", "Lagos", "Abuja", "Port Harcourt"];

export default function Service() {
  const { user, isAuthenticated } = useAuthHook();
  const [filters, setFilters] = useState({ location: "", category: "", search: "" });
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // items per page
  const [error, setError] = useState(null);

  const fetchProfessionals = async () => {
    if (!isAuthenticated) {
      setProfessionals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); // make sure login stores token
      const res = await getProfessionals({ ...filters, page, limit, token });

      // handle backend response format
      setProfessionals(res.data || []);
      setTotalPages(Math.ceil((res.total || res.data.length) / limit));
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

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-20 text-red-500">
        You must be logged in to view professionals.
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[6rem] p-2">
      <div className="mb-8 bg-gradient-to-tl from-brand via-primary-gray to-brand backdrop-blur-sm p-2 pt-16 md:py-20 rounded-2xl shadow-lg z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Find & Hire Skilled <span className="text-accent">Professionals</span>
        </h1>

        {/* Filters */}
        <div className="max-w-7xl mx-auto mt-4 md:mt-16 grid sm:grid-cols-3 gap-4 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-10 z-30">
          <SelectDropdown
            value={filters.location}
            onChange={(val) => handleFilterChange("location", val)}
            options={locations}
            placeholder="All Locations"
            icon={MapPin}
          />
          <SelectDropdown
            value={filters.category}
            onChange={(val) => handleFilterChange("category", val)}
            options={categories}
            placeholder="All Categories"
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
        <p className="text-center text-primary-gray col-span-full opacity-80 mt-20">
          No professionals match your filters.
        </p>
      ) : (
        <>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {professionals.map((pro) => (
              <Card
                key={pro.id}
                img={pro.avatar || "https://i.pravatar.cc/150"}
                name={pro.name}
                profession={pro.category || "N/A"}
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
