/**
 * @description Call to action
 */

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = ({
  title = "Looking to hire or showcase your skills?",
  subtitle = "Sign up and start connecting with professionals and clients instantly.",
  buttonText = "Get Started",
  buttonLink = "/auth/signup",
}) => {
  return (
    <div
      className="relative text-brand py-16 px-6 md:px-20 rounded-xl overflow-hidden shadow-lg text-center"
      data-aos="fade-up"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg md:text-xl mb-8 animate-pulse">{subtitle}</p>
      <Link
        to={buttonLink}
        className="inline-flex items-center gap-3 bg-accent text-white font-semibold px-12 py-3 rounded-full shadow-lg hover:bg-white hover:text-accent transition duration-300"
      >
        {buttonText} <ChevronRight />
      </Link>
    </div>
  );
};

export default CTA;
