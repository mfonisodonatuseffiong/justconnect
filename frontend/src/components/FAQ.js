// src/components/FAQ.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import './FAQ.css';

const FAQ = () => {
  return (
    <section className="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-item">
        <h3>
          <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
          What services do you offer?
        </h3>
        <p>We offer a wide range of rendering services, including architectural renderings, 3D visualizations, and more. Our team is dedicated to providing top-notch quality and ensuring customer satisfaction.</p>
      </div>
      <div className="faq-item">
        <h3>
          <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
          How can I get started with your services?
        </h3>
        <p>Getting started is easy! Simply contact us through our website or give us a call. We'll schedule an initial consultation to discuss your project requirements and provide a detailed plan of action.</p>
      </div>
      <div className="faq-item">
        <h3>
          <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
          What is the turnaround time for a typical project?
        </h3>
        <p>The turnaround time for a project depends on its complexity and scope. We strive to complete all projects in a timely manner while maintaining the highest standards of quality. During the initial consultation, we'll provide an estimated timeline for your specific project.</p>
      </div>
      <div className="faq-item">
        <h3>
          <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
          Do you offer revisions?
        </h3>
        <p>Yes, we offer revisions to ensure that the final result meets your expectations. Our goal is to deliver a product that you are completely satisfied with, and we are happy to make any necessary adjustments.</p>
      </div>
      <div className="faq-item">
        <h3>
          <FontAwesomeIcon icon={faQuestionCircle} className="faq-icon" />
          What are your pricing options?
        </h3>
        <p>Our pricing varies depending on the type and scope of the project. We offer competitive rates and flexible pricing options to suit your budget. Contact us for a detailed quote based on your specific needs.</p>
      </div>
      <button className="faq-read-more">Read More <span>&rarr;</span></button>
    </section>
  );
}

export default FAQ;
