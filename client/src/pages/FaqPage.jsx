/**
 * @description Displays frequently asked questions with collapsible answers
 * @returns A styled FAQ page
 */

import FAQ from "../components/feature/Faq";
import PageBanner from "../components/commonUI/PageBanner";
import { faqs, extraFaqs } from "../utils/landingPageFaqs";

const FaqPage = () => {
  const combinedFaqs = [...extraFaqs, ...faqs];

  return (
    <div className="min-h-screen mt-[7rem] text-brand p-2 pb-16">
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Most asked questions by users."
      />

      <section className="max-w-5xl mx-auto md:px-6 py-12">
        <h2 className="text-3xl font-bold text-center" data-aos="zoom-out">
          Got Questions? We’ve Got Answers!
        </h2>
        <FAQ showTitle={false} faqs={combinedFaqs} />
      </section>
    </div>
  );
};

export default FaqPage;
