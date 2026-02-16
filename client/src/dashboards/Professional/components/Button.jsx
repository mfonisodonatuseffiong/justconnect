/**
 * @description A reusable button styled with rose + amber brand colors
 */

const base =
  "px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2";

const variants = {
  primary: "bg-rose-600 text-white hover:bg-rose-700",
  outline: "border border-amber-500 text-amber-600 hover:bg-amber-50",
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
