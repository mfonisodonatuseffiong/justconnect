import { useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import Card from "../components/commonUI/Card";
import SelectDropdown from "../components/commonUI/selectDropdownList";

const professionals = [
  {
    id: 1,
    name: "Chiamaka Okafor",
    category: "Electrician",
    location: "Lagos",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 2,
    name: "Donatus Paul",
    category: "Plumber",
    location: "Abuja",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: 3,
    name: "Samuel Johnson",
    category: "Carpenter",
    location: "Port Harcourt",
    avatar: "https://i.pravatar.cc/150?img=55",
  },
  {
    id: 4,
    name: "Micheal Adeyemi",
    category: "Carpenter",
    location: "Port Harcourt",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
];

const categories = [
  "",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Mechanic",
  "Cleaner",
  "Hair Stylist",
  "Tailor",
  "Driver",
  "Chef",
  "Technician",
  "Mason",
  "Gardener",
  "Teacher",
];

const locations = ["", "Lagos", "Abuja", "Port Harcourt"];

export default function Service() {
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    search: "",
  });

  const filteredPros = professionals.filter((pro) => {
    const matchesLocation = filters.location
      ? pro.location === filters.location
      : true;
    const matchesCategory = filters.category
      ? pro.category === filters.category
      : true;
    const matchesSearch = filters.search
      ? pro.name.toLowerCase().includes(filters.search)
      : true;
    return matchesLocation && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen mt-[6rem] bg-gradient p-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 bg-black/20 backdrop-blur-sm p-6 rounded-2xl shadow-lg z-30">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Find & Hire Skilled{" "}
            <span className="text-[var(--accent)]">Professionals</span>
          </h1>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-10 z-30">
          {/* Location Dropdown */}
          <SelectDropdown
            value={filters.location}
            onChange={(val) => setFilters({ ...filters, location: val })}
            options={locations}
            placeholder="All Locations"
            icon={MapPin}
          />

          {/* Category Dropdown */}
          <SelectDropdown
            value={filters.category}
            onChange={(val) => setFilters({ ...filters, category: val })}
            options={categories}
            placeholder="All Categories"
            icon={Briefcase}
          />

          {/* Search Input */}
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
            <Search className="w-5 h-5 text-[var(--accent)]" />
            <input
              type="text"
              placeholder="Search by name..."
              className="bg-transparent w-full outline-none"
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value.toLowerCase() })
              }
            />
          </div>
        </div>

        {/* Professionals Grid Card */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPros.length > 0 ? (
            filteredPros.map((pro) => (
              <Card
                key={pro.id}
                img={pro.avatar}
                name={pro.name}
                profession={pro.category}
                location={pro.location}
              />
            ))
          ) : (
            <p className="text-center col-span-full opacity-80">
              No professionals match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
