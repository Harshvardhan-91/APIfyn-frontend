import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { usePayment } from '../contexts/PaymentContext'
import { useAuth } from '../contexts/AuthContext'
import { Check, Star, Zap, Crown, ChevronDown, Shield, Headphones, Users, Database, Rocket, Clock, ArrowRight, Building, Sparkles } from 'lucide-react'

const Pricing = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const { initiatePayment, isLoading, error } = usePayment()
  const { user } = useAuth()

  const plans = [
    {
      id: "starter",
      name: "Starter",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      period: "forever",
      description: "Perfect for individuals getting started with automation workflows.",
      features: [
        "Up to 100 API calls per month",
        "5 automation workflows", 
        "Basic integrations (10+ apps)",
        "Email notifications",
        "Community support",
        "Standard templates"
      ],
      buttonText: "Get Started Free",
      buttonStyle: "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
      popular: false,
      highlight: false
    },
    {
      id: "professional",
      name: "Professional", 
      monthlyPrice: "$20",
      yearlyPrice: "$16",
      period: "per month",
      description: "Advanced automation for growing teams and businesses.",
      features: [
        "Up to 10,000 API calls per month",
        "Unlimited automation workflows", 
        "Premium integrations (100+ apps)",
        "Real-time monitoring & alerts",
        "Priority email support",
        "Custom workflow templates",
        "Advanced analytics dashboard",
        "Webhook support"
      ],
      buttonText: "Get premium",
      buttonStyle: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
      popular: true,
      highlight: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthlyPrice: "$30",
      yearlyPrice: "$25", 
      period: "per month",
      description: "Complete automation solution for large-scale operations.",
      features: [
        "Unlimited API calls",
        "Advanced workflow automation",
        "All premium integrations + custom APIs",
        "24/7 dedicated support",
        "Custom onboarding & training",
        "Advanced security & compliance",
        "White-label options",
        "SLA guarantees"
      ],
      buttonText: "Get Pro",
      buttonStyle: "bg-white border-2 border-purple-300 text-purple-700 hover:border-purple-400 hover:bg-purple-50",
      popular: false,
      highlight: false
    }
  ]

  const trustedCompanies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
    { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
    { name: "Airtable", logo: "https://seeklogo.com/images/A/airtable-logo-216B9AF035-seeklogo.com.png" }
  ]

  const faqs = [
    {
      q: "Can I change my plan anytime?",
      a: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Plan changes take effect immediately, and you'll be charged or credited on a pro-rated basis. There are no cancellation fees or penalties."
    },
    {
      q: "What happens to my workflows if I downgrade?",
      a: "Your workflows remain intact, but only the number allowed by your new plan will stay active. We'll help you choose which workflows to keep active, and you can always upgrade again to reactivate them."
    },
    {
      q: "Do you offer refunds?",
      a: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not completely satisfied, contact our support team for a full refund, no questions asked."
    },
    {
      q: "What kind of support do you provide?",
      a: "Starter plan users get community support through our forum. Professional users receive priority email support with 24-hour response time. Business users get 24/7 support via email, chat, and phone with a dedicated account manager."
    },
    {
      q: "Is there a setup fee or hidden charges?",
      a: "No setup fees, no hidden charges, no surprise costs. You only pay for your monthly or yearly subscription. All features listed in each plan are included in the price."
    },
    {
      q: "How secure is my data?",
      a: "We take security seriously. All data is encrypted in transit and at rest using industry-standard encryption. We're SOC 2 Type II certified and comply with GDPR and other privacy regulations."
    },
    {
      q: "Can I integrate with custom APIs?",
      a: "Professional plans include access to our universal API connector for most REST APIs. Business plans include custom integration development and dedicated support for complex enterprise integrations."
    },
    {
      q: "What happens if I exceed my usage limits?",
      a: "We'll notify you before you reach your limits. If you exceed them, workflows will pause until the next billing cycle or you can upgrade your plan. We never charge overage fees without your explicit consent."
    }
  ]

  const handleSubscribe = async (plan) => {
    if (!user) {
      // If user is not logged in, redirect to login or show login modal
      // For now, we'll just alert
      alert("Please login to subscribe to a plan")
      return
    }

    if (plan.id === 'enterprise') {
      // For enterprise plan, redirect to contact sales or show contact modal
      window.location.href = '/contact-us'
      return
    }

    try {
      await initiatePayment(plan.id, billingPeriod)
    } catch (err) {
      console.error('Payment initiation failed:', err)
    }
  }

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <section id="pricing" className="relative py-24 bg-white overflow-hidden" ref={ref}>
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Flexible Plans for Every Need
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Choose the plan that fits your needs. Whether starting small or scaling up, our pricing supports 
            individuals, teams, and organizations with powerful features to enhance your workflow.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center bg-gray-100 rounded-xl p-1"
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative group ${plan.highlight ? 'lg:-mt-4' : ''}`}
            >
              <div className={`relative bg-white rounded-2xl p-8 h-full transition-all duration-300 ${
                plan.highlight 
                  ? 'border-2 border-blue-200 shadow-xl hover:shadow-2xl' 
                  : 'border border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}>
                
                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    {plan.period && (
                      <span className="text-gray-500 ml-2">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) + 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${plan.buttonStyle} 
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : plan.buttonText}
                </motion.button>
                {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted Companies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Trusted by Industry Leaders
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Join <span className="font-semibold text-blue-600"></span> teams already automating their workflows with APIfyn
              </p>
              
              {/* Company Logos Grid */}
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-70">
                {trustedCompanies.map((company, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                    className="text-gray-500 font-semibold text-base hover:text-gray-700 transition-colors duration-200"
                  >
                    {company.name}
                  </motion.div>
                ))}
              </div>
              
              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <span>Over 100 workflows automated</span>
                <div className="w-px h-4 bg-gray-300"></div>
                <span>99.9% uptime guaranteed</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600 text-lg">
              Everything you need to know about our pricing and features
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, faqIndex) => (
              <motion.div
                key={faqIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 + (faqIndex * 0.1) }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleFaq(faqIndex)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-8">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === faqIndex ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="text-gray-500" size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedFaq === faqIndex && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing;