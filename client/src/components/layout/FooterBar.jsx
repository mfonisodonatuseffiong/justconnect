/**
 * @description Footer component for all unauthenticated pages.
 */

import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  // Quick Links data
  const quickLinks = [
    { name: "Find Artisan", to: "/explore-services" },
    { name: "Join as Artisan", to: "/auth/register" },
    { name: "About Us", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  // Resources data
  const resources = [
    { name: "FAQs", to: "/faqs" },
    { name: "Support", to: "/contact-us" },
    { name: "Privacy Policy", to: "/privacy" },
    { name: "Terms of Service", to: "/terms" },
  ];

  // Social icons data
  const socialLinks = [
    { icon: <Facebook size={22} />, href: "#" },
    { icon: <Twitter size={22} />, href: "#" },
    { icon: <Linkedin size={22} />, href: "#" },
    { icon: <Instagram size={22} />, href: "#" },
  ];

  return (
    <footer className="relative bg-primary-gray py-16 px-4 md:px-16">
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 py-10 pb-30">
        {/* ======= Logo + About ============ */}
        <div>
          <Link to="/">
            <div>
              <img
                src="/logo.png"
                alt="JustConnect Logo"
                className="h-auto w-40 object-cover"
              />
            </div>
          </Link>
          <p className="text-sm w-1/4 md:w-1/2 mt-6 leading-relaxed">
            Connecting clients with verified and trusted artisans for all your
            home and business needs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-accent">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.to} className="hover:text-accent">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4 text-accent">Resources</h3>
          <ul className="space-y-2 text-sm">
            {resources.map((res, idx) => (
              <li key={idx}>
                <Link to={res.to} className="hover:text-accent">
                  {res.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-4 text-accent">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            {socialLinks.map((social, idx) => (
              <a key={idx} href={social.href} className="hover:text-accent">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute left-0 bottom-0  w-full border-t pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} JustConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
