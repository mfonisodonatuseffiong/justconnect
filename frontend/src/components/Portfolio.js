// src/components/Portfolio.js
import React from 'react';
import './Portfolio.css';
import bigImage from '../assets/big.jpg';

const Portfolio = () => {
  return (
    <section className="portfolio">
      <h2>Our Work</h2>
      <div className="portfolio-item">
        <img src={bigImage} alt="Project 1" />
        <p>Project 1 description.</p>
      </div>
      <div className="portfolio-item">
        <img src={bigImage} alt="Project 2" />
        <p>Project 2 description.</p>
      </div>
      <div className="portfolio-item">
        <img src={bigImage} alt="Project 3" />
        <p>Project 3 description.</p>
      </div>
    </section>
  );
}

export default Portfolio;
