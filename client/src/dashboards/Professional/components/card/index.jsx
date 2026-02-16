// src/components/card/index.jsx

export const Card = ({ children, className }) => (
  <div
    className={`bg-white/90 rounded-2xl shadow-lg border border-rose-200 
                hover:shadow-xl transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-3 border-b border-orange-100 pb-2">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg font-bold text-orange-600">{children}</h3>
);

export const CardContent = ({ children }) => (
  <div className="text-slate-700">{children}</div>
);
