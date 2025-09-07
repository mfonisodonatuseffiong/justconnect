import React from "react";

const Formwrapper = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-md z-10">
      <h2 className="font-bold text-2xl mb-4"> {title} </h2>
      <p className="text- base mb-6 text-gray-400"> {subtitle} </p>
      {children}
    </div>
  );
};

export default Formwrapper;
