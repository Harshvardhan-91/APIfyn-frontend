import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Play, Clock, Users, Zap } from 'lucide-react'

const WorkflowTemplates = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const templates = [
    {
      title: "GitHub → Slack",
      description: "Get instant Slack notifications when code is pushed to your GitHub repository. Perfect for keeping your team updated on development progress.",
      category: "Developer Tools",
      time: "2 mins setup",
      users: "1.8k users",
      gradient: "from-gray-900 to-purple-600",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      iconBg: "bg-gray-50",
      steps: [
        { name: "GitHub", logo: "https://github.githubassets.com/favicons/favicon.svg", color: "#24292e" },
        { name: "Slack", logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png", color: "#4A154B" }
      ],
      popular: true
    },
    {
      title: "Notion → Google Sheets",
      description: "Automatically sync new Notion database entries to Google Sheets for easier data analysis and reporting.",
      category: "Productivity",
      time: "3 mins setup",
      users: "1.2k users",
      gradient: "from-black to-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
      iconBg: "bg-green-50",
      steps: [
        { name: "Notion", logo: "https://www.notion.so/images/favicon.ico", color: "#000000" },
        { name: "Google Sheets", logo: "https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png", color: "#34A853" }
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
    <section id="templates" className="py-24 bg-gray-50" ref={ref}>
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
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-blue-200"
          >
            <span>Ready-to-Use Templates</span>
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
            Start with{' '}
            <span className="text-blue-600 font-bold">
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
                  className="absolute -top-3 -right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg"
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
                      className={`w-16 h-16 ${template.iconBg} rounded-2xl flex items-center justify-center shadow-lg border border-gray-200`}
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
                  className={`w-full ${template.buttonColor} text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg relative overflow-hidden`}
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
        
      </div>
    </section>
  )
}

export default WorkflowTemplates;