/**
 * @desc About section for the landing page
 * @returns About component
 */


const About = () => {
  return (
    <section className="relative py-20 text-[var(--primary)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Title */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-medium">
            About <span className="text-highlight"> JustConnect</span>
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto">
            We connect clients with skilled and verified artisans — making it
            easier, faster, and safer to get trusted professionals for all your
            daily needs.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold">
              Why Choose Us?
            </h3>
            <ul className="space-y-4">
              <li>✅ Verified and trusted artisans near you</li>
              <li>✅ Safe and seamless booking experience</li>
              <li>✅ Wide range of services for home & business</li>
              <li>✅ Save time and get the job done right</li>
            </ul>
          </div>

          {/* Right - Illustration */}
          <div className="flex justify-center">
            <img
              src="/about-illustration.png"
              alt="About TechIn illustration"
              className="w-[300px] sm:w-[400px] lg:w-[450px] drop-shadow-2xl rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
