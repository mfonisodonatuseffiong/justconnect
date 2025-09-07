/**
 * @description: Services component
 */

import { Wrench, Paintbrush, Plug, Hammer, Home } from "lucide-react";

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
    <section className="services py-16 text-[var(--primary)]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Our <span className="text-[var(--accent)]">Services</span>
        </h2>
        <p className="text-secondary mb-12 max-w-2xl mx-auto">
          We connect clients with verified professionals for all kinds of
          artisan jobs.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-secondary text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
