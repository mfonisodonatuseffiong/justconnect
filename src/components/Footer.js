import React from 'react';
import './Footer.css';
import facebookIcon from '../assets/icons/facebook.png';
import twitterIcon from '../assets/icons/twitter.png';
import instagramIcon from '../assets/icons/instagram.png';
import linkedinIcon from '../assets/icons/linkedin.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-section logo">
          <h2>JustConnect</h2>
          <p>Connecting you to the best services around. Your success is our priority.</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section social-media">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section newsletter">
          <h2>Newsletter</h2>
          <form>
            <input type="email" placeholder="Enter your email" aria-label="Email Address" />
            <button type="submit">Subscribe Now</button>
          </form>
        </div>
      </div>
      <hr className="divider" />
      <div className="footer-bottom">
        <b>&copy; 2025 JustConnect. All Rights Reserved.</b><br />
        <b>Designed by Mfoniso Donatus | Powered by DonaTech</b>
      </div>
    </footer>
  );
};

export default Footer;
