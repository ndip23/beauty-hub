import React from "react";

const PrivacyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 text-gray-700">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          <section>
            <p className="leading-relaxed text-lg">
              At Beautyhub, we take your privacy seriously. This policy explains what information we collect, how we use it, and how we protect it when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed font-semibold mb-2">From Customers:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed mb-4">
              <li>Name and email address when you create an account.</li>
              <li>IP address, browser type, and platform usage data.</li>
            </ul>
            <p className="leading-relaxed font-semibold mb-2">From Salon Owners & Professionals:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed mb-4">
              <li>Business name, owner name, email address, and phone/WhatsApp number.</li>
              <li>Business address, location data, and portfolio images.</li>
              <li>Payment and subscription history (processed securely by third parties).</li>
            </ul>
            <p className="leading-relaxed font-semibold mb-2">Automatically Collected Data:</p>
            <p className="leading-relaxed">
              We use cookies and tracking technologies to collect data about how you interact with our platform to improve user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-3 leading-relaxed">
              <li>To create and maintain your Beautyhub account.</li>
              <li>To display Salon profiles to potential customers publicly.</li>
              <li>To facilitate connections (e.g., providing the salon's WhatsApp number to the customer when they click "Book").</li>
              <li>To process your subscription payments.</li>
              <li><strong>Marketing & Analytics:</strong> We use tracking pixels (such as the Facebook Pixel) to track page views, understand user behavior, and deliver targeted advertising to help grow our platform and your business.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Share Your Information</h2>
            <ul className="list-disc pl-5 space-y-3 leading-relaxed">
              <li><strong>Publicly:</strong> If you are a Salon Owner, your business profile (name, location, images, WhatsApp number, reviews) is visible to the public.</li>
              <li><strong>Service Providers:</strong> We share necessary data with secure third-party vendors who help us operate (e.g., Stripe for payments, cloud hosting providers).</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or subpoena.</li>
            </ul>
            <p className="mt-4 font-bold text-gray-900">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Links & Apps</h2>
            <p className="leading-relaxed">
              Our platform connects you to third-party applications like WhatsApp. Once you click a link that redirects you away from Beautyhub, you are no longer governed by this Privacy Policy. We are not responsible for the privacy practices of other websites or applications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. You use the platform at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Data Rights</h2>
            <p className="leading-relaxed">
              You have the right to access, update, or delete your personal information. You can edit your profile via your dashboard. If you wish to permanently delete your account and all associated data, please contact us or use the 'Delete Account' option in your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please email us at <strong>privacy@Beautyhub.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;