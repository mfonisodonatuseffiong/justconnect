/**
 * @description Testimonies of people that have used the app
 *              Industry-standard design: clean cards, subtle hover, fade-in
 */

const testimonials = [
  {
    name: "Rachel Adaobi",
    role: "Homeowner",
    quote:
      "This app made it so easy to find skilled artisans for home repairs. Quick, reliable, and professional!",
  },
  {
    name: "Duke Ukaigwe",
    role: "Business Owner",
    quote:
      "I needed a skilled electrician for my office, and I found one within hours. Highly recommend this platform!",
  },
  {
    name: "Sarah Adebayo",
    role: "Tenant",
    quote:
      "I love how simple and fast it is to connect with reliable professionals. It saves me so much time fixing my plumbing works.",
  },
];

const TestimonialPage = () => {
  return (
    <section className="relative bg-orange-50 my-10 py-16 px-4 md:px-20">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-orange-500 via-rose-400 to-orange-400 rounded-full -translate-x-20 -translate-y-20 opacity-30"></div>
      <div className="absolute bottom-0 left-1/2 w-1/2 md:w-2xl h-15 bg-orange-100 -translate-x-1/2 translate-y-5"></div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800">
            What Our <span className="text-orange-600">Users Say</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-slate-600">
            Connecting clients with skilled artisans has never been easier.
            Here's what our users have to say about their experience.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-orange-200 hover:shadow-lg hover:-translate-y-1 transition duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="600"
            >
              <p className="text-orange-600 italic mb-4">"{t.quote}"</p>
              <div className="text-slate-700 font-semibold">{t.name}</div>
              <div className="text-slate-500 opacity-75 text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialPage;
