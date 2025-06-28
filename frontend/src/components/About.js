// src/components/About.js
import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <h2>About Us</h2>
        <p>Welcome to JustConnect Services, your premier destination for top-tier rendering solutions. Our mission is to bridge the gap between clients and service professionals, ensuring that every project is completed with excellence and precision. Whether you are looking for residential or commercial rendering services, we have the expertise and dedication to meet your needs.</p>
        <p>At JustConnect, we pride ourselves on our commitment to quality and customer satisfaction. Our team of skilled professionals is dedicated to providing the highest level of service, from initial consultation to project completion. We understand the importance of timely and efficient service, and we work tirelessly to ensure that your experience with us is seamless and rewarding.</p>
        <p>Our services encompass a wide range of rendering solutions, including architectural renderings, 3D visualizations, and more. We leverage the latest technology and industry best practices to deliver results that exceed expectations. Trust JustConnect to bring your vision to life with unparalleled accuracy and creativity.</p>
        <button className="read-more-btn">Read More <span>&rarr;</span></button>
      </div>
    </section>
  );
}

export default About;
