/**
 * @description reusable button
 */

const Button = ({ children, type = "button", props }) => {
  return (
    <button
      type={type}
      {...props}
      className="bg-radial cursor-pointer from-purple-300 p-4 hover:from-purple-600 text-base text-center transition-colors tracking-wider duration-500 rounded-full shadow-2xl w-full"
    >
      {children}
    </button>
  );
};

export default Button;
