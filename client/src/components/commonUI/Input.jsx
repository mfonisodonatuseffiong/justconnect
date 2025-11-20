/**
 * @description This is the input reuseable component to accept user input
 * @returns A component that takes  in props like label value placeholder etc
 */

import { User, Lock, MailIcon, EyeClosedIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const Input = ({ label, type, placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  /** function to toggle visibility */
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <label tabIndex={-1} className="block text-sm mb-2" htmlFor={props.name}>
        {label}
      </label>

      {/** icon */}
      <span
        tabIndex={-1}
        className="absolute bottom-3.5 left-3 text-gray-400 z-10"
      >
        {type === "name" && <User size={18} />}
        {type === "password" && <Lock size={18} />}
        {type === "email" && <MailIcon size={18} />}
      </span>

      {/** password visibility */}
      <span className="absolute right-2 top-11 text-gray-400 z-10">
        <button tabIndex={-1} type="button" onClick={toggleVisibility}>
          {type === "password" &&
            (showPassword ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeClosedIcon size={16} />
            ))}
        </button>
      </span>

      {/**input field */}
      <input
        tabIndex={1}
        id={props.name}
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        className={`w-full py-3 pl-9 pr-4 rounded-md focus:outline-none hover:shadow-md bg-white/90 placeholder:text-gray-400 text-sm md:text-md text-gray-900`}
        {...props}
      />
    </div>
  );
};

export default Input;
