/**
 * @description - Layout wrapper for all authentication pages
 *               - Left: form content with warm branding
 *               - Right: beautiful illustration with depth & glow
 */

import { Link } from "react-router-dom";
import illustrationImg from "../../assets/hero.svg";
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-orange-50 via-white to-rose-50 overflow-hidden">
      {/* ================= Left Side: Form + Branding ================= */}
      <div className="relative flex flex-col justify-center px-8 lg:px-16 py-12">
        {/* Floating Logo - Top Left */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 left-8"
        >
          <Link to="/" aria-label="Go to homepage">
            <img
              src="/logo-white-bg.png"
              alt="JustConnect Logo"
              className="w-40 lg:w-48 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </motion.div>

        {/* Main Form Area */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-lg mx-auto"
        >
          {/* Optional tagline above form */}
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-500">
              Welcome Back
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Connect with trusted professionals in seconds
            </p>
          </div>

          {/* Form Content (Login / Register) */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-orange-200">
            {children}
          </div>
        </motion.div>

        {/* Subtle decorative blobs on left */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl" />
      </div>

      {/* ================= Right Side: Hero Illustration ================= */}
      <div className="relative hidden md:flex items-center justify-center overflow-hidden">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-400/20 via-transparent to-rose-400/20" />

        {/* Large decorative glowing orbs */}
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-rose-300/40 rounded-full blur-3xl"
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative z-10 text-center max-w-lg px-10"
        >
          {/* Title */}
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 leading-tight">
            Find & Book
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              Trusted Professionals
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-6 text-lg lg:text-xl text-slate-700 leading-relaxed font-medium">
            JustConnect brings reliable service providers right to your doorstep.
            <br />
            Fast bookings. Real-time tracking. Peace of mind.
          </p>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12"
          >
            <img
              src={illustrationImg}
              alt="JustConnect - Connecting you with trusted professionals"
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </motion.div>

          {/* Trust badge / mini testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border border-orange-100"
          >
            <p className="text-slate-700 italic">
              "Finally, an app that makes hiring professionals easy and stress-free!"
            </p>
            <p className="text-sm text-orange-600 font-semibold mt-3">— Happy Customer</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;