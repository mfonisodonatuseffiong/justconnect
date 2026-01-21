/**
 * @description: Reusable card for services and professionals
 *               Shows image, name, profession (if provided), location, and a hire button
 */

import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Card = ({ img, name, profession, location, alwaysShowProfession = false, ...prop }) => {
  return (
    <div
      className="backdrop-blur-md bg-gray-50 text-primary-gray p-4 shadow-lg w-full rounded-2xl hover:shadow-2xl transform transition hover:scale-[1.02]"
      {...prop}
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={img}
          alt="profile image"
          loading="lazy"
          className="h-20 w-20 rounded-full border-4 border-white mb-4"
        />
        <h1 className="text-lg font-semibold">{name}</h1>

        {/* ✅ Profession line logic */}
        {(alwaysShowProfession || (profession && profession.trim() !== "")) && (
          <p className="text-sm opacity-80">{profession}</p>
        )}

        <p className="text-sm flex items-center gap-1 mt-2 text-accent">
          <MapPin className="h-4 w-4" />
          {location}
        </p>

        <button
          type="button"
          className="mt-4 md:px-10 px-6 py-2 bg-accent text-white rounded-full font-medium hover:bg-white hover:text-accent transition duration-300"
        >
          <Link to="#">Hire Me</Link>
        </button>
      </div>
    </div>
  );
};

export default Card;
