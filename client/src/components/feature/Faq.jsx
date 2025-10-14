/**
 * @description Reuseable FAQ components that accepts array to be displayed
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = ({ faqs = [], showTitle = true }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq py-16 text-brand">
      <div className="max-w-4xl mx-auto px-2 md:px-6">
        {showTitle && (
          <h2 className="text-4xl font-bold text-center mb-8" data-aos="zoom">
            Frequently Asked <span className="text-accent">Questions</span>
          </h2>
        )}

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition duration-300`}
              data-aos="fade-up" // Animate on scroll
              data-aos-delay={index * 100} // Stagger each FAQ by 100ms
              data-aos-duration="500" // Animation duration in ms
              data-aos-easing="ease-in-out" // Easing function
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex justify-between items-center text-left"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-accent" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {openIndex === index && (
                <p className="mt-4 px-4 pb-4 text-sm md:text-base text-primary-gray">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* navigate to faq page */}
      <div className="mt-8 text-center">
        <Link
          to="/faqs"
          className="text-accent font-semibold hover:underline"
          data-aos="fade-up"
        >
          View All FAQS
        </Link>
      </div>
    </section>
  );
};

export default FAQ;
