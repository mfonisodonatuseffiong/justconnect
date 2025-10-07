/**
 * @description Testimonies of people that have used the app
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
    <div className="relative bg-brand my-10 py-16 pb-30 px-4 md:px-20">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 left-1/2 w-1/2 md:w-2xl h-15 bg-brand-bg -translate-x-1/2 translate-y-5"></div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            What Our <span className="text-accent"> Users Say</span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto">
            Connecting clients with skilled artisans has never been easier.
            Here's what our users have to say about their experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 150}
              data-aos-duration="600"
            >
              <p className="text-brand italic mb-4">"{t.quote}"</p>
              <div className="text-primary-gray font-semibold">{t.name}</div>
              <div className="text-primary-gray opacity-75 text-sm">
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;
