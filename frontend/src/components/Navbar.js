import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeMenu = () => setIsOpen(false);

  const isLoggedIn = user && user.token;

  return (
    <nav className="navbar">
      <div className="logo">JustConnect</div>
      <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/#header" onClick={closeMenu}>Home</Link></li>
        <li className="services-menu">
          <Link to="/#services" onClick={() => { toggleDropdown(); closeMenu(); }}>Services</Link>
          <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
            <li><Link to="/plumbers" onClick={closeMenu}>Plumbing</Link></li>
            <li><Link to="/tailors" onClick={closeMenu}>Tailoring</Link></li>
            <li><Link to="/electricians" onClick={closeMenu}>Electrical</Link></li>
            <li><Link to="/cleaning" onClick={closeMenu}>Cleaning</Link></li>
            <li><Link to="/gardening" onClick={closeMenu}>Gardening</Link></li>
            <li><Link to="/hvac" onClick={closeMenu}>Air Conditioning</Link></li>
            <li><Link to="/carpentry" onClick={closeMenu}>Carpentry</Link></li>
            <li><Link to="/painting" onClick={closeMenu}>Painting</Link></li>
            <li><Link to="/tech-support" onClick={closeMenu}>Tech Support</Link></li>
            <li><Link to="/tutors" onClick={closeMenu}>Tutors</Link></li>
          </ul>
        </li>
        <li><Link to="/#about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/#contact" onClick={closeMenu}>Contact</Link></li>

        {isLoggedIn ? (
          <>
            {user.role === "user" ? (
              <li><Link to="/user-dashboard" onClick={closeMenu}>User Dashboard</Link></li>
            ) : (
              <li><Link to="/professional-dashboard" onClick={closeMenu}>Professional Dashboard</Link></li>
            )}
            <li><button className="logout-btn" onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
            <li><Link to="/signup" onClick={closeMenu}>Signup</Link></li>
          </>
        )}
      </ul>

      {isOpen && (
        <div className="mobile-menu">
          <button className="close-btn" onClick={toggleMenu}>&times;</button>
          <ul className="mobile-nav-links">
            <li><Link to="/#header" onClick={toggleMenu}>Home</Link></li>
            <li className="services-menu">
              <Link to="/#services" onClick={toggleMenu}>Services</Link>
              <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                <li><Link to="/plumbers" onClick={toggleMenu}>Plumbing</Link></li>
                <li><Link to="/tailors" onClick={toggleMenu}>Tailoring</Link></li>
                <li><Link to="/electricians" onClick={toggleMenu}>Electrical</Link></li>
                <li><Link to="/cleaning" onClick={toggleMenu}>Cleaning</Link></li>
                <li><Link to="/gardening" onClick={toggleMenu}>Gardening</Link></li>
                <li><Link to="/hvac" onClick={toggleMenu}>Air Conditioning</Link></li>
                <li><Link to="/carpentry" onClick={toggleMenu}>Carpentry</Link></li>
                <li><Link to="/painting" onClick={toggleMenu}>Painting</Link></li>
                <li><Link to="/tech-support" onClick={toggleMenu}>Tech Support</Link></li>
                <li><Link to="/tutors" onClick={toggleMenu}>Tutors</Link></li>
              </ul>
            </li>
            <li><Link to="/#about" onClick={toggleMenu}>About</Link></li>
            <li><Link to="/#contact" onClick={toggleMenu}>Contact</Link></li>

            {isLoggedIn ? (
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
