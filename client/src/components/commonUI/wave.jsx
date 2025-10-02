/**
 * @description This is a reuseable wavy component
 * @args Takes there arguments
 *       - Height
 *       - Color 1 + 2 + 3
 * @returns component
 */

const Wave = ({
  className = "",
  color1 = "bg-blue-400",
  color2 = "bg-blue-500",
  color3 = "bg-blue-600",
  height = "h-32",
}) => {
  return (
    <div className={`relative w-full overflow-hidden ${height} ${className}`}>
      {/* Layer 1 */}
      <svg
        className="absolute bottom-0 w-full animate-wave1"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          className={color1}
          d="M0,160 C360,200 1080,120 1440,160 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Layer 2 */}
      <svg
        className="absolute bottom-0 w-full animate-wave2"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          className={color2}
          d="M0,200 C360,160 1080,240 1440,200 L1440,320 L0,320 Z"
        />
      </svg>

      {/* Layer 3 */}
      <svg
        className="absolute bottom-0 w-full animate-wave3"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          className={color3}
          d="M0,180 C360,220 1080,100 1440,180 L1440,320 L0,320 Z"
        />
      </svg>
    </div>
  );
};

export default Wave;
