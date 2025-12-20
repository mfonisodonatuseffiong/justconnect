// client/src/components/Card.jsx
export function Card({ children, className = "" }) {
    return (
      <div className={`bg-white rounded-2xl shadow-md p-4 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children, className = "" }) {
    return <div className={`mb-2 font-semibold text-gray-700 ${className}`}>{children}</div>;
  }
  
  export function CardTitle({ children, className = "" }) {
    return <h3 className={`text-lg font-bold ${className}`}>{children}</h3>;
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`text-gray-600 ${className}`}>{children}</div>;
  }
  