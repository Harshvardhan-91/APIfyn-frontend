import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Play, Clock, Users, Sparkles, Zap } from 'lucide-react'

const WorkflowTemplates = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const templates = [
    {
      title: "Reddit → OpenAI → Gmail",
      description: "Monitor Reddit posts, analyze sentiment with AI, and get email alerts for positive mentions of your brand.",
      category: "Social Monitoring",
      time: "2 mins setup",
      users: "1.2k users",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      steps: [
        { name: "Reddit", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/reddit.svg", color: "#FF4500" },
        { name: "OpenAI", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/openai.svg", color: "#412991" },
        { name: "Gmail", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg", color: "#EA4335" }
      ],
      popular: true
    },
    {
      title: "Shopify → Google Sheets → Drive",
      description: "Automatically log new orders in Google Sheets and upload invoices to organized Drive folders.",
      category: "E-commerce",
      time: "3 mins setup",
      users: "850 users",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      steps: [
        { name: "Shopify", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/shopify.svg", color: "#7AB55C" },
        { name: "Sheets", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlesheets.svg", color: "#34A853" },
        { name: "Drive", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googledrive.svg", color: "#4285F4" }
      ],
      popular: false
    },
    {
      title: "Typeform → HubSpot → Slack",
      description: "Capture form leads, add them to your CRM, and notify your sales team instantly via Slack.",
      category: "Lead Generation",
      time: "2 mins setup",
      users: "2.1k users",
      gradient: "from-blue-500 via-cyan-500 to-indigo-500",
      steps: [
        { name: "Typeform", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typeform.svg", color: "#262627" },
        { name: "HubSpot", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/hubspot.svg", color: "#FF7A59" },
        { name: "Slack", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/slack.svg", color: "#4A154B" }
      ],
      popular: true
    },
    {
      title: "Twitter → Slack → Notion",
      description: "Track brand mentions on Twitter, post to Slack channel, and log everything in a Notion database.",
      category: "Social Media",
      time: "1 min setup",
      users: "950 users",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      steps: [
        { name: "Twitter", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg", color: "#1DA1F2" },
        { name: "Slack", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/slack.svg", color: "#4A154B" },
        { name: "Notion", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/notion.svg", color: "#000000" }
      ],
      popular: false
    }
  ]

  const LogoIcon = ({ src, color, size = 20 }) => (
    <div 
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <image href={src} width="24" height="24" />
      </svg>
    </div>
  )

  return (
    <section id="templates" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-purple-100"
          >
            <Sparkles size={16} />
            <span>Ready-to-Use Templates</span>
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
            Start with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Proven Templates
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't start from scratch. Choose from our library of battle-tested workflow templates and customize them for your needs in minutes.
          </p>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative"
            >
              {/* Popular Badge */}
              {template.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg"
                >
                  <div className="flex items-center space-x-1">
                    <Zap size={12} />
                    <span>Popular</span>
                  </div>
                </motion.div>
              )}

              <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 group-hover:shadow-2xl h-full backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 bg-gradient-to-br ${template.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <LogoIcon 
                          src={template.steps[0].logo} 
                          color={template.steps[0].color}
                          size={20}
                        />
                      </div>
                    </motion.div>
                    <div>
                      <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                        {template.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                        {template.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {template.description}
                </p>

                {/* Workflow Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between space-x-3">
                    {template.steps.map((step, stepIndex) => (
                      <React.Fragment key={stepIndex}>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center group-hover:from-gray-100 group-hover:to-gray-50 transition-all duration-300 border border-gray-200"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <LogoIcon 
                                src={step.logo} 
                                color={step.color}
                                size={16}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{step.name}</span>
                          </div>
                        </motion.div>
                        {stepIndex < template.steps.length - 1 && (
                          <motion.div
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: stepIndex * 0.3 }}
                            className="text-gray-400 text-xl"
                          >
                            →
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Clock size={12} className="text-green-600" />
                      </div>
                      <span className="font-medium">{template.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={12} className="text-blue-600" />
                      </div>
                      <span className="font-medium">{template.users}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${template.gradient} text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  />
                  <span>Use This Template</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm" />
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-xl" />
          </div>

          <div className="relative z-10 text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Browse our complete template library with 100+ ready-to-use workflows for marketing, e-commerce, content creation, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300"
              >
                Browse All Templates
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Create Custom Workflow
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkflowTemplates;