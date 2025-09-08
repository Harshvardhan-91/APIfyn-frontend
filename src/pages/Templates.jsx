import React, { useState, useEffect } from 'react';
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
  const [templates] = useState([
    {
      id: 'github-slack-template',
      name: 'GitHub → Slack',
      description: 'Get instant Slack notifications when code is pushed to your GitHub repository. Perfect for keeping your team updated on development progress.',
      category: 'Developer Tools',
      type: 'popular',
      complexity: 'Beginner',
      setup_time: '2 mins',
      usage_count: 1800,
      steps: [
        { name: "GitHub", logo: "https://github.githubassets.com/favicons/favicon.svg" },
        { name: "Slack", logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" }
      ]
    },
    {
      id: 'notion-sheets-template',
      name: 'Notion → Google Sheets',
      description: 'Automatically sync new Notion database entries to Google Sheets for easier data analysis and reporting.',
      category: 'Productivity',
      type: 'trending',
      complexity: 'Intermediate',
      setup_time: '3 mins',
      usage_count: 1200,
      steps: [
        { name: "Notion", logo: "https://www.notion.so/images/favicon.ico" },
        { name: "Google Sheets", logo: "https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png" }
      ]
    }
  ]);
  const [loading] = useState(false);

  // Static templates instead of fetching from backend

  const categories = [
    'all', 'Developer Tools', 'Productivity'
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

  const handleUseTemplate = async (template) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      // Create workflow from template
      const response = await fetch('/api/templates/duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ templateId: template.id })
      });

      const data = await response.json();
      if (data.success) {
        // Navigate to the new workflow
        navigate(`/workflows/${data.workflow.id}`);
      } else {
        console.error('Error creating workflow from template:', data.error);
      }
    } catch (error) {
      console.error('Error using template:', error);
      // Fallback to workflow builder with template info
      navigate(`/workflows/create?template=${template.id}`);
    }
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
                      {template.steps.slice(0, 3).map((step, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center"
                        >
                          <img src={step.logo} alt={step.name} className="w-4 h-4 rounded" />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{template.steps.length} apps</span>
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                    {template.steps && template.steps.slice(0, 3).map((step, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center"
                      >
                        <img src={step.logo} alt={step.name} className="w-4 h-4 rounded" />
                      </div>
                    ))}
                    {template.steps && template.steps.length > 3 && (
                      <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-gray-600 text-xs">+{template.steps.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{template.steps ? template.steps.length : 0} apps</span>
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
        )}

        {/* Empty State */}
        {!loading && filteredTemplates.length === 0 && (
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
