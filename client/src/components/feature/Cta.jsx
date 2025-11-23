/**
 * @description Call to action
 */

import { ChevronRight, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const CTA = () => {
  const authenticatedUser = useAuthStore((state) => state.user);
  return (
    <div
      className="relative text-brand py-16 px-6 md:px-20 rounded-xl overflow-hidden shadow-lg text-center"
      data-aos="fade-up"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {authenticatedUser
          ? "Take me to my dashboard"
          : "Looking to hire or showcase your skills?"}
      </h2>
      <p className="text-lg md:text-xl mb-8 animate-pulse">
        {!authenticatedUser &&
          "Sign up and start connecting with professionals and clients instantly."}
      </p>
      <Link
        to={
          authenticatedUser
            ? `/dashboard/${authenticatedUser.role}`
            : "/auth/signup"
        }
        className="inline-flex items-center gap-3 bg-accent text-white font-semibold px-12 py-3 rounded-full shadow-lg hover:bg-white hover:text-accent transition duration-300"
      >
        {authenticatedUser ? (
          <>
            {" "}
            My Dashboard <LayoutDashboard size={18} />
          </>
        ) : (
          <>
            Get Started <ChevronRight size={18} />
          </>
        )}
      </Link>
    </div>
  );
};

export default CTA;
