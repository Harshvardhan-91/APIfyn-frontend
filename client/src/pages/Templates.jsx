import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Play, 
  Copy,
  Clock,
  Users,
  Zap,
  Mail,
  MessageSquare,
  FileText,
  Database,
  Calendar,
  Globe,
  CreditCard,
  Bell,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Templates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const templates = [
    {
      id: 1,
      name: "Customer Onboarding Automation",
      description: "Automatically welcome new customers with personalized emails and setup their accounts",
      category: "Customer Success",
      type: "popular",
      apps: ["Typeform", "Gmail", "Slack", "Google Sheets"],
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      rating: 4.8,
      uses: 1234,
      time: "5 min",
      complexity: "Beginner"
    },
    {
      id: 2,
      name: "Lead Qualification Pipeline",
      description: "Score leads from forms and route them to the right sales team automatically",
      category: "Sales",
      type: "popular",
      apps: ["Typeform", "HubSpot", "Slack"],
      icon: <Database className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
      rating: 4.9,
      uses: 987,
      time: "10 min",
      complexity: "Intermediate"
    },
    {
      id: 3,
      name: "Social Media Monitoring",
      description: "Monitor brand mentions across social platforms and get instant notifications",
      category: "Marketing",
      type: "trending",
      apps: ["Twitter", "Slack", "Gmail"],
      icon: <Globe className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600",
      rating: 4.7,
      uses: 543,
      time: "3 min",
      complexity: "Beginner"
    },
    {
      id: 4,
      name: "Invoice Processing Workflow",
      description: "Automatically process invoices from email and organize them in your accounting system",
      category: "Finance",
      type: "new",
      apps: ["Gmail", "Google Drive", "QuickBooks"],
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600",
      rating: 4.6,
      uses: 321,
      time: "15 min",
      complexity: "Advanced"
    },
    {
      id: 5,
      name: "Meeting Scheduler",
      description: "Automatically schedule meetings when someone books a call through your form",
      category: "Productivity",
      type: "popular",
      apps: ["Calendly", "Gmail", "Zoom"],
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-teal-100 text-teal-600",
      rating: 4.8,
      uses: 876,
      time: "8 min",
      complexity: "Intermediate"
    },
    {
      id: 6,
      name: "Support Ticket Router",
      description: "Route support tickets to the right team based on priority and category",
      category: "Support",
      type: "trending",
      apps: ["Zendesk", "Slack", "Gmail"],
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-red-100 text-red-600",
      rating: 4.5,
      uses: 432,
      time: "12 min",
      complexity: "Intermediate"
    },
    {
      id: 7,
      name: "Content Publishing Pipeline",
      description: "Automatically publish blog posts to multiple platforms and notify your team",
      category: "Content",
      type: "new",
      apps: ["WordPress", "Twitter", "LinkedIn", "Slack"],
      icon: <FileText className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600",
      rating: 4.4,
      uses: 234,
      time: "20 min",
      complexity: "Advanced"
    },
    {
      id: 8,
      name: "Email Drip Campaign",
      description: "Send personalized follow-up emails based on customer behavior and triggers",
      category: "Marketing",
      type: "popular",
      apps: ["Gmail", "Google Sheets", "Mailchimp"],
      icon: <Mail className="w-6 h-6" />,
      color: "bg-pink-100 text-pink-600",
      rating: 4.7,
      uses: 654,
      time: "18 min",
      complexity: "Intermediate"
    }
  ];

  const categories = [
    'all', 'Customer Success', 'Sales', 'Marketing', 'Finance', 
    'Productivity', 'Support', 'Content'
  ];

  const types = [
    'all', 'popular', 'trending', 'new'
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'popular': return 'bg-yellow-100 text-yellow-800';
      case 'trending': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredTemplates = templates.filter(t => t.type === 'popular').slice(0, 3);

  const handleUseTemplate = (template) => {
    // Navigate to workflow builder with template pre-loaded
    navigate(`/workflows/create?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Templates</h1>
          <p className="text-gray-600">Get started quickly with pre-built automation workflows</p>
        </div>

        {/* Featured Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleUseTemplate(template)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${template.color}`}>
                    {template.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                      {template.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{template.rating}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {template.apps.slice(0, 3).map((app, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center"
                        >
                          <span className="text-white text-xs font-bold">{app.charAt(0)}</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{template.apps.length} apps</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    Use Template
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleUseTemplate(template)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${template.color} group-hover:scale-110 transition-transform`}>
                  {template.icon}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                    {template.type}
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{template.uses}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{template.time}</span>
                </div>
              </div>

              {/* Category and Complexity */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {template.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                  {template.complexity}
                </span>
              </div>

              {/* Connected Apps */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {template.apps.slice(0, 3).map((app, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-bold">{app.charAt(0)}</span>
                      </div>
                    ))}
                    {template.apps.length > 3 && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-gray-600 text-xs">+{template.apps.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{template.apps.length} apps</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
