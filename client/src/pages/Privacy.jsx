/**
 * @description - Our App's Policy
 *              - How we handle your data
 * @returns     - Privacy Policy Page
 */

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10 py-20 px-6 md:px-0 text-brand">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At{" "}
        <strong>
          <span className="text-accent">J</span>ustConnect
        </strong>
        , we value your privacy. This Privacy Policy explains how we collect,
        use, and protect your personal information when you use our platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Personal details you provide, such as name, email, and contact
          information.
        </li>
        <li>Account information for clients and artisan professionals.</li>
        <li>
          Usage data, including interactions with our website or services.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>To provide and improve our services.</li>
        <li>To communicate with you about your account and service updates.</li>
        <li>To personalize your experience on JustConnect.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        3. Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not sell your personal data. We may share information with:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Artisan professionals you hire through the platform.</li>
        <li>
          Third-party service providers that help us operate our platform.
        </li>
        <li>As required by law or to protect our legal rights.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your personal data from
        unauthorized access, disclosure, or destruction.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Choices</h2>
      <p className="mb-4">
        You can update or delete your account information anytime. You may also
        opt out of promotional communications.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        6. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p>
        If you have any questions about this policy, you can contact us at:{" "}
        <br />
        <strong>Email:</strong> support@justconnect.com
      </p>
    </div>
  );
};

export default PrivacyPolicy;
