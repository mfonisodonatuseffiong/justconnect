/**
 * @desc Footer component with lucide-react icons
 * @returns Footer bar
 */
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + About */}
        <div className="space-y-3">
          <Link to="/">
            <h2 className="text-xl sm:text-2xl md:text-2xl uppercase mb-3 hover:-translate-y-1.5 transition-all duration-500 font-semibold">
              <span className="text-highlight">J</span>ustConnect
            </h2>
            {/* <img src="/logo.png" alt="Techin logo" className="w-28" /> */}
          </Link>
          <p className="text-sm leading-relaxed text-gray-300">
            Connecting clients with verified and trusted artisans for all your
            home and business needs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/explore" className="hover:text-[#ff6f61]">
                Find Artisan
              </Link>
            </li>
            <li>
              <Link to="/auth/register" className="hover:text-[#ff6f61]">
                Join as Artisan
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#ff6f61]">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#ff6f61]">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/faq" className="hover:text-[#ff6f61]">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-[#ff6f61]">
                Support
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-[#ff6f61]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#ff6f61]">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-[#ff6f61]">
              <Facebook size={22} />
            </a>
            <a href="#" className="hover:text-[#ff6f61]">
              <Twitter size={22} />
            </a>
            <a href="#" className="hover:text-[#ff6f61]">
              <Linkedin size={22} />
            </a>
            <a href="#" className="hover:text-[#ff6f61]">
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-400 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Techin. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
