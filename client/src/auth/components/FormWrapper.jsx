/**
 * @description: Reusable form wrapper for all auth pages
 *               Displays title, subtitle, and error messages
 *               Styled to match the light + orange dashboard theme
 */

import { motion } from "framer-motion";

const FormWrapper = ({ children, title, subtitle, error }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-lg bg-white border border-orange-200 rounded-2xl shadow-xl p-8"
    >
      {/* Title */}
      <h2 className="font-bold text-2xl text-slate-800">{title}</h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 mb-6 text-base text-slate-500">
          {subtitle}
        </p>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm shadow-sm">
          {error}
        </div>
      )}

      {/* Form content */}
      {children}
    </motion.div>
  );
};

export default FormWrapper;
