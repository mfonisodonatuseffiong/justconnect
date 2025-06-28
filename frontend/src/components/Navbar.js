import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AuthContext from "../context/AuthContext"; // Import authentication context

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleScroll = (event) => {
    event.preventDefault();
    const targetId = event.target.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }

    setIsOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="navbar">
      <div className="logo">JustConnect</div>
      <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><a href="#header" onClick={handleScroll}>Home</a></li>
        <li className="services-menu">
          <a href="#services" onClick={toggleDropdown}>Services</a>
          <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
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
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        
        {/* Authentication Links */}
        {user ? (
          <>
            {user.role === "user" ? (
              <li><Link to="/user-dashboard">User Dashboard</Link></li>
            ) : (
              <li><Link to="/professional-dashboard">Professional Dashboard</Link></li>
            )}
            <li><button className="logout-btn" onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>

      {isOpen && (
        <div className="mobile-menu">
          <button className="close-btn" onClick={toggleMenu}>&times;</button>
          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li className="services-menu">
              <a href="#services" onClick={toggleDropdown}>Services</a>
              <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
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
            <li><a href="#about" onClick={toggleMenu}>About</a></li>
            <li><a href="#contact" onClick={toggleMenu}>Contact</a></li>
            
            {/* Mobile Authentication Links */}
            {user ? (
              <>
                {user.role === "user" ? (
                  <li><Link to="/user-dashboard" onClick={toggleMenu}>User Dashboard</Link></li>
                ) : (
                  <li><Link to="/professional-dashboard" onClick={toggleMenu}>Professional Dashboard</Link></li>
                )}
                <li><button className="logout-btn" onClick={logout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                <li><Link to="/signup" onClick={toggleMenu}>Signup</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
