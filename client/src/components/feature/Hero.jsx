/**
 * @desc Hero section for the landing page
 * @returns Hero component
 */
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.svg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient px-4 md:px-6 mt-[6rem] md:mt-0">
      {/* Container */}
      <div className="max-w-7xl w-full mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-12 md:pt-0">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Connect With
            <span className="text-[var(--accent)] drop-shadow-lg">
              Trusted Artisans
            </span>
            <br /> Anytime, Anywhere
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-300">
            Find verified professionals for all your home and business needs.
            From plumbers to carpenters, electricians to tailors — we make it
            easy to hire reliable artisans near you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
            <Link
              to="/explore"
              className="px-8 py-4 rounded-full bg-[var(--accent)] font-semibold shadow-lg hover:bg-white hover:text-[var(--accent)] transition duration-300 text-lg"
            >
              Find an Artisan
            </Link>
            <Link
              to="/auth/signup"
              className="px-8 py-4 rounded-full border border-gray-300 font-semibold hover:bg-gray-200 hover:text-[#002345] transition duration-300 text-lg"
            >
              Join as Artisan
            </Link>
          </div>
        </div>

        {/* Right Side Illustration / Image */}
        <div className="relative flex justify-center md:justify-end w-full md:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6f61]/30 via-purple-300 to-transparent rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <img
            src={heroImage}
            alt="Artisan illustration"
            className="relative w-[320px] sm:w-[480px] lg:w-[600px] drop-shadow-2xl animate-fadeIn"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
