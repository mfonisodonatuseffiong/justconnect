/**
 * @description This page is shown when a user tries to access a route they’re not authorized for
 * @returns {JSX.Element} A modern "Unauthorized Access" page
 */

import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white px-4 text-center">
      <Motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-7xl font-extrabold text-red-500 mb-4"
      >
        403
      </Motion.h1>

      <Motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl font-semibold"
      >
        Unauthorized Access
      </Motion.h2>

      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-3 text-gray-400 max-w-md"
      >
        Sorry, you don’t have permission to view this page. If you believe this
        is a mistake, please contact your administrator.
      </Motion.p>

      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="inline-block px-6 py-3 text-sm font-medium text-black bg-white rounded-full shadow-md hover:bg-gray-200 transition"
        >
          Go Back Home
        </Link>
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.1, y: 0 }}
        transition={{ delay: 1.2, duration: 1.5 }}
        className="absolute bottom-6 text-xs text-gray-600"
      >
        Error Code: 403 — Unauthorized Access
      </Motion.div>
    </div>
  );
};

export default UnauthorizedPage;
