/**
 * @description A reusable card component for the professional overview page
 */

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white/90 rounded-2xl shadow-lg border border-rose-200 
                  hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => (
  <div className="mb-3 border-b border-amber-200 pb-2">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-bold text-rose-600">{children}</h2>
);

export const CardContent = ({ children }) => (
  <div className="text-amber-700">{children}</div>
);
