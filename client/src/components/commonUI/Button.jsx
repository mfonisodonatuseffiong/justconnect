/**
 * @description reusable button
 *              Styled to match the light + orange system theme
 */

const Button = ({ children, type = "button", disabled = false, ...props }) => {
  return (
    <button
      tabIndex={1}
      type={type}
      disabled={disabled}
      {...props}
      className={`
        w-full rounded-xl px-6 py-3 text-base font-semibold tracking-wide
        transition-all duration-200 shadow-md
        border
        ${
          disabled
            ? "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
            : "bg-orange-500 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600 active:scale-[0.98]"
        }
      `}
    >
      {children}
    </button>
  );
};

export default Button;
