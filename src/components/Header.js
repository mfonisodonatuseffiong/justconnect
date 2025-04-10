import React from 'react';
import './Header.css';
import planeImage from '../assets/just.jpg';
import BackToTop from './BackToTop';

const Header = () => {
  return (
    <header id="header" className="header">
      <div className="header-content">
        <div className="header-image">
          <img src={planeImage} alt="JustConnect" className="floating" />
        </div>
        <div className="header-text">
          <h1>Welcome to <span className="highlight">JustConnect</span> Services</h1>
          <p>Connecting you with top-notch service professionals for all your needs. Your satisfaction is our mission.</p>
          <div className="header-buttons">
            <button className="btn">Get Started</button>
            <button className="btn">Learn More</button>
          </div>
        </div>
      </div>
      <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
      <BackToTop />
    </header>
  );
}

export default Header;
