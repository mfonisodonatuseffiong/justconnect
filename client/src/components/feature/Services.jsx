/**
 * @description: Services component Display a litle of our services and a button to explore our services
 */

import { Wrench, Paintbrush, Plug, Hammer, Home } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Plumbing",
    description:
      "Expert plumbers available for installations, repairs, and maintenance.",
    icon: <Wrench className="w-8 h-8 text-[var(--accent)]" />,
  },
  {
    title: "Electrical",
    description:
      "Certified electricians for wiring, lighting, and electrical repairs.",
    icon: <Plug className="w-8 h-8 text-[var(--accent)]" />,
  },
  {
    title: "Painting",
    description: "Professional painters to give your space a fresh new look.",
    icon: <Paintbrush className="w-8 h-8 text-[var(--accent)]" />,
  },
  {
    title: "Carpentry",
    description:
      "Skilled carpenters for furniture, fittings, and home projects.",
    icon: <Hammer className="w-8 h-8 text-[var(--accent)]" />,
  },
  {
    title: "Home Renovation",
    description:
      "Full-service renovation teams to transform your living space.",
    icon: <Home className="w-8 h-8 text-[var(--accent)]" />,
  },
];

const OurServices = () => {
  return (
    <section className="bg-gray-50 text-brand py-30 clip-slant">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4" data-aos="zoom-out">
          Our <span className="text-accent">Services</span>
        </h2>
        <p
          className="mb-12 max-w-2xl mx-auto text-primary-gray"
          data-aos="zoom-up"
        >
          We connect clients with verified professionals for all kinds of
          artisan jobs.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="500"
              data-aos-easing="ease-in-out"
              className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 ease-in-out hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-lg text-primary-gray font-semibold mb-2">
                {service.title}
              </h3>
              <p className="opacity-75 text-primary-gray text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* View All Services link */}
        <div className="mt-8">
          <Link
            to="/explore-services"
            className="text-accent font-semibold hover:underline"
            data-aos="fade-up"
            data-aos-delay={services.length * 100}
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
