/**
 * @desc This is the homepage of our entire app also called the landing page
 *         - page is broken down into coponents
 * @returns  NavBAr, Hero, About, Services, FAQ, Contact and Footer Bar Components
 *
 */
import Hero from "../components/feature/Hero";
import About from "../components/feature/About";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <About />
    </div>
  );
};
export default HomePage;
