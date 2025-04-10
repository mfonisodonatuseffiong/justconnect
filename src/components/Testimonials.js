// src/components/Testimonials.js
import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const testimonialsData = [
  {
    text: "This service is absolutely fantastic! Highly recommend.",
    author: "John Doe"
  },
  {
    text: "I couldn't be happier with the results. Professional and efficient!",
    author: "Jane Smith"
  },
  {
    text: "Outstanding quality and attention to detail. Will use again.",
    author: "Robert Johnson"
  },
  {
    text: "A game-changer for our business. Exceptional support!",
    author: "Emily Davis"
  },
  {
    text: "Top-notch services with a personal touch. Highly satisfied.",
    author: "Michael Brown"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % testimonialsData.length);
    }, 3000); // Change testimonial every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="testimonials">
      <h2>What Our Clients Say</h2>
      <div className="testimonial-container">
        <div className="testimonial-item">
          <blockquote>
            {testimonialsData[currentIndex].text}
          </blockquote>
          <footer>{testimonialsData[currentIndex].author}</footer>
        </div>
      </div>
      <div className="testimonial-navigation">
        {testimonialsData.map((_, index) => (
          <span
            key={index}
            className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
