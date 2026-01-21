// src/components/feature/FAQ.jsx
/**
 * @desc FAQ Section – Responsive & Clean Design
 *       With fade-up scroll animation (same as Testimonial section)
 */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does JustConnect work?",
    answer:
      "JustConnect connects you with trusted, verified artisans in your area. Browse professionals, view ratings and reviews, book a service, and pay securely — all in one place.",
  },
  {
    question: "Are the artisans verified?",
    answer:
      "Yes. Every artisan goes through ID checks, skill assessments, and background reviews before approval.",
  },
  {
    question: "How do I book a service?",
    answer:
      "Browse or search for the service you need, choose a professional, select a date and time, and confirm your booking.",
  },
  {
    question: "Is there a booking fee?",
    answer:
      "No hidden fees. You only pay the agreed price with your chosen artisan. JustConnect is free for customers.",
  },
  {
    question: "Can I read reviews before booking?",
    answer:
      "Yes. Every professional has real reviews, ratings, and photos of past work to help you decide.",
  },
  {
    question: "What if I need to cancel or reschedule?",
    answer:
      "You can cancel or reschedule up to 24 hours before the appointment at no charge.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Payments are made directly to the artisan after the job is completed. Cash, transfer, or card may be accepted.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "JustConnect currently operates in major cities across Nigeria with plans to expand nationwide.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Use the chat in your dashboard, send a message via the app, or email support@justconnect.com.",
  },
  {
    question: "Can I become an artisan on JustConnect?",
    answer:
      "Yes. Apply through our professional portal. Once verified, you’ll get access to jobs and customers.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"  // ← Navbar "FAQ" button scrolls here
      className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/50"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div
          className="text-center mb-12 md:mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about hiring trusted artisans on JustConnect
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 md:space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group"
              data-aos="fade-up"
              data-aos-delay={150 + index * 100}  // Staggered like testimonials
              data-aos-duration="600"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-orange-100 overflow-hidden">
                {/* Question */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </h3>

                  <div>
                    {openIndex === index ? (
                      <ChevronUp size={20} className="text-orange-600" />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="text-slate-500 group-hover:text-orange-600 transition"
                      />
                    )}
                  </div>
                </button>

                {/* Answer */}
                {openIndex === index && (
                  <div className="px-4 pb-4">
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;