import React from 'react';

const ShippingDelivery = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping and Delivery</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Digital Service Delivery</h2>
            <p className="text-gray-600 leading-relaxed">
              APIfyn is a cloud-based software service. Upon successful subscription or purchase:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>Immediate access to your account will be granted</li>
              <li>You will receive a welcome email with login credentials</li>
              <li>Access to features based on your subscription plan</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Activation</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Your service will be activated:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Immediately after successful payment processing</li>
                <li>Upon email verification completion</li>
                <li>After accepting our Terms of Service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform is available 24/7, with the following considerations:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>Scheduled maintenance windows</li>
              <li>99.9% uptime guarantee for enterprise plans</li>
              <li>Real-time status monitoring available</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Support Response Times</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">We aim to respond to support requests within:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>1 hour for critical issues (Enterprise plan)</li>
                <li>4 hours for high-priority issues (Business plan)</li>
                <li>24 hours for standard issues (Standard plan)</li>
                <li>48 hours for basic inquiries (Free plan)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Level Agreements (SLA)</h2>
            <p className="text-gray-600 leading-relaxed">
              Enterprise customers receive guaranteed service levels including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>99.9% platform availability</li>
              <li>1-hour response time for critical issues</li>
              <li>Dedicated support team</li>
              <li>Monthly service reports</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Migration Services</h2>
            <p className="text-gray-600 leading-relaxed">
              For customers requiring data migration:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>Custom migration plans available</li>
              <li>Professional services team assistance</li>
              <li>Scheduled migration windows</li>
              <li>Data validation and verification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about service delivery, please contact us at:<br />
              Email: support@apifyn.com<br />
              Phone: 1-800-APIfyn<br />
              Business Hours: Monday - Friday, 9 AM - 6 PM EST
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

export default ShippingDelivery;
