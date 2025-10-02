/**
 * @description: This creates a card reuseable for the services page
 *               Takes in, image, name, profession, location and a button for hire
 * @returns A card component
 */

import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Card = ({ img, name, profession, location, ...prop }) => {
  return (
    <div
      className="backdrop-blur-md bg-white/10 p-4 shadow-lg w-full rounded-2xl hover:shadow-2xl transform transition hover:scale-[1.02]"
      {...prop}
    >
      {/** content container */}
      <div className="flex flex-col items-center text-center">
        <img
          src={img}
          alt="profile image"
          loading="lazy"
          className="h-20 w-20 rounded-full border-4 border-white mb-4"
        />
        {/** professional details */}
        <h1 className="text-lg font-semibold"> {name} </h1>
        <p className="text-sm opacity-80"> {profession} </p>
        <p className="text-sm flex items-center gap-1 mt-2 text-orange-300">
          <MapPin className="h-4 w-4" />
          {location}
        </p>

        {/** hire button */}
        <button
          type="button"
          className="mt-4 md:px-10 px-6 py-2 bg-[var(--accent)] rounded-full font-medium hover:bg-white hover:text-[var(--accent)] transition"
        >
          <Link to="#"> Hire Me </Link>
        </button>
      </div>
    </div>
  );
};

export default Card;
