import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  BarChart3, 
  Link2,
  Palette,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Play,
  Globe,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Database
} from 'lucide-react'

const Features = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null)
  
  const mainFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Deploy complex automations in minutes with our drag-and-drop workflow builder. No coding required.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
      stats: "2 min setup",
      metric: "500+",
      metricLabel: "Templates"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and SOC 2 compliance ensure your data stays protected at every level.",
      color: "from-green-500 to-emerald-500", 
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      stats: "99.9% uptime",
      metric: "256-bit",
      metricLabel: "Encryption"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "AI-powered insights reveal optimization opportunities and predict workflow performance.",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50", 
      stats: "Real-time",
      metric: "50+",
      metricLabel: "Metrics"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built-in collaboration tools keep your entire team aligned with shared workflows and permissions.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      stats: "Unlimited",
      metric: "100+",
      metricLabel: "Team size"
    }
  ]

  // FlowAPI integrations - tools that work with our automation platform
  const integrations = [
    { name: "Shopify", category: "E-commerce", icon: "🛍️" },
    { name: "Stripe", category: "Payments", icon: "💳" },
    { name: "Gmail", category: "Email", icon: "📧" },
    { name: "Slack", category: "Communication", icon: "💬" },
    { name: "Airtable", category: "Database", icon: "📊" },
    { name: "Google Sheets", category: "Spreadsheets", icon: "📈" }
  ]

  const trustedByLogos = [
    "Shopify", "Stripe", "Mailchimp", "Zapier", "Airtable", "Discord", "Twilio", "SendGrid", "HubSpot"
  ]

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
       

        {/* Workflow Dashboard Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-16 items-center mb-24"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Visualize your entire workflow
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Get complete visibility into your processes with real-time dashboards, 
              performance metrics, and actionable insights.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time monitoring</h3>
                  <p className="text-gray-600">Track every automation as it runs with live status updates and detailed logs.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance analytics</h3>
                  <p className="text-gray-600">Measure success rates, execution times, and cost savings across all workflows.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Global deployment</h3>
                  <p className="text-gray-600">Run automations across multiple regions with enterprise-grade reliability.</p>
                </div>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Enhanced Dashboard Preview */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Workflow Analytics</h4>
                  <p className="text-gray-500">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-gray-900">98.7%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-gray-900">2.4s</div>
                  <div className="text-sm text-gray-600">Avg Response</div>
                </div>
              </div>
              
              {/* Recent Workflows */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-600 mb-4">Recent Workflows</div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Data Sync</div>
                      <div className="text-xs text-gray-500">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">Success</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email Campaign</div>
                      <div className="text-xs text-gray-500">5 minutes ago</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">Running</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Report Generation</div>
                      <div className="text-xs text-gray-500">12 minutes ago</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">Success</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integrations Section - Professional Design */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Connect your entire tech stack
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Seamlessly integrate with 100+ apps your team already uses daily.
            </p>
          </div>

          {/* Integration Logos Grid - Real Company Style */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-12">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
              {/* Shopify */}
              <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <svg width="100" height="28" viewBox="0 0 100 28" className="h-8">
                  <path d="M95.5 10.9c-.1-.9-.8-1.6-1.7-1.6h-3.8V7.7c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6v1.6h-3.8c-.9 0-1.7.7-1.7 1.6s.8 1.6 1.7 1.6h3.8v1.6c0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6v-1.6h3.8c.9 0 1.7-.7 1.7-1.6zm-20.9 6.4c-.9 0-1.6.7-1.6 1.6v3.2c0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6v-3.2c0-.9-.7-1.6-1.6-1.6zm-15.2 0c-.9 0-1.6.7-1.6 1.6v3.2c0 .9.7 1.6 1.6 1.6s1.6-.7 1.6-1.6v-3.2c0-.9-.7-1.6-1.6-1.6z" fill="#95BF47"/>
                  <text x="15" y="20" fill="#95BF47" fontSize="14" fontWeight="600">Shopify</text>
                </svg>
              </div>

              {/* Stripe */}
              <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <svg width="80" height="28" viewBox="0 0 80 28" className="h-8">
                  <path d="M13.976 9.15c-2.172-.806-3.596-1.336-3.596-2.409 0-.831.683-1.4 1.804-1.4 1.473 0 2.984.523 4.263 1.305l.842-2.984c-1.336-.701-2.87-1.121-4.263-1.121-3.595 0-6.177 1.804-6.177 4.788 0 3.118 2.409 4.23 4.788 5.036 2.409.806 3.118 1.336 3.118 2.409 0 .806-.806 1.473-2.172 1.473-1.473 0-3.118-.7-4.788-1.804l-.842 2.984c1.67.933 3.405 1.336 5.63 1.336 3.766 0 6.348-1.804 6.348-4.788 0-3.118-2.409-4.263-4.955-5.225z" fill="#6772E5"/>
                  <text x="20" y="20" fill="#6772E5" fontSize="14" fontWeight="600">Stripe</text>
                </svg>
              </div>

              {/* Slack */}
              <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <svg width="80" height="28" viewBox="0 0 80 28" className="h-8">
                  <g fill="#E01E5A">
                    <path d="M5.042 15.041a2.521 2.521 0 0 1-2.52-2.52A2.521 2.521 0 0 1 5.042 10a2.521 2.521 0 0 1 2.521 2.521v2.52H5.042z"/>
                    <path d="M6.313 15.041a2.521 2.521 0 0 1 2.521-2.52 2.521 2.521 0 0 1 2.521 2.52v6.437A2.521 2.521 0 0 1 8.834 24a2.521 2.521 0 0 1-2.521-2.522v-6.437z"/>
                  </g>
                  <text x="16" y="20" fill="#E01E5A" fontSize="14" fontWeight="600">Slack</text>
                </svg>
              </div>

              {/* Gmail */}
              <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <svg width="80" height="28" viewBox="0 0 80 28" className="h-8">
                  <path d="M6 6v12h4V10.5L14 14l4-3.5V18h4V6l-8 6z" fill="#EA4335"/>
                  <text x="20" y="20" fill="#EA4335" fontSize="14" fontWeight="600">Gmail</text>
                </svg>
              </div>

              {/* Airtable */}
              <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <svg width="80" height="28" viewBox="0 0 80 28" className="h-8">
                  <path d="M14 6l-8 4v8l8 4 8-4V10l-8-4z" fill="#FCB400"/>
                  <text x="20" y="20" fill="#FCB400" fontSize="12" fontWeight="600">Airtable</text>
                </svg>
              </div>

              {/* Zapier */}
              <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                <svg width="80" height="28" viewBox="0 0 80 28" className="h-8">
                  <path d="M14 8l-2 2h4l-2-2zM10 12l2-2v4l-2-2zM14 16l2-2h-4l2 2zM18 12l-2 2v-4l2 2z" fill="#FF4F00"/>
                  <text x="20" y="20" fill="#FF4F00" fontSize="14" fontWeight="600">Zapier</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Popular Integrations */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🛍️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">E-commerce</h4>
                  <p className="text-sm text-gray-500">Shopify, WooCommerce, BigCommerce</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Automate order processing, inventory updates, and customer notifications.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💼</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">CRM & Sales</h4>
                  <p className="text-sm text-gray-500">Salesforce, HubSpot, Pipedrive</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Sync leads, update deal stages, and trigger follow-up sequences.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Data & Analytics</h4>
                  <p className="text-sm text-gray-500">Google Sheets, Airtable, Notion</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">Transform data between apps and generate automated reports.</p>
            </div>
          </div>

          {/* Trusted By */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-6">Trusted by 50,000+ teams worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-12 mb-8 opacity-60">
              <span className="text-gray-600 font-medium">Microsoft</span>
              <span className="text-gray-600 font-medium">Salesforce</span>
              <span className="text-gray-600 font-medium">Adobe</span>
              <span className="text-gray-600 font-medium">Spotify</span>
              <span className="text-gray-600 font-medium">Airbnb</span>
              <span className="text-gray-600 font-medium">Uber</span>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <span>View All Integrations</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features