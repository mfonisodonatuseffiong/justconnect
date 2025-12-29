/**
 * @description: Services component
 *              Displays a list of services fetched from backend
 *              Includes a button/link to explore all services
 *              Each service card has a "View Professionals" button
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../../service/servicesService";
import { Wrench, Paintbrush, Plug, Hammer, Home } from "lucide-react";

const iconMap = {
  Plumbing: <Wrench className="w-8 h-8 text-orange-600" />,
  Electrical: <Plug className="w-8 h-8 text-orange-600" />,
  Painting: <Paintbrush className="w-8 h-8 text-orange-600" />,
  Carpentry: <Hammer className="w-8 h-8 text-orange-600" />,
  "Home Renovation": <Home className="w-8 h-8 text-orange-600" />,
};

const OurServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      // Ensure we always have an array
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="bg-orange-50 text-slate-800 py-30 clip-slant">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-slate-800" data-aos="zoom-out">
          Our <span className="text-orange-600">Services</span>
        </h2>
        <p
          className="mb-12 max-w-2xl mx-auto text-slate-600"
          data-aos="zoom-up"
        >
          We connect clients with verified professionals for all kinds of artisan jobs.
        </p>

        {loading ? (
          <p className="text-center text-slate-500">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-slate-500">No services available.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={service.id || index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="500"
                data-aos-easing="ease-in-out"
                className="bg-white p-6 rounded-2xl shadow-md border border-orange-200 hover:shadow-lg transition-all duration-500 ease-in-out hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  {iconMap[service.name] || (
                    <Home className="w-8 h-8 text-orange-600" />
                  )}
                </div>
                <h3 className="text-lg text-slate-700 font-semibold mb-2">
                  {service.name || "Unnamed Service"}
                </h3>
                <p className="opacity-75 text-slate-600 text-sm mb-4">
                  {service.description || "No description available."}
                </p>

                {/* Button to View Professionals */}
                <Link
                  to={`/user-dashboard/bookings/new?service=${service.id}`}
                  className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  View Professionals
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* View All Services link */}
        <div className="mt-8">
          <Link
            to="/explore-services"
            className="text-orange-600 font-semibold hover:underline"
            data-aos="fade-up"
            data-aos-delay={(services.length || 5) * 100}
            data-aos-duration="500"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
