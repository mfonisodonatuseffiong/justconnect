/**
 * @description This is a component that displays a loading state of a button
 *              - Takes in props, [loading name]
 * @usage    - Mostly for all auth pages
 */

const ButtonLoader = ({ text }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="h-5 w-5 border-4 border-t-transparent border-brand rounded-full animate-spin"></div>
      <span className="text-sm text-brand animate-pulse">{text}</span>
    </div>
  );
};
export default ButtonLoader;
