/**
 * @desc Hero section for the landing page
 * @returns Hero component
 */
import { Link } from "react-router-dom";
import { LayoutDashboardIcon, UserPlus } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Hero = () => {
  const authenticatedUser = useAuthStore((state) => state.user);

  return (
    <section className="relative bg-orange-50 flex justify-center px-4 md:px-6 mt-[6rem] py-20 pb-40">
      <img
        src="/hero.webp"
        alt="Artisan Background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10"
      />
      {/* Container */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-center gap-4 md:gap-12 md:pt-0 h-full">
        {/* Left Content */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight text-slate-800">
            Connect With{" "}
            <span className="text-orange-600 drop-shadow-lg">
              Trusted Artisans
            </span>
            <br /> Anytime, Anywhere
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
            Find verified professionals for all your home and business needs.
            From plumbers to carpenters, electricians to tailors — we make it
            easy to hire reliable artisans near you.
          </p>
          {/*  ========= CTA Buttons ==================*/}
          {authenticatedUser ? (
            <div className="mt-10 w-full max-w-md mx-auto flex">
              <Link
                to={`/dashboard/${authenticatedUser.role}`}
                className="flex items-center justify-center gap-4 py-4 rounded-full bg-orange-500 text-white font-semibold shadow-lg hover:bg-orange-600 transition duration-300 text-lg w-full"
              >
                <LayoutDashboardIcon size={20} /> My Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center py-8">
              <Link
                to="/explore-services"
                className="px-8 py-4 rounded-full bg-orange-500 text-white font-semibold shadow-lg hover:bg-orange-600 transition duration-300 text-lg"
              >
                Find an Artisan
              </Link>
              <Link
                to="/auth/signup"
                className="flex gap-3 items-center justify-center px-8 py-4 rounded-full border border-orange-300 text-orange-600 font-semibold hover:bg-orange-500 hover:text-white shadow-xl transition duration-300 text-lg"
              >
                <UserPlus size={16} />
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
