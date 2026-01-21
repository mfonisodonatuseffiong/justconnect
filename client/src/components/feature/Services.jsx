// src/components/feature/Services.jsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  Wrench,
  Zap,
  Paintbrush,
  Scissors,
  Hammer,
  Camera,
  Laptop,
  Home,
  Car,
  Baby,
  Music,
  BookOpen,
} from "lucide-react";

/**
 * Service categories (static)
 * Logic unchanged
 */
const categories = [
  {
    title: "Plumbing",
    description: "Leak repairs, installations, drainage, and emergency plumbing.",
    icon: Wrench,
    gradient: "from-orange-500 to-amber-600",
    service: "Plumbing",
  },
  {
    title: "Electrical",
    description: "Wiring, lighting, repairs, and electrical installations.",
    icon: Zap,
    gradient: "from-orange-500 to-amber-600",
    service: "Electrical",
  },
  {
    title: "Painting",
    description: "Interior/exterior painting, wall repairs, and decorative finishes.",
    icon: Paintbrush,
    gradient: "from-orange-500 to-amber-600",
    service: "Painting",
  },
  {
    title: "Hair & Beauty",
    description: "Haircuts, styling, braiding, makeup, and barber services.",
    icon: Scissors,
    gradient: "from-orange-500 to-amber-600",
    service: "Hair & Beauty",
  },
  {
    title: "Carpentry",
    description: "Furniture, doors, windows, repairs, and custom woodwork.",
    icon: Hammer,
    gradient: "from-orange-500 to-amber-600",
    service: "Carpentry",
  },
  {
    title: "Photography",
    description: "Weddings, events, portraits, and professional shoots.",
    icon: Camera,
    gradient: "from-orange-500 to-amber-600",
    service: "Photography",
  },
  {
    title: "Tech Repair",
    description: "Phone, laptop, computer repairs, and software support.",
    icon: Laptop,
    gradient: "from-orange-500 to-amber-600",
    service: "Tech Repair",
  },
  {
    title: "Cleaning",
    description: "Home, office, deep cleaning, and post-construction.",
    icon: Home,
    gradient: "from-orange-500 to-amber-600",
    service: "Cleaning",
  },
  {
    title: "Auto Repair",
    description: "Maintenance, diagnostics, body work, and repairs.",
    icon: Car,
    gradient: "from-orange-500 to-amber-600",
    service: "Auto Repair",
  },
  {
    title: "Childcare",
    description: "Babysitting, nanny services, and child tutoring.",
    icon: Baby,
    gradient: "from-orange-500 to-amber-600",
    service: "Childcare",
  },
  {
    title: "Music Lessons",
    description: "Piano, guitar, voice, drums, and instrument training.",
    icon: Music,
    gradient: "from-orange-500 to-amber-600",
    service: "Music Lessons",
  },
  {
    title: "Tutoring",
    description: "Math, English, science, and exam preparation.",
    icon: BookOpen,
    gradient: "from-orange-500 to-amber-600",
    service: "Tutoring",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  /**
   * Navigate to Explore page filtered by service
   * LOGIC UNCHANGED
   */
  const handleFindProfessionals = (serviceName) => {
    navigate(`/explore?service=${encodeURIComponent(serviceName)}`);
  };

  /**
   * Booking guard (not used here but kept — logic unchanged)
   */
  const handleBookProfessional = (professionalId) => {
    if (!user) {
      alert("Sorry, you have to sign up. Thank you!");
      navigate("/auth/login");
      return;
    }
    navigate(`/book/${professionalId}`);
  };

  return (
    <section
      id="our-services"
      className="py-16 md:py-24 bg-gradient-to-b from-white via-orange-50/30 to-rose-50/50"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className="text-center mb-12 md:mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">
            Our Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Connect with skilled, verified artisans for every need — quality work,
            reliable service, and peace of mind guaranteed.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <div
                key={category.title}
                className="group"
                data-aos="fade-up"
                data-aos-delay={150 + index * 100}
                data-aos-duration="600"
              >
                <div className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-orange-100 h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className={`bg-gradient-to-br ${category.gradient} p-8 flex justify-center items-center`}
                  >
                    <Icon size={48} className="text-white drop-shadow-md" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 text-center mb-3">
                        {category.title}
                      </h3>
                      <p className="text-slate-600 text-center text-sm md:text-base">
                        {category.description}
                      </p>
                    </div>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() =>
                          handleFindProfessionals(category.service)
                        }
                        className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm md:text-base group-hover:gap-3 transition-all duration-300"
                      >
                        Find Professionals →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;