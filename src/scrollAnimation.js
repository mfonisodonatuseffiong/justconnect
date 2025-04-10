// src/scrollAnimation.js

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.fade-in, .slide-up');
  
    const onScroll = () => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    };
  
    window.addEventListener('scroll', onScroll);
    onScroll();
  });
  