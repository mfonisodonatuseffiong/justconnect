// src/components/BackToTop.js
import React, { useState, useEffect } from 'react';
import './BackToTop.css'; // Ensure you have this file to include CSS

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    const header = document.getElementById('header');
    if (header) {
      header.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div
      className={`back-to-top ${isVisible ? 'visible' : 'hidden'}`}
      onClick={scrollToTop}
    >
      <i className="arrow-up">↑</i> {/* Arrow pointing up */}
    </div>
  );
};

export default BackToTop;
