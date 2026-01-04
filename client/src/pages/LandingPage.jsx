// src/pages/LandingPage.jsx
import Hero from "../components/feature/Hero";
import About from "../components/feature/About";
import Services from "../components/feature/Services";
import Faq from "../components/feature/Faq";
import Cta from "../components/feature/Cta";
import Testimonial from "../components/feature/Testimonial";

const LandingPage = () => {
  return (
    <main className="pt-16">
      <Hero />
      <About />
      <Services />
      <Faq />
      <Testimonial />
      <Cta />
    </main>
  );
};

export default LandingPage;
