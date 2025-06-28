// src/components/Contact.js
import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="contact-content">
        <h2>Contact Us</h2>
        <p>If you have any questions or inquiries, please fill out the form below and we will get back to you as soon as possible.</p>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email Address" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
      <div className="contact-details">
        <h3>Our Address</h3>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className="icon">
            <path d="M8 0a5.053 5.053 0 00-5.006 5.215c.322 3.692 4.396 7.278 4.696 7.533a.536.536 0 00.62 0c.3-.255 4.374-3.841 4.696-7.533A5.053 5.053 0 008 0zm0 7.489a2.272 2.272 0 110-4.543 2.272 2.272 0 010 4.543z"></path>
          </svg>
          5 Cosmos Close,<br />Uyo, Akwa State, Nigeria
        </p>
        <h3>Call Us</h3>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className="icon">
            <path d="M3.654 1.328a.678.678 0 00-1.015-.063L.568 3.336c-.483.484-.661 1.169-.326 1.741C2.04 7.46 4.927 10.346 8.923 12.682c.573.336 1.258.157 1.741-.326l2.07-2.07a.678.678 0 00-.062-1.015L10.84 8.227a.678.678 0 00-.584-.096l-1.516.505a10.97 10.97 0 01-4.21-4.21l.505-1.516a.678.678 0 00-.096-.584L3.654 1.328z"></path>
          </svg>
          +23468199955
        </p>
        <h3>Email Us</h3>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" className="icon">
            <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm14 0H2v.217l6 3.692 6-3.692V4zM1.763 6.571V12H14V6.571l-5.548 3.416a.5.5 0 01-.485 0L1.763 6.571z"></path>
          </svg>
          info@justconnect.com
        </p>
      </div>
    </section>
  );
}

export default Contact;
