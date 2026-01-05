/**
 * @desc Premium Hero Section – Industry Standard Design
 *       Smooth scroll to "Our Services" for maximum engagement
 */
import { Link } from "react-router-dom";
import { LayoutDashboard, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";

const Hero = () => {
  const user = useAuthStore((state => state.user));

  // Smooth scroll to Our Services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById("our-services");
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-rose-50 overflow-hidden py-24 md:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/hero.webp"
          alt="Trusted Artisans at Work"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/80" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="space-y-10"
        >
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 leading-tight">
            Connect With{" "}
            <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent drop-shadow-md">
              Trusted Artisans
            </span>
            <br className="hidden sm:block" />
            Anytime, Anywhere
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Find verified professionals for all your home and business needs — plumbers, electricians, carpenters, tailors, and more. 
            Get quality service, fast and hassle-free.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            {user ? (
              // Logged-in user: Go to dashboard
              <Link
                to="/user-dashboard"
                className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xl shadow-2xl hover:shadow-orange-300/50 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">My Dashboard</span>
                <LayoutDashboard className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition" />
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700" />
              </Link>
            ) : (
              <>
                {/* Primary CTA: Smooth scroll to Our Services */}
                <button
                  onClick={scrollToServices}
                  className="group relative inline-flex items-center px-14 py-7 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xl shadow-2xl hover:shadow-orange-400/60 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10">Find Professionals</span>
                  <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700" />
                </button>

                {/* Secondary CTA: Create Account */}
                <Link
                  to="/auth/signup"
                  className="group inline-flex items-center gap-4 px-12 py-7 rounded-full border-3 border-orange-500 text-orange-600 font-bold text-xl bg-white hover:bg-orange-500 hover:text-white shadow-xl hover:shadow-orange-300/50 transition-all duration-300"
                >
                  <UserPlus className="w-7 h-7 group-hover:scale-110 transition" />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 120L60 105C120 90 240 60 360 50C480 40 600 50 720 55C840 60 960 60 1080 55C1200 50 1320 40 1380 35L1440 30V120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;