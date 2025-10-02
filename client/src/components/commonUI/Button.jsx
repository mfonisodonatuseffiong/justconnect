/**
 * @description reusable button
 */

const Button = ({ children, type = "button", props }) => {
  return (
    <button
      tabIndex={1}
      type={type}
      {...props}
      className="bg-radial cursor-pointer focus:outline-0 from-[#ff6f61] to-[#e7572267] p-4 hover:from-[#ce4c40] border border-gray-400 text-base text-center transition-colors tracking-wider duration-500 rounded-full shadow-2xl w-full"
    >
      {children}
    </button>
  );
};

export default Button;
