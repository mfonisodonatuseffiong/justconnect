/**
 * @desc About section - can be used on both Landing Page and About Page
 * @param {boolean} showButton - whether to show the "Learn More" link
 */

import aboutImg from "../../assets/hero.svg";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const About = ({ showButton = true, showTitle = true }) => {
  return (
    <section
      className="relative py-20 text-brand overflow-hidden"
      data-aos="fade-up"
    >
      <div className="max-w-6xl mx-auto px-2 md:px-12 lg:px-16">
        {/* Title */}
        <div className="text-center space-y-4 mb-12">
          {showTitle && (
            <h2 className="text-4xl font-bold" data-aos="zoom">
              About <span className="text-accent">JustConnect</span>
            </h2>
          )}
          <p
            className="text-base text-primary-gray md:text-lg w-1/2 max-w-3xl mx-auto"
            data-aos="fade-in"
            data-aos-delay="500"
          >
            We connect clients with skilled and verified artisans — making it
            easier, faster, and safer to get trusted professionals for all your
            daily needs.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center md:p-10">
          {/* Left - Text */}
          <div className="space-y-6 place-items-center md:place-items-start">
            <h3
              className="text-3xl font-semibold flex items-center gap-2"
              data-aos="fade-up-right"
            >
              Why Choose Us?
            </h3>
            <ul className="space-y-4 text-primary-gray" data-aos="fade-right">
              <li>✅ Verified and trusted artisans near you</li>
              <li data-aos-delay="500" data-aos="fade">
                ✅ Safe and seamless booking experience
              </li>
              <li>✅ Wide range of services for home & business</li>
              <li data-aos-delay="1000">
                ✅ Save time and get the job done right
              </li>
            </ul>

            {/* Conditionally show "Learn More" */}
            {showButton && (
              <Link
                to="/about-us"
                className="group w-full inline-flex items-center justify-center md:justify-start gap-1 mt-6 text-brand hover:text-accent font-semibold rounded-lg hover:underline transition-all"
              >
                Learn More
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2" />
              </Link>
            )}
          </div>

          {/* Right - Illustration */}
          <div className="relative flex justify-center" data-aos="zoom-in">
            <div className="absolute animate-pulse inset-0 rounded-full bg-purple-300 blur-2xl opacity-40"></div>
            <img
              src={aboutImg}
              alt="About JustConnect illustration"
              className="w-[300px] sm:w-[400px] lg:w-[450px] drop-shadow-2xl rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
