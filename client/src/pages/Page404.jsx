/**
 * @description A 404 error page displayed when user enters a wrong URL
 * @returns {JSX.Element} A full-screen page showing "404 - Page Not Found"
 */

import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 to-black text-center text-white px-4">
      <Motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-8xl font-extrabold tracking-widest text-gray-100"
      >
        404
      </Motion.h1>

      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-4 text-lg text-gray-400"
      >
        Oops! The page you’re looking for doesn’t exist.
      </Motion.p>

      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="inline-block px-6 py-3 text-sm font-medium text-black bg-white rounded-full shadow-md hover:bg-gray-200 transition"
        >
          Back to Home
        </Link>
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ delay: 1, duration: 1.5 }}
        className="absolute bottom-6 text-xs text-gray-600"
      >
        Error Code: 404 — Page Not Found
      </Motion.div>
    </div>
  );
};

export default PageNotFound;
