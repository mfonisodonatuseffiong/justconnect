import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does this platform work?",
    answer:
      "Clients can post jobs and connect with verified professionals. Professionals can showcase their skills and get hired for artisan services.",
  },
  {
    question: "Is there a fee to join?",
    answer:
      "Creating an account is free. Service charges may apply when transactions are completed between clients and professionals.",
  },
  {
    question: "How do I find a professional?",
    answer:
      "Browse services, filter by category, and directly connect with professionals in your area.",
  },
  {
    question: "Are the professionals verified?",
    answer:
      "Yes, we carefully verify professionals to ensure safety, trust, and quality service for all clients.",
  },
  {
    question: "Can I post multiple jobs?",
    answer:
      "Absolutely! You can post as many jobs as you like and manage them from your dashboard.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq py-16 text-gray-700">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked <span className="text-[var(--accent)]">Questions</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-lg font-medium">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[var(--accent)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary" />
                )}
              </button>

              {openIndex === index && (
                <p className="mt-4 text-secondary text-sm">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
