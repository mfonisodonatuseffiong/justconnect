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
      <label className="block text-sm mb-2" htmlFor={props.name}>
        {label}
      </label>

      {/** icon */}
      <span className="absolute left-5 top-9 text-gray-500 z-10">
        {type === "name" && <User size={20} />}
        {type === "password" && <Lock size={20} />}
        {type === "email" && <MailIcon size={20} />}
      </span>

      {/** password visibility */}
      <span className="absolute right-2 top-10 text-gray-500 z-10">
        <button type="button" onClick={toggleVisibility}>
          {type === "password" &&
            (showPassword ? (
              <EyeOffIcon size={20} />
            ) : (
              <EyeClosedIcon size={20} />
            ))}
        </button>
      </span>

      {/**input field */}
      <input
        id={props.name}
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        className={`w-full py-2 px-12 rounded-full focus:outline-none hover:shadow-md bg-white/90 placeholder:text-gray-700 text-gray-900`}
        {...props}
      />
    </div>
  );
};

export default Input;
