/**
 * @description Things you should know well to use our servies
 * @returns Terms page
 */

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 mt-8 md:px-0 text-brand">
      <h1 className="text-3xl font-bold mb-6 underline">Terms of Service</h1>

      <p className="mb-4">
        Welcome to{" "}
        <strong>
          <span className="text-accent">J</span>ustConnect
        </strong>
        ! By using our platform, you agree to the following terms and
        conditions. Please read them carefully.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By accessing or using JustConnect, you agree to be bound by these Terms
        of Service and our Privacy Policy. If you do not agree, please do not
        use the platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
      <p className="mb-4">
        You must be at least 18 years old to create an account or use our
        services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Accounts</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          Clients and artisans must provide accurate and complete information.
        </li>
        <li>
          You are responsible for maintaining the security of your account.
        </li>
        <li>
          You are responsible for all activity that occurs under your account.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Use of Platform</h2>
      <p className="mb-4">
        JustConnect connects clients with verified artisan professionals. You
        agree to use the platform only for lawful purposes and not engage in
        fraudulent, harmful, or abusive activities.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payments and Fees</h2>
      <p className="mb-4">
        Payment terms and any fees for services will be communicated within the
        platform. JustConnect is not responsible for disputes between clients
        and artisans regarding payment.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        6. Intellectual Property
      </h2>
      <p className="mb-4">
        All content, branding, and materials on JustConnect are owned by or
        licensed to us. You may not copy, modify, or distribute our content
        without permission.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate accounts for violations of
        these terms or for behavior deemed inappropriate or harmful to the
        platform or community.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        8. Limitation of Liability
      </h2>
      <p className="mb-4">
        JustConnect is not responsible for any damages, losses, or disputes
        arising from the use of the platform. Use the service at your own risk.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. Any changes will
        be posted on this page. Continued use of the platform constitutes
        acceptance of the updated terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
      <p>
        If you have any questions about these Terms of Service, please contact
        us at: <br />
        <strong>Email:</strong> support@justconnect.com
      </p>
    </div>
  );
};

export default TermsOfService;
