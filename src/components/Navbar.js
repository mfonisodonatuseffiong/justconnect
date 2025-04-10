import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">JustConnect</div>
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li className="services-menu">
          <a href="#services" onClick={toggleDropdown}>Services</a>
          <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            <li><a href="#plumbing">Plumbing</a></li>
            <li><a href="#tailoring">Tailoring</a></li>
            <li><a href="#electrical">Electrical</a></li>
            <li><a href="#cleaning">Cleaning</a></li>
            <li><a href="#gardening">Gardening</a></li>
            <li><a href="#hvac">Air Conditioning</a></li>
            <li><a href="#carpenter">Carpentry</a></li>
            <li><a href="#painting">Painting</a></li>
            <li><a href="#tech-support">Tech Support</a></li>
            <li><a href="#tutors">Tutors</a></li>
          </ul>
        </li>
        <li><Link to="#about">About</Link></li>
        <li><Link to="#contact">Contact</Link></li>
        {/* Dashboard Links */}
        <li><Link to="/user-dashboard">User Dashboard</Link></li>
        <li><Link to="/professional-dashboard">Professional Dashboard</Link></li>
      </ul>
      {isOpen && (
        <div className="mobile-menu">
          <button className="close-btn" onClick={toggleMenu}>&times;</button>
          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li className="services-menu">
              <a href="#services" onClick={toggleDropdown}>Services</a>
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <li><a href="#plumbing" onClick={toggleMenu}>Plumbing</a></li>
                <li><a href="#tailoring" onClick={toggleMenu}>Tailoring</a></li>
                <li><a href="#electrical" onClick={toggleMenu}>Electrical</a></li>
                <li><a href="#cleaning" onClick={toggleMenu}>Cleaning</a></li>
                <li><a href="#gardening" onClick={toggleMenu}>Gardening</a></li>
                <li><a href="#hvac" onClick={toggleMenu}>Air Conditioning</a></li>
                <li><a href="#carpenter" onClick={toggleMenu}>Carpentry</a></li>
                <li><a href="#painting" onClick={toggleMenu}>Painting</a></li>
                <li><a href="#tech-support" onClick={toggleMenu}>Tech Support</a></li>
                <li><a href="#tutors" onClick={toggleMenu}>Tutors</a></li>
              </ul>
            </li>
            <li><Link to="#about" onClick={toggleMenu}>About</Link></li>
            <li><Link to="#contact" onClick={toggleMenu}>Contact</Link></li>
            {/* Mobile Dashboard Links */}
            <li><Link to="#user-dashboard" onClick={toggleMenu}>User Dashboard</Link></li>
            <li><Link to="#professional-dashboard" onClick={toggleMenu}>Professional Dashboard</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
