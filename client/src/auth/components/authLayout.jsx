/**
 * @description - This is the layout component for the authentication pages
 *               - Left side takes the form field as children while the right side takes the illustration
 * @returns Auth layout with background and container
 */

import { Link } from "react-router-dom";
import illustrationImg from "../../assets/hero.svg";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient">
      {/** left side for form */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden px-4">
        {/** -------------- logo --------------- */}
        <div className="logo-container absolute top-5 left-2 md:left-4">
          {" "}
          <Link to="/" aria-label="App logo, clicks and takes you home">
            <img
              src="/logo.webp"
              alt="JustConnect Logo"
              className="h-30 w-auto object-contain"
            />
          </Link>
        </div>
        {/** ------------------- background effect -------------- */}
        {/* Top-right glow */}
        <div className="absolute top-10 -right-10 h-40 w-40 md:h-56 md:w-56 rotate-[30deg] bg-[#7e57c2] blur-3xl rounded-2xl"></div>

        {/* Bottom-left glow */}
        <div className="absolute bottom-10 -left-10 h-40 w-40 md:h-56 md:w-56 rotate-[45deg] bg-pink-400 opacity-30 blur-3xl rounded-3xl"></div>

        {children}
      </div>
      {/** -------- right side for illustration ---------------- */}
      <div className="relative hidden md:flex items-center justify-center overflow-hidden my-3 bg-gradient-to-tl from-[#7e57c2]/80 to-[#512da8]/90 rounded-l-2xl">
        {/* abstract blur shapes */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#9575cd]/20 rounded-full blur-3xl animate-pulse"></div>

        {/* main content */}
        <div className="relative z-10 max-w-md text-center p-6">
          <h2 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
            Welcome to <span className="text-[var(--accent)]">JustConnect</span>
          </h2>
          <p className="mt-4 text-base md:text-lg opacity-90 font-light leading-relaxed">
            Secure. Fast. Professional. Join thousands of users who trust us
            every day.
          </p>
          <img
            src={illustrationImg}
            alt="Illustration"
            className="mt-8 max-w-xs w-full mx-auto drop-shadow-2xl animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
