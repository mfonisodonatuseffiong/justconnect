// src/components/Features.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Features.css';

const Features = () => {
  return (
    <section id="services" className="features">
      <h2>Our Services</h2>
      <div className="features-grid">
        <div className="feature-item plumber">
          <div className="feature-icon plumber-icon"></div>
          <h3><Link to="/plumbers">Plumbers</Link></h3>
          <p>Emergency Plumbing, Leak Repairs, Installation of Fixtures, Drain Cleaning, Pipe Replacement.</p>
        </div>
        <div className="feature-item tailor">
          <div className="feature-icon tailor-icon"></div>
          <h3><Link to="/tailors">Tailors</Link></h3>
          <p>Custom Tailoring, Alterations and Repairs, Wedding Dress Design, Suit Tailoring, Fabric Selection Assistance.</p>
        </div>
        <div className="feature-item electrician">
          <div className="feature-icon electrician-icon"></div>
          <h3><Link to="/electricians">Electricians</Link></h3>
          <p>Electrical Installations, Repairs and Maintenance, Wiring and Rewiring, Home Automation, Safety Inspections.</p>
        </div>
        <div className="feature-item cleaning">
          <div className="feature-icon cleaning-icon"></div>
          <h3><Link to="/cleaning">Cleaning Services</Link></h3>
          <p>Home Cleaning, Office Cleaning, Carpet Cleaning, Window Cleaning, Deep Cleaning.</p>
        </div>
        <div className="feature-item gardening">
          <div className="feature-icon gardening-icon"></div>
          <h3><Link to="/gardening">Gardeners</Link></h3>
          <p>Lawn Mowing, Tree Trimming, Planting, Garden Maintenance, Landscaping.</p>
        </div>
        <div className="feature-item hvac">
          <div className="feature-icon hvac-icon"></div>
          <h3><Link to="/hvac">AC Technicians</Link></h3>
          <p>Air Conditioning Repair, Heating System Maintenance, Ventilation, Duct Cleaning, HVAC Installation.</p>
        </div>
        <div className="feature-item carpentry">
          <div className="feature-icon carpentry-icon"></div>
          <h3><Link to="/carpentry">Carpenters</Link></h3>
          <p>Furniture Making, Cabinet Installation, Deck Building, Trim and Molding, Custom Woodwork.</p>
        </div>
        <div className="feature-item painting">
          <div className="feature-icon painting-icon"></div>
          <h3><Link to="/painting">Painters</Link></h3>
          <p>Interior Painting, Exterior Painting, Wall Painting, Ceiling Painting, Trim Painting.</p>
        </div>
        <div className="feature-item tech-support">
          <div className="feature-icon tech-support-icon"></div>
          <h3><Link to="/tech-support">Tech Support</Link></h3>
          <p>Computer Repair, Network Setup, Software Installation, Data Recovery, IT Consulting.</p>
        </div>
        <div className="feature-item tutors">
          <div className="feature-icon tutors-icon"></div>
          <h3><Link to="/tutors">Tutors</Link></h3>
          <p>Math Tutoring, Science Tutoring, Language Tutoring, Exam Preparation, Homework Help.</p>
        </div>
      </div>
    </section>
  );
}

export default Features;
