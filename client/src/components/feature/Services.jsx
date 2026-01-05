// src/components/feature/Services.jsx
/**
 * @desc Our Services Section – Premium Category Cards
 *       Industry-standard design with maximum engagement
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

const categories = [
  {
    title: "Plumbing",
    description: "Leak repairs, installations, drainage, and emergency plumbing.",
    icon: Wrench,
    gradient: "from-blue-500 to-cyan-500",
    link: "/explore?category=plumbing",
  },
  {
    title: "Electrical",
    description: "Wiring, lighting, repairs, and electrical installations.",
    icon: Zap,
    gradient: "from-yellow-500 to-amber-500",
    link: "/explore?category=electrical",
  },
  {
    title: "Painting",
    description: "Interior/exterior painting, wall repairs, and decorative finishes.",
    icon: Paintbrush,
    gradient: "from-purple-500 to-pink-500",
    link: "/explore?category=painting",
  },
  {
    title: "Hair & Beauty",
    description: "Haircuts, styling, braiding, makeup, and barber services.",
    icon: Scissors,
    gradient: "from-rose-500 to-pink-500",
    link: "/explore?category=beauty",
  },
  {
    title: "Carpentry",
    description: "Furniture, doors, windows, repairs, and custom woodwork.",
    icon: Hammer,
    gradient: "from-orange-500 to-amber-600",
    link: "/explore?category=carpentry",
  },
  {
    title: "Photography",
    description: "Weddings, events, portraits, and professional shoots.",
    icon: Camera,
    gradient: "from-indigo-500 to-purple-500",
    link: "/explore?category=photography",
  },
  {
    title: "Tech Repair",
    description: "Phone, laptop, computer repairs, and software support.",
    icon: Laptop,
    gradient: "from-teal-500 to-green-500",
    link: "/explore?category=tech",
  },
  {
    title: "Cleaning",
    description: "Home, office, deep cleaning, and post-construction.",
    icon: Home,
    gradient: "from-emerald-500 to-teal-500",
    link: "/explore?category=cleaning",
  },
  {
    title: "Auto Repair",
    description: "Maintenance, diagnostics, body work, and repairs.",
    icon: Car,
    gradient: "from-red-500 to-orange-500",
    link: "/explore?category=auto",
  },
  {
    title: "Childcare",
    description: "Babysitting, nanny services, and child tutoring.",
    icon: Baby,
    gradient: "from-pink-500 to-rose-500",
    link: "/explore?category=childcare",
  },
  {
    title: "Music Lessons",
    description: "Piano, guitar, voice, drums, and instrument training.",
    icon: Music,
    gradient: "from-violet-500 to-purple-500",
    link: "/explore?category=music",
  },
  {
    title: "Tutoring",
    description: "Math, English, science, and exam preparation.",
    icon: BookOpen,
    gradient: "from-cyan-500 to-blue-500",
    link: "/explore?category=tutoring",
  },
];

const Services = () => {
  return (
    <section id="our-services" className="py-20 md:py-32 bg-gradient-to-b from-white via-orange-50/30 to-rose-50/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-6">
            Our Services
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Connect with skilled, verified artisans for every need — quality work, reliable service, and peace of mind guaranteed.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -16, scale: 1.06 }}
              className="group"
            >
              <Link to={category.link} className="block h-full">
                <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-100 h-full flex flex-col">
                  {/* Gradient Icon Header */}
                  <div className={`relative bg-gradient-to-br ${category.gradient} p-12 overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/15" />
                    <category.icon size={80} className="text-white relative z-10 mx-auto drop-shadow-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Card Content */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-5">
                        {category.title}
                      </h3>
                      <p className="text-slate-600 text-center leading-relaxed text-base">
                        {category.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-10 text-center">
                      <span className="inline-flex items-center gap-4 text-orange-600 font-bold text-lg group-hover:gap-6 transition-all duration-500">
                        Find Professionals
                        <motion.span
                          animate={{ x: 0 }}
                          whileHover={{ x: 12 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="text-orange-600 text-3xl"
                        >
                          →
                        </motion.span>
                      </span>
                    </div>
                  </div>

                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/10 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;