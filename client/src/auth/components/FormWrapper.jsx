/**
 * @description: This is reuseable form wrapper for all auth pages
 *               Sets the title, subtitle and error msgs are displayed statically on top of the form page
 *               useEffect will clear the error message on every page reload or page navigation
 */


import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

const FormWrapper = ({ children, title, subtitle, error }) => {
  const { setError } = useAuthStore();
  // clear all previous error messages
  useEffect(() => {
    setError(null);
  }, [setError]);


  return (
    <div className="w-full max-w-md z-10">
      <h2 className="font-bold text-2xl mb-2">{title}</h2>
      <p className="text-base mb-6 text-gray-400">{subtitle}</p>

      {/* Error message at the top */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-200 text-red-600 p-3 py-6 shadow-2xs text-base">
          {error}
        </div>
      )}

      {children}
    </div>
  );
};

export default FormWrapper;
