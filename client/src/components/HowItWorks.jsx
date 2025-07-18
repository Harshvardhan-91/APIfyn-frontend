import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Zap, 
  GitBranch, 
  BarChart3, 
  ArrowRight, 
  Play,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Database,
  Bell,
  Link,
  Mouse,
  Eye
} from 'lucide-react'

const HowItWorks = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const steps = [
    {
      step: "01",
      icon: Link,
      title: "Connect Your Business Tools",
      subtitle: "Enterprise-Grade Integrations",
      description: "Securely connect to 500+ business applications with OAuth authentication. No technical setup required - just authorize and start automating.",
      features: [
        "OAuth 2.0 secure authentication",
        "Enterprise-grade API connections",
        "SOC 2 Type II compliance",
        "Real-time sync capabilities"
      ],
      companies: ["Google Workspace", "Microsoft 365", "Salesforce", "Slack"],
      visualization: {
        type: "network",
        title: "Enterprise Integrations",
        stats: "500+ apps connected securely"
      },
      gradient: "from-blue-600 via-blue-700 to-indigo-800",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      step: "02", 
      icon: Mouse,
      title: "Design Smart Workflows",
      subtitle: "AI-Powered Automation Builder",
      description: "Build sophisticated automations with our visual workflow designer. AI suggests optimizations and handles complex decision logic automatically.",
      features: [
        "Visual drag-and-drop interface",
        "AI-powered workflow suggestions", 
        "Pre-built templates for common use cases",
        "Advanced conditional logic"
      ],
      companies: ["Zapier", "Microsoft Power Automate", "UiPath"],
      visualization: {
        type: "workflow",
        title: "Intelligent Workflow Builder",
        stats: "85% faster than traditional automation tools"
      },
      gradient: "from-purple-600 via-purple-700 to-violet-800",
      bgGradient: "from-purple-50 to-violet-50"
    },
    {
      step: "03",
      icon: Eye,
      title: "Monitor & Scale",
      subtitle: "Enterprise Monitoring & Analytics",
      description: "Real-time performance monitoring with advanced analytics. Get insights into workflow efficiency and scale operations with confidence.",
      features: [
        "Real-time execution monitoring",
        "Advanced performance analytics",
        "Intelligent error detection & recovery",
        "SLA monitoring & reporting"
      ],
      companies: ["Datadog", "New Relic", "Splunk"],
      visualization: {
        type: "analytics",
        title: "Enterprise Monitoring Dashboard",
        stats: "99.99% uptime with proactive monitoring"
      },
      gradient: "from-emerald-600 via-green-700 to-teal-800",
      bgGradient: "from-emerald-50 to-teal-50"
    }
  ]

  const NetworkVisualization = () => (
    <div className="relative h-80 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl"></div>
      
      {/* Central FlowAPI Hub */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 10px 30px rgba(59, 130, 246, 0.3)',
            '0 20px 40px rgba(59, 130, 246, 0.4)',
            '0 10px 30px rgba(59, 130, 246, 0.3)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg z-10"
      >
        <div className="text-center">
          <Zap size={24} className="mx-auto mb-1" />
          <div className="text-xs font-semibold">FlowAPI</div>
        </div>
      </motion.div>

      {/* Real Platform Logos */}
      {[
        { 
          name: 'Gmail', 
          pos: 'top-left', 
          bg: 'bg-white border-2 border-gray-200', 
          logo: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          ),
          description: 'Send & receive emails automatically'
        },
        { 
          name: 'Slack', 
          pos: 'top-right', 
          bg: 'bg-white border-2 border-gray-200', 
          logo: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path fill="#e01e5a" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"/>
              <path fill="#e01e5a" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
              <path fill="#36c5f0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"/>
              <path fill="#36c5f0" d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
              <path fill="#2eb67d" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z"/>
              <path fill="#2eb67d" d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
              <path fill="#ecb22e" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z"/>
              <path fill="#ecb22e" d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
            </svg>
          ),
          description: 'Post messages & notifications'
        },
        { 
          name: 'Sheets', 
          pos: 'bottom-left', 
          bg: 'bg-white border-2 border-gray-200', 
          logo: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path fill="#0f9d58" d="M11.318 12.545H7.91v-1.909h3.408v1.91z"/>
              <path fill="#0f9d58" d="M14.728 0v6h6l-6-6z"/>
              <path fill="#0f9d58" d="M16.091 10.636h-3.408v1.91h3.408v-1.91z"/>
              <path fill="#0f9d58" d="M16.091 13.909h-3.408v1.909h3.408v-1.91z"/>
              <path fill="#0f9d58" d="M20.727 6v15.273c0 .957-.822 1.727-1.818 1.727H5.09c-.996 0-1.818-.77-1.818-1.727V2.727C3.272 1.77 4.094 1 5.09 1h9.545v5h6.091z"/>
              <path fill="#f1c232" d="M11.318 10.636H7.91v1.91h3.408v-1.91z"/>
              <path fill="#f1c232" d="M14.681 8.727H7.91v1.91h6.772v-1.91z"/>
              <path fill="#f1c232" d="M7.91 15.818v1.91h6.772v-1.91H7.91z"/>
            </svg>
          ),
          description: 'Read & update spreadsheets'
        },
        { 
          name: 'Reddit', 
          pos: 'bottom-right', 
          bg: 'bg-white border-2 border-gray-200', 
          logo: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <circle fill="#ff4500" cx="12" cy="12" r="12"/>
              <path fill="#fff" d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
          ),
          description: 'Monitor posts & comments'
        },
        { 
          name: 'Drive', 
          pos: 'top-center', 
          bg: 'bg-white border-2 border-gray-200', 
          logo: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path fill="#4285f4" d="M12.01 2.011L6.05 13.995H18L12.01 2.011z"/>
              <path fill="#ea4335" d="M1.01 16.992l5.96-10.317L11.99 16.992z"/>
              <path fill="#34a853" d="M8.974 17.988h13.015L16.032 6.659z"/>
            </svg>
          ),
          description: 'Store & organize files'
        },
        { 
          name: 'Twitter', 
          pos: 'bottom-center', 
          bg: 'bg-white border-2 border-gray-200', 
          logo: (
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path fill="#1da1f2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          ),
          description: 'Track mentions & trends'
        }
      ].map((platform, index) => (
        <motion.div
          key={index}
          animate={{ 
            scale: [0.9, 1, 0.9],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: index * 0.2 
          }}
          className={`absolute w-16 h-16 ${platform.bg} rounded-xl flex flex-col items-center justify-center shadow-lg group cursor-pointer hover:shadow-xl transition-all duration-200 ${
            platform.pos === 'top-left' ? 'top-4 left-4' :
            platform.pos === 'top-right' ? 'top-4 right-4' :
            platform.pos === 'top-center' ? 'top-0 left-1/2 transform -translate-x-1/2' :
            platform.pos === 'bottom-left' ? 'bottom-4 left-4' :
            platform.pos === 'bottom-right' ? 'bottom-4 right-4' :
            'bottom-0 left-1/2 transform -translate-x-1/2'
          }`}
        >
          <div className="mb-1">{platform.logo}</div>
          <div className="text-xs font-semibold text-gray-700">{platform.name}</div>
          
          {/* Tooltip */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
            {platform.description}
          </div>
        </motion.div>
      ))}

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[
          { x1: 60, y1: 60, x2: 155, y2: 155 },   // top-left to center
          { x1: 260, y1: 60, x2: 175, y2: 155 },  // top-right to center
          { x1: 160, y1: 30, x2: 165, y2: 145 },  // top-center to center
          { x1: 60, y1: 260, x2: 155, y2: 175 },  // bottom-left to center
          { x1: 260, y1: 260, x2: 175, y2: 175 }, // bottom-right to center
          { x1: 160, y1: 290, x2: 165, y2: 185 }  // bottom-center to center
        ].map((line, index) => (
          <motion.line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            strokeDasharray="5,5"
            animate={{
              strokeDashoffset: [0, -10]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.1
            }}
            opacity="0.6"
          />
        ))}
      </svg>

      {/* Connection Status */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-700">All platforms connected</span>
        </div>
      </div>
    </div>
  )

  const WorkflowVisualization = () => (
    <div className="relative h-64 p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
      <div className="space-y-4">
        {[
          { type: 'Trigger', name: 'New Form Submission', color: 'from-blue-600 to-blue-700', icon: Bell },
          { type: 'Process', name: 'AI Sentiment Analysis', color: 'from-purple-600 to-purple-700', icon: Sparkles },
          { type: 'Action', name: 'Update CRM & Send Email', color: 'from-green-600 to-green-700', icon: Database }
        ].map((block, index) => (
          <motion.div
            key={index}
            animate={{ 
              x: [0, 8, 0],
              boxShadow: [
                '0 4px 20px rgba(0, 0, 0, 0.1)',
                '0 8px 30px rgba(0, 0, 0, 0.15)',
                '0 4px 20px rgba(0, 0, 0, 0.1)'
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: index * 0.4 
            }}
            className={`bg-gradient-to-r ${block.color} rounded-lg p-4 text-white shadow-lg relative`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <block.icon size={16} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-white/80 uppercase tracking-wide">{block.type}</div>
                <div className="font-semibold text-sm">{block.name}</div>
              </div>
            </div>
            
            {index < 2 && (
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
              >
                <ArrowRight size={16} className="text-gray-400 rotate-90" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )

  const AnalyticsVisualization = () => (
    <div className="relative h-64 p-6 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="space-y-4">
          {[
            { label: 'Success Rate', value: '99.2%', color: 'text-emerald-600' },
            { label: 'Avg Response', value: '1.2s', color: 'text-blue-600' },
            { label: 'Active Workflows', value: '47', color: 'text-purple-600' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
            >
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-sm font-medium text-gray-700 mb-3">Recent Activity</div>
          <div className="space-y-2">
            {[
              { action: 'Email automation', status: 'success', time: '2m ago' },
              { action: 'Data sync', status: 'success', time: '5m ago' },
              { action: 'Report generated', status: 'success', time: '8m ago' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                className="flex items-center space-x-2 text-xs"
              >
                <CheckCircle2 size={12} className="text-green-500" />
                <span className="text-gray-700">{activity.action}</span>
                <span className="text-gray-500">• {activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <Play size={16} />
            <span>See How It Works</span>
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Three Steps to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Automation Success
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform your business operations with our enterprise-grade automation platform. 
            Connect, automate, and optimize your workflows in minutes, not months.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
              transition={{ duration: 1, delay: index * 0.3 }}
              className={`grid lg:grid-cols-5 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={`lg:col-span-2 ${index % 2 === 1 ? 'lg:col-start-4' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="text-white" size={28} />
                    </div>
                    <div className="text-6xl font-bold text-gray-200">{step.step}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      {step.subtitle}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="space-y-4">
                    {step.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, delay: (index * 0.3) + (featureIndex * 0.1) + 0.5 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="text-green-600" size={14} />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Trusted Companies */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-3">Integrates with enterprise platforms:</p>
                    <div className="flex flex-wrap gap-2">
                      {step.companies.map((company, companyIndex) => (
                        <span key={companyIndex} className="bg-white/80 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 text-blue-600 font-semibold cursor-pointer"
                  >
                    <span>Learn more</span>
                    <ArrowRight size={16} />
                  </motion.div>
                </motion.div>
              </div>

              {/* Visualization */}
              <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className={`bg-gradient-to-br ${step.bgGradient} rounded-3xl p-8 shadow-2xl border border-white/50`}>
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.visualization.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {step.visualization.stats}
                      </p>
                    </div>
                    
                    {index === 0 && <NetworkVisualization />}
                    {index === 1 && <WorkflowVisualization />}
                    {index === 2 && <AnalyticsVisualization />}
                  </div>

                  {/* Floating Badge */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className={`absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                  >
                    {step.step}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks;