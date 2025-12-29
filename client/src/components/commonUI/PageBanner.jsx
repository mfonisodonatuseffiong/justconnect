/**
 * @description This is a reusable banner header for all public pages
 *              - Takes two props, title and subtitle
 */

const PageBanner = ({ title, subtitle }) => {
  return (
    <section className="relative bg-gradient-to-r from-orange-500 via-rose-400 to-orange-400 text-white py-24 flex items-center justify-center rounded-2xl shadow-lg">
      <div className="relative z-10 text-center px-6">
        <h1
          className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
          data-aos="fade-in"
        >
          {title}
        </h1>
        <p
          className="text-md md:text-xl max-w-2xl mx-auto text-slate-100"
          data-aos="fade-up"
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default PageBanner;
