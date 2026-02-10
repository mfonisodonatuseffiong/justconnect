/**
 * @description Reusable input component with optional icons and password toggle
 */

import { User, Lock, MailIcon, EyeClosedIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  /** Toggle password visibility */
  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Decide input type
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm mb-2 text-slate-700 font-medium"
        >
          {label}
        </label>
      )}

      {/* Left icon */}
      <span className="absolute bottom-3.5 left-3 text-gray-400 z-10 pointer-events-none">
        {type === "name" && <User size={18} />}
        {type === "password" && <Lock size={18} />}
        {type === "email" && <MailIcon size={18} />}
      </span>

      {/* Password visibility toggle */}
      {type === "password" && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 bottom-3 text-gray-400 z-10"
        >
          {showPassword ? <EyeOffIcon size={16} /> : <EyeClosedIcon size={16} />}
        </button>
      )}

      {/* Input field */}
      <input
        id={name}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`w-full py-3 pl-9 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white placeholder:text-gray-400 text-sm md:text-md text-gray-900 ${className}`}
      />
    </div>
  );
};

export default Input;
