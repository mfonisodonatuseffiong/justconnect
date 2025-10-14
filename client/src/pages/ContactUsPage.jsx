/**
 * @description Complete "Contact Us" page with a banner, form, and contact info
 */

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Facebook, Instagram } from "lucide-react";
import PageBanner from "../components/commonUI/PageBanner";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  // social media links
  const socialLinks = [
    {
      icon: <Facebook />,
      link: "#",
      title: "facebook",
    },
    {
      icon: <Instagram />,
      link: "#",
      title: "Instagram",
    },
  ];

  // contact support details
  const supportDeatils = [
    {
      icon: <Mail />,
      text: "support@justconnect.com",
    },
    {
      icon: <Phone />,
      text: "+234 800 123 4567",
    },
    {
      icon: <MapPin />,
      text: "Uyo, Nigeria.",
    },
  ];

  return (
    <div className="min-h-screen mt-[7rem] px-2 pb-20">
      {/* ======= Banner ======= */}
      <PageBanner
        title="Contact Us"
        subtitle="We’d love to hear from you! Reach out for inquiries, feedback, or support."
      />

      {/* ======= Contact Section ======= */}
      <section className="max-w-6xl mx-auto px-2 lg:px-12 mt-16 grid md:grid-cols-2 gap-10">
        {/* === Left Form === */}
        <div
          className="bg-white shadow-xl rounded-2xl p-8 md:p-10 border border-gray-100"
          data-aos="zoom-in"
        >
          <h2 className="text-2xl font-bold text-brand mb-6">Send a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transition"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transition"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-accent hover:bg-accent/90"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && <Send size={18} />}
            </button>
          </form>
        </div>

        {/* === Right Contact Info ==== */}
        <div
          className="flex flex-col justify-center bg-gradient-to-br from-brand/10 to-accent/10 rounded-2xl p-8 md:p-10 text-brand"
          data-aos="fade-up"
        >
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          <p className="text-gray-700 mb-8">
            Have a question or need help? Our team is ready to assist you. Reach
            out to us anytime — we typically respond within 24 hours.
          </p>

          <ul className="space-y-4 text-gray-800">
            {supportDeatils.map((n) => (
              <li key={n.text} className="flex items-center gap-3 text-accent">
                {n.icon}
                <span className="text-primary-gray">{n.text} </span>
              </li>
            ))}
          </ul>

          {/** ===  social media platforms ==== */}
          <div className="mt-10">
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <div className="flex gap-4 text-accent">
              {socialLinks.map((n) => (
                <a
                  href={n.link}
                  key={n.title}
                  title={n.title}
                  className="hover:text-brand transition"
                >
                  {n.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
