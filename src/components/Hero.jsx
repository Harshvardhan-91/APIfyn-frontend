import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Play, 
  CheckCircle,
  Star,
  Users,
  BarChart3,
  TrendingUp,
  Workflow,
  Shield,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const [hoveredStat, setHoveredStat] = useState(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  // Navigate to dashboard when user becomes available after login
  useEffect(() => {
    if (user && isLoggingIn) {
      setIsLoggingIn(false)
      navigate('/dashboard')
    }
  }, [user, isLoggingIn, navigate])

  const handleGetStarted = async () => {
    try {
      if (user) {
        navigate('/dashboard')
      } else {
        setIsLoggingIn(true)
        await login()
        // Navigation will be handled by useEffect
      }
    } catch (error) {
      console.error('Error in handleGetStarted:', error)
      setIsLoggingIn(false)
    }
  }

  const stats = [
    { icon: Users, label: "Active Users", value: "50K+", color: "text-blue-600" },
    { icon: Workflow, label: "Workflows Created", value: "2.5M+", color: "text-green-600" },
    { icon: Star, label: "Customer Rating", value: "4.9/5", color: "text-yellow-600" },
    { icon: TrendingUp, label: "Time Saved", value: "1B+ hrs", color: "text-purple-600" }
  ]

  const features = [
    { text: "500+ API integrations (REST, GraphQL, Webhooks)", icon: CheckCircle },
    { text: "Visual API workflow builder", icon: CheckCircle },
    { text: "AI-powered automation and analytics", icon: CheckCircle },
    { text: "Real-time monitoring and notifications", icon: CheckCircle }
  ]

  const trustLogos = [
    { name: "Google", color: "#4285F4" },
    { name: "Microsoft", color: "#00BCF2" },
    { name: "Salesforce", color: "#00A1E0" },
    { name: "Slack", color: "#4A154B" },
    { name: "Shopify", color: "#96BF48" },
    { name: "Airtable", color: "#18BFFF" }
  ]

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
      
      {/* Subtle grid pattern - full width */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(90deg, #000 1px, transparent 1px),
            linear-gradient(0deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 mx-[5%] pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              <span>Trusted by many businesses worldwide</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
            >
              Automate APIs,
              <br />
              <span className="text-blue-600">
                Scale Seamlessly
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-gray-600 leading-relaxed max-w-xl"
            >
              Connect APIs and automate complex workflows with ease. 
              Build powerful integrations without code - just design, deploy, and scale.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-3"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8"
            >
              <p className="text-sm text-gray-500 mb-6">
                Trusted by <span className="font-semibold">50,000+</span> professionals and <span className="font-semibold">5,000+</span> companies worldwide
              </p>
              
              {/* Customer testimonials with photos */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                      alt="Customer 1" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                      alt="Customer 2" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                      alt="Customer 3" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                      alt="Customer 4" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">+2k</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 from 2,341 reviews</span>
                </div>
              </div>
              
              <div className="flex items-center gap-8 opacity-60">
                {trustLogos.map((logo, index) => (
                  <div key={index} className="text-gray-400 font-semibold text-sm">
                    {logo.name}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Dashboard mockup */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Dashboard header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Workflow className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">APIfyn Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6 space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Workflows</p>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                        <p className="text-xs text-green-600">+12% this month</p>
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Workflow className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tasks Automated</p>
                        <p className="text-2xl font-bold text-gray-900">1.2k</p>
                        <p className="text-xs text-blue-600">+320% increase</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart area */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Automation Performance</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Success Rate</span>
                    </div>
                  </div>
                  
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-2 h-32">
                    <div className="flex-1 bg-blue-300 rounded-t-lg h-20 relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">85%</div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">Week 1</div>
                    </div>
                    <div className="flex-1 bg-blue-400 rounded-t-lg h-24 relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">92%</div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">Week 2</div>
                    </div>
                    <div className="flex-1 bg-blue-500 rounded-t-lg h-32 relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">98%</div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">Week 3</div>
                    </div>
                    <div className="flex-1 bg-blue-600 rounded-t-lg h-28 relative">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">96%</div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">Week 4</div>
                    </div>
                  </div>
                </div>

                {/* Additional features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Team Collaboration</p>
                        <p className="text-xs text-gray-500">5 active members</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">99.9% Uptime</p>
                        <p className="text-xs text-gray-500">Enterprise grade</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating user avatar with real person */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                alt="Happy customer" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Additional floating user avatars */}
            <div className="absolute top-8 -left-8 w-12 h-12 rounded-full border-3 border-white shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
                alt="Team member" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -top-6 right-12 w-14 h-14 rounded-full border-3 border-white shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                alt="Business professional" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-12 -right-6 w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                alt="Female professional" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-1/3 -right-8 w-12 h-12 rounded-full border-3 border-white shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                alt="Male professional" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Additional right-side avatar */}
            <div className="absolute top-1/2 right-2 w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                alt="Team lead" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating notification */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100 max-w-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">Workflow completed</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Gmail → AI Analysis → Slack notification sent</p>
            </div>

            {/* Additional right-side elements */}
            <div className="absolute top-16 right-2 bg-blue-50 border border-blue-200 rounded-lg p-2 shadow-sm">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-500" />
                <span className="text-xs font-medium text-blue-700">Auto-sync enabled</span>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute top-32 right-8 bg-white rounded-lg shadow-md p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">95% Complete</span>
              </div>
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-[95%] h-full bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Integration status */}
            <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-xs text-purple-600 font-bold">S</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Slack</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Connected</span>
              </div>
            </div>

            {/* Success indicator floating card */}
            <div className="absolute bottom-8 right-8 bg-green-50 border border-green-200 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">24 workflows active</span>
              </div>
            </div>

            {/* Testimonial card with person */}
            <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 border border-gray-100 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sarah J.</p>
                  <p className="text-xs text-gray-500">Marketing Dir.</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">"Saved 20+ hours/week with automation!"</p>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats section moved to right side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 lg:mt-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredStat(index)}
              onHoverEnd={() => setHoveredStat(null)}
              className="text-center group cursor-pointer"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 ${stat.color} mb-3 transition-all duration-300 ${hoveredStat === index ? 'scale-110 shadow-lg' : ''}`}>
                <stat.icon size={24} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero;