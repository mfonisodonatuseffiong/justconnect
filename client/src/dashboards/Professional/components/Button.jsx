/**
 * @description A reusable button
 */

const base =
  "px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2";

const variants = {
  primary: "bg-brand text-white hover:bg-brand/80",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
