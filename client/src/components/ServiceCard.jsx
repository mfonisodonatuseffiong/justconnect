// src/components/ServiceCard.jsx
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ serviceName, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate with category in query string
    navigate(`/explore?category=${encodeURIComponent(serviceName)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center"
    >
      {icon && (
        <img
          src={icon}
          alt={serviceName}
          className="w-12 h-12 mb-4"
        />
      )}
      <h3 className="text-lg font-bold text-slate-800 text-center">
        {serviceName}
      </h3>
      <p className="text-sm text-slate-600 text-center mt-2">
        Find skilled {serviceName.toLowerCase()}s near you
      </p>
    </div>
  );
};

export default ServiceCard;
