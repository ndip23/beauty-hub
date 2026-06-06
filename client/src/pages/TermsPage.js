import React from "react";

const TermsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-gray-700">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Terms of Use</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction and Acceptance</h2>
            <p className="leading-relaxed">
              Welcome to Beautyhub. By accessing or using our website and services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Nature of the Platform</h2>
            <p className="leading-relaxed mb-4">
              <strong>Beautyhub is a Directory and Software Platform.</strong> We connect clients with independent beauty professionals and salon owners. We do not provide beauty services directly.
            </p>
            <p className="leading-relaxed mb-4">
              <strong>No Liability for Services:</strong> We are not responsible for the quality, safety, legality, or outcome of the services provided by the professionals listed on our platform. Any disputes regarding services, injuries, or damages must be resolved directly between the client and the professional.
            </p>
            <p className="leading-relaxed">
              <strong>Off-Platform Communication:</strong> Users may be redirected to third-party applications like WhatsApp to finalize bookings. Beautyhub does not monitor and is not responsible for communications or transactions that occur outside our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts & Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-3 leading-relaxed">
              <li><strong>Customers:</strong> Must provide accurate information and interact professionally with listed businesses.</li>
              <li><strong>Salon Owners & Professionals:</strong> Must possess the legal right, licenses, and qualifications to perform the services they list. You are strictly responsible for ensuring your pricing, location, and portfolio images are accurate and truthful.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payments and Subscriptions (Salon Owners)</h2>
            <p className="leading-relaxed mb-4">
              To list your business on Beautyhub, you must subscribe to one of our premium plans. By subscribing, you agree to recurring billing based on your selected plan.
            </p>
            <ul className="list-disc pl-5 space-y-3 leading-relaxed">
              <li>We use secure, third-party payment processors (e.g., Stripe, Paystack). Beautyhub does not store your full credit card details.</li>
              <li><strong>Cancellations:</strong> You may cancel your subscription at any time through your dashboard. Payments are non-refundable, but you will retain access to your premium features until the end of your current billing cycle.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Conduct</h2>
            <p className="leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Post fake, defamatory, or malicious reviews.</li>
              <li>Upload stolen portfolio images or content that you do not own the rights to.</li>
              <li>Engage in harassment, hate speech, or discriminatory behavior.</li>
              <li>Use the platform for any illegal activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Account Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to suspend or permanently terminate any account, at any time, without notice, if we believe you have violated these Terms or if we receive multiple legitimate complaints regarding your conduct or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact our support team at <strong>support@Beautyhub.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;