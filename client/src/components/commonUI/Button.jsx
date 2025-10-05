/**
 * @description reusable button
 */

const Button = ({ children, type = "button", props }) => {
  return (
    <button
      tabIndex={1}
      type={type}
      {...props}
      className="bg-gradient-to-b from-brand to-brand/80 hover:opacity-75 cursor-pointer focus:outline-0 p-4 border border-gray-100 text-base text-center transition-colors text-white tracking-wider duration-500 rounded-full shadow-2xl w-full"
    >
      {children}
    </button>
  );
};

export default Button;
