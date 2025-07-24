import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Check, 
  ExternalLink,
  Settings,
  Star,
  Users,
  Zap,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  Database,
  Cloud,
  CreditCard,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Integrations = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch connected integrations from backend
  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!user?.idToken) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integration`, {
          headers: {
            'Authorization': `Bearer ${user.idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setConnectedIntegrations(result.integrations || []);
          }
        }
      } catch (error) {
        console.error('Error fetching integrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, [user]);

  const handleConnect = async (integrationName) => {
    try {
      alert(`Connecting to ${integrationName}... This will redirect to OAuth flow.`);
      // TODO: Implement OAuth flow for each integration
      console.log(`Connecting to ${integrationName}`);
    } catch (error) {
      console.error('Error connecting integration:', error);
      alert('Failed to connect integration');
    }
  };

  // Available integrations (these could come from backend too)
  const availableIntegrations = [
    {
      id: 'gmail',
      name: "Gmail",
      description: "Send and receive emails automatically",
      icon: <Mail className="w-6 h-6" />,
      category: "Email",
      popular: true,
      rating: 4.8,
      color: "bg-red-100 text-red-600"
    },
    {
      id: 'slack',
      name: "Slack",
      description: "Send messages and notifications to channels",
      icon: <MessageSquare className="w-6 h-6" />,
      category: "Communication",
      popular: true,
      rating: 4.9,
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: 'google-sheets',
      name: "Google Sheets",
      description: "Create, update, and manage spreadsheets",
      icon: <FileText className="w-6 h-6" />,
      category: "Productivity",
      popular: true,
      rating: 4.7,
      color: "bg-green-100 text-green-600"
    },
    {
      id: 'typeform',
      name: "Typeform",
      description: "Collect and process form submissions",
      icon: <FileText className="w-6 h-6" />,
      category: "Forms",
      popular: true,
      rating: 4.6,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 'hubspot',
      name: "HubSpot",
      description: "Manage contacts, deals, and marketing campaigns",
      icon: <Database className="w-6 h-6" />,
      category: "CRM",
      popular: true,
      rating: 4.5,
      color: "bg-orange-100 text-orange-600"
    },
    {
      id: 'stripe',
      name: "Stripe",
      description: "Process payments and manage subscriptions",
      icon: <CreditCard className="w-6 h-6" />,
      category: "Payment",
      popular: true,
      rating: 4.8,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      id: 'notion',
      name: "Notion",
      description: "Create and update database entries",
      icon: <Database className="w-6 h-6" />,
      category: "Productivity",
      popular: false,
      rating: 4.4,
      color: "bg-gray-100 text-gray-600"
    },
    {
      id: 'twitter',
      name: "Twitter",
      description: "Post tweets and monitor mentions",
      icon: <Globe className="w-6 h-6" />,
      category: "Social Media",
      popular: false,
      rating: 4.3,
      color: "bg-sky-100 text-sky-600"
    },
    {
      id: 'google-drive',
      name: "Google Drive",
      description: "Upload, organize, and share files",
      icon: <Cloud className="w-6 h-6" />,
      category: "Storage",
      popular: false,
      rating: 4.6,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      id: 'calendly',
      name: "Calendly",
      description: "Schedule meetings and appointments",
      icon: <Calendar className="w-6 h-6" />,
      category: "Scheduling",
      popular: false,
      rating: 4.7,
      color: "bg-teal-100 text-teal-600"
    }
  ];

  // Merge available integrations with connected status
  const integrations = availableIntegrations.map(integration => ({
    ...integration,
    connected: connectedIntegrations.some(conn => conn.type === integration.id || conn.name === integration.name)
  }));

  const categories = [
    'all', 'Email', 'Communication', 'Productivity', 'Forms', 'CRM', 
    'Payment', 'Social Media', 'Storage', 'Scheduling'
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'connected' && integration.connected) ||
                         (filterStatus === 'available' && !integration.connected);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const connectedCount = integrations.filter(i => i.connected).length;
  const popularIntegrations = integrations.filter(i => i.popular && !i.connected).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integrations</h1>
          <p className="text-gray-600">Connect your favorite apps to automate workflows</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{connectedCount}</p>
                <p className="text-sm text-gray-500">Connected Apps</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{integrations.length - connectedCount}</p>
                <p className="text-sm text-gray-500">Available Apps</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                <p className="text-sm text-gray-500">Total Apps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Integrations */}
        {popularIntegrations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularIntegrations.map((integration) => (
                <motion.div
                  key={integration.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${integration.color}`}>
                      {integration.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{integration.rating}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Connect
                    </motion.button>
                  </div>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search integrations..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="connected">Connected</option>
              <option value="available">Available</option>
            </select>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIntegrations.map((integration, index) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${integration.color} group-hover:scale-110 transition-transform`}>
                  {integration.icon}
                </div>
                <div className="flex items-center gap-2">
                  {integration.popular && (
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                  {integration.connected && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Connected
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {integration.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {integration.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{integration.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.connected ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConnect(integration.name.toLowerCase())}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Connect
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
