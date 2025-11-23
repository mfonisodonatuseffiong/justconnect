/**
 * @description A reuseable card component for the professional overview page
 */

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-primary-gray border border-white rounded-2xl shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children }) => (
  <div className="mb-3 text-white">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const CardContent = ({ children }) => <div>{children}</div>;
