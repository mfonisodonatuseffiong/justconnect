// src/components/Statistics.js
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faProjectDiagram, faClock, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState({
    happyClients: 0,
    projects: 0,
    hoursOfSupport: 0,
    hardWorkers: 0,
  });

  const statsRef = useRef(null);

  useEffect(() => {
    const currentRef = statsRef.current;

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runAnimation();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const runAnimation = () => {
    const targetStats = {
      happyClients: 232,
      projects: 521,
      hoursOfSupport: 1463,
      hardWorkers: 15,
    };

    const duration = 2000; // 2 seconds
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = (now - start) / duration;

      if (progress < 1) {
        setStats({
          happyClients: Math.floor(progress * targetStats.happyClients),
          projects: Math.floor(progress * targetStats.projects),
          hoursOfSupport: Math.floor(progress * targetStats.hoursOfSupport),
          hardWorkers: Math.floor(progress * targetStats.hardWorkers),
        });

        requestAnimationFrame(animate);
      } else {
        setStats(targetStats);
      }
    };

    animate();
  };

  return (
    <section className="statistics" ref={statsRef}>
      <div className="stat-item">
        <FontAwesomeIcon icon={faSmile} className="stat-icon" />
        <h3>{stats.happyClients}</h3>
        <p>Happy Clients</p>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faProjectDiagram} className="stat-icon" />
        <h3>{stats.projects}</h3>
        <p>Projects</p>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faClock} className="stat-icon" />
        <h3>{stats.hoursOfSupport}</h3>
        <p>Hours Of Support</p>
      </div>
      <div className="stat-item">
        <FontAwesomeIcon icon={faUserTie} className="stat-icon" />
        <h3>{stats.hardWorkers}</h3>
        <p>Hard Workers</p>
      </div>
    </section>
  );
};

export default Statistics;
