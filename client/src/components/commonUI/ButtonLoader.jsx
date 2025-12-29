/**
 * @description This is a component that displays a loading state of a button
 *              - Takes in props, [loading name]
 * @usage    - Mostly for all auth pages
 */

const ButtonLoader = ({ text }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      {/* Spinner */}
      <div className="h-5 w-5 border-4 border-t-transparent border-orange-500 rounded-full animate-spin"></div>
      
      {/* Loading Text */}
      <span className="text-sm text-orange-600 animate-pulse">{text}</span>
    </div>
  );
};

export default ButtonLoader;
