/**
 * @description reusable button
 */

const Button = ({ children, type = "button", disabled = false, ...props }) => {
  return (
    <button
      tabIndex={1}
      type={type}
      disabled={disabled}
      {...props}
      className={`p-3 border border-gray-100 text-base text-center tracking-wider duration-500 rounded-full shadow-2xl w-full 
        ${
          disabled
            ? "bg-gray-300 cursor-not-allowed opacity-70"
            : "bg-gradient-to-b from-brand to-brand/80 hover:bg-brand/90 cursor-pointer text-white"
        }`}
    >
      {children}
    </button>
  );
};

export default Button;
