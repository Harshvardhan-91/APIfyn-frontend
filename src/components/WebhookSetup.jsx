import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, CheckCircle, Globe, Code, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const WebhookSetup = ({ workflow }) => {
  const { user } = useAuth();
  const [copiedUrl, setCopiedUrl] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const webhookUrls = {
    generic: `${baseUrl}/api/webhook/trigger/${workflow.id}`,
    user: `${baseUrl}/api/webhook/user/${user?.uid}/workflow/${workflow.id}`,
    test: `${baseUrl}/api/webhook/test/${workflow.id}`,
    typeform: `${baseUrl}/api/webhook/external/typeform/${workflow.id}`,
    stripe: `${baseUrl}/api/webhook/external/stripe/${workflow.id}`,
    calendly: `${baseUrl}/api/webhook/external/calendly/${workflow.id}`,
    zapier: `${baseUrl}/api/webhook/external/zapier/${workflow.id}`
  };

  const copyToClipboard = async (url, type) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(type);
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const integrationGuides = [
    {
      name: 'Typeform',
      icon: '📋',
      description: 'Trigger workflow when form is submitted',
      url: webhookUrls.typeform,
      setup: [
        'Go to your Typeform → Settings → Webhooks',
        'Click "Add a webhook"',
        'Paste the webhook URL',
        'Save and test your form'
      ],
      docs: 'https://developer.typeform.com/webhooks/'
    },
    {
      name: 'Stripe',
      icon: '💳',
      description: 'Trigger on payment events',
      url: webhookUrls.stripe,
      setup: [
        'Go to Stripe Dashboard → Webhooks',
        'Click "Add endpoint"',
        'Paste the webhook URL',
        'Select events: payment_intent.succeeded'
      ],
      docs: 'https://stripe.com/docs/webhooks'
    },
    {
      name: 'Calendly',
      icon: '📅',
      description: 'Trigger when event is scheduled',
      url: webhookUrls.calendly,
      setup: [
        'Go to Calendly → Integrations → Webhooks',
        'Create new webhook',
        'Paste the webhook URL',
        'Select "Invitee Created" event'
      ],
      docs: 'https://developer.calendly.com/api-docs/webhooks'
    },
    {
      name: 'Zapier',
      icon: '⚡',
      description: 'Connect via Zapier webhook',
      url: webhookUrls.zapier,
      setup: [
        'Create new Zap in Zapier',
        'Choose trigger app and event',
        'Add "Webhooks by Zapier" action',
        'Paste the webhook URL as POST URL'
      ],
      docs: 'https://zapier.com/help/create/code-webhooks/send-webhooks-in-zaps'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Webhook Setup</h3>
          <p className="text-sm text-gray-500">Configure external triggers for your workflow</p>
        </div>
      </div>

      {/* Generic Webhook URL */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generic Webhook URL
        </label>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
          <code className="flex-1 text-sm text-gray-600 break-all">
            {webhookUrls.generic}
          </code>
          <button
            onClick={() => copyToClipboard(webhookUrls.generic, 'generic')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            {copiedUrl === 'generic' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use this URL for any service that supports webhooks
        </p>
      </div>

      {/* Test Webhook */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Webhook URL
        </label>
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <code className="flex-1 text-sm text-blue-700 break-all">
            {webhookUrls.test}
          </code>
          <button
            onClick={() => copyToClipboard(webhookUrls.test, 'test')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
          >
            {copiedUrl === 'test' ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Test</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use this URL to test your workflow with sample data
        </p>
      </div>

      {/* Integration-Specific URLs */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Service-Specific Webhooks</h4>
        <div className="grid gap-4">
          {integrationGuides.map((integration, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h5 className="font-medium text-gray-900">{integration.name}</h5>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <a
                  href={integration.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  <span>Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <code className="flex-1 text-xs text-gray-600 bg-gray-50 p-2 rounded border break-all">
                  {integration.url}
                </code>
                <button
                  onClick={() => copyToClipboard(integration.url, integration.name.toLowerCase())}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                >
                  {copiedUrl === integration.name.toLowerCase() ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Quick Setup:</p>
                <ol className="text-xs text-gray-600 space-y-1">
                  {integration.setup.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-4 h-4 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-bold mt-0.5">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* curl Example */}
      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Test with curl</span>
        </div>
        <pre className="text-xs text-gray-300 overflow-x-auto">
{`curl -X POST ${webhookUrls.test} \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Test webhook trigger"
  }'`}
        </pre>
      </div>
    </div>
  );
};

export default WebhookSetup;
