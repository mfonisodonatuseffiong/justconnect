/**
 * @desc This is the homepage of our entire app also called the landing page
 *         - page is broken down into components
 * @returns  NavBAr, Hero, About, Services, FAQ, Contact and Footer Bar Components
 *
 */
import Hero from "../components/feature/Hero";
import About from "../components/feature/About";
import Services from "../components/feature/Services";
import FAQ from "../components/feature/Faq";
import Testimonial from "../components/feature/Testimonial";
import CTA from "../components/feature/Cta";
import { faqs } from "../utils/landingPageFaqs";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <FAQ faqs={faqs} />
      <Testimonial />
      <CTA />
    </div>
  );
};
export default HomePage;
