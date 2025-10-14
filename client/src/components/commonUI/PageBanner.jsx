/**
 * @description This is a reuseable banner header for all public pages
 *              - Takes two props, title and subtitle
 */

const PageBanner = ({ title, subtitle }) => {
  return (
    <section className="relative bg-gradient-to-tl from-brand via-primary-gray to-brand text-white py-24 flex items-center justify-center rounded-2xl shadow-lg">
      <div className="relative z-10 text-center px-6">
        <h1
          className="text-3xl md:text-5xl font-extrabold text-accent mb-4"
          data-aos="fade-in"
        >
          {title}
        </h1>
        <p className="text-md md:text-xl max-w-2xl mx-auto" data-aos="fade-up">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default PageBanner;
