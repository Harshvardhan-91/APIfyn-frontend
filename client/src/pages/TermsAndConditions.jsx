import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using APIfyn's website and services, you agree to be bound by these Terms and Conditions. 
              If you disagree with any part of these terms, you may not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-600 leading-relaxed">
              APIfyn provides an automation platform that allows users to create, manage, and run automated workflows 
              connecting various third-party services and APIs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                When you create an account with us, you must provide accurate information and keep it updated. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized access</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscriptions and Payments</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Some features of our service require a paid subscription. By choosing a paid subscription, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Pay all fees in accordance with the pricing plan you choose</li>
                <li>Provide accurate billing information</li>
                <li>Automatic renewal unless cancelled</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree not to use our service to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or conduct denial of service attacks</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              APIfyn shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting 
              from your use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email 
              or through our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at:<br />
              Email: legal@apifyn.com<br />
              Address: 123 Tech Street, Silicon Valley, CA 94025
            </p>
          </section>

          <div className="text-sm text-gray-500 pt-8 border-t border-gray-200">
            Last updated: July 20, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
