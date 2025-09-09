/**
 * @description reusable button
 */

const Button = ({ children, type = "button", props }) => {
  return (
    <button
      type={type}
      {...props}
      className="bg-radial cursor-pointer from-[#ff6f61] to-[#ff6e6167] p-3 hover:from-[#e75648] text-base text-center transition-colors tracking-wider duration-500 rounded-full shadow-2xl w-full"
    >
      {children}
    </button>
  );
};

export default Button;
