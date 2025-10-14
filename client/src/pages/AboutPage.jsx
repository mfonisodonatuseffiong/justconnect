/**
 * @description Full About Page with a modern banner header and reusable About section
 */

import About from "../components/feature/About";
import PageBanner from "../components/commonUI/PageBanner";

const AboutPage = () => {
  const text =
    "Discover our mission, our story, and the passion behind connecting clients with trusted professionals.";
  return (
    <div className="min-h-screen px-2 pb-16 text-brand mt-[7rem]">
      {/* ======= Banner Section ======= */}
      <PageBanner title={"About Us"} subtitle={text} />

      {/* ======= About Section (Reused) ======= */}
      <About showButton={false} showTitle={false} />

      {/* ======= Mission / Vision Section ======= */}
      <section className="max-w-5xl mx-auto p-4 text-primary-gray space-y-10">
        <div data-aos="fade-up">
          <h2 className="text-3xl font-semibold text-brand mb-3">
            Our Mission
          </h2>
          <p className="text-base md:text-lg leading-relaxed">
            At <span className="text-accent font-bold">J</span>ustConnect, we
            aim to make it simple and safe for people to find skilled and
            reliable artisans. We’re building trust and convenience in the
            home-service ecosystem — one connection at a time.
          </p>
        </div>

        {/** === Our Vision ======= */}
        <div data-aos="fade-in">
          <h2 className="text-3xl font-semibold text-brand mb-3">Our Vision</h2>
          <p className="text-base md:text-lg leading-relaxed">
            To become the most trusted platform across Africa for connecting
            professionals and clients — empowering artisans, simplifying life,
            and driving economic growth.
          </p>
        </div>

        {/** ==== Our Values ===== */}
        <div data-aos="fade-left">
          <h3 className="text-3xl font-semibold text-brand">Our Values</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Integrity</li>
            <li>Trust</li>
            <li>Efficiency</li>
            <li>Customer Satisfaction</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
