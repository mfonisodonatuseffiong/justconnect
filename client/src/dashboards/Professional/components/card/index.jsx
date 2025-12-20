// src/components/card/index.jsx
export const Card = ({ children, className }) => (
    <div className={`bg-white rounded-xl shadow p-4 ${className}`}>{children}</div>
  );
  export const CardHeader = ({ children }) => <div className="mb-2">{children}</div>;
  export const CardTitle = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>;
  export const CardContent = ({ children }) => <div>{children}</div>;
  