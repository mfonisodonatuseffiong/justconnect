/**
 * @desc About section – reusable for Landing Page and About Page
 *       With industry-standard fade-up scroll animation (same as Testimonial)
 * @param {boolean} showButton - whether to show the "Learn More" link
 * @param {boolean} showTitle - whether to show the section title
 */

import aboutImg from "../../assets/hero.svg";
import { ChevronRight } from "lucide-react";

const About = ({ showButton = true, showTitle = true }) => {
  // Smooth scroll to FAQ section
  const scrollToFAQ = () => {
    const faqSection = document.getElementById("faq");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="about" // ← Navbar "About Us" scrolls here
      className="relative py-16 md:py-24 bg-orange-50 text-slate-800 overflow-hidden"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Title */}
        <div className="text-center space-y-4 mb-10 md:mb-14">
          {showTitle && (
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              About <span className="text-orange-600">JustConnect</span>
            </h2>
          )}
          <p
            className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            We connect clients with skilled and verified artisans — making it
            easier, faster, and safer to get trusted professionals for all your
            daily needs.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left - Text */}
          <div className="space-y-6">
            <h3
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-orange-600"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Why Choose Us?
            </h3>
            <ul
              className="space-y-3 text-slate-600 text-sm sm:text-base"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <li>Verified and trusted artisans near you</li>
              <li>Safe and seamless booking experience</li>
              <li>Wide range of services for home & business</li>
              <li>Save time and get the job done right</li>
            </ul>

            {/* "Learn More" → scrolls to FAQ */}
            {showButton && (
              <button
                onClick={scrollToFAQ}
                className="group inline-flex items-center gap-1 mt-6 text-orange-600 hover:text-orange-500 font-semibold text-sm sm:text-base transition"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                Learn More
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Right - Illustration */}
          <div
            className="relative flex justify-center"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="absolute inset-0 rounded-full bg-orange-200 blur-2xl opacity-30 animate-pulse"></div>
            <img
              src={aboutImg}
              alt="About JustConnect illustration"
              className="w-64 sm:w-80 lg:w-96 drop-shadow-xl rounded-lg relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
