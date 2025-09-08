import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  MoreHorizontal,
  Zap,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Workflows = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch workflows from backend
  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!user?.idToken) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workflow`, {
          headers: {
            'Authorization': `Bearer ${user.idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setWorkflows(result.workflows);
          }
        } else {
          console.error('Failed to fetch workflows:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching workflows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [user]);

  // Process workflows to ensure all required fields exist
  const processedWorkflows = workflows.map(workflow => ({
    ...workflow,
    status: workflow.isActive ? 'active' : 'paused',
    executions: workflow.totalRuns || 0,
    lastRun: workflow.lastExecutedAt ? new Date(workflow.lastExecutedAt).toLocaleDateString() : 'Never',
    description: workflow.description || 'No description available',
    apps: workflow.definition?.blocks ? 
      Array.from(new Set(workflow.definition.blocks.map(block => {
        // Extract app names from block types
        if (block.type?.includes('gmail')) return 'Gmail';
        if (block.type?.includes('slack')) return 'Slack';
        if (block.type?.includes('discord')) return 'Discord';
        if (block.type?.includes('typeform')) return 'Typeform';
        if (block.type?.includes('sheets')) return 'Google Sheets';
        if (block.type?.includes('notion')) return 'Notion';
        if (block.type?.includes('webhook')) return 'Webhook';
        if (block.type?.includes('stripe')) return 'Stripe';
        if (block.type?.includes('calendar')) return 'Calendar';
        return 'Custom';
      }))) : [],
    created: workflow.createdAt ? new Date(workflow.createdAt).toLocaleDateString() : 'Unknown'
  }));
  
  const displayWorkflows = processedWorkflows;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredWorkflows = displayWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || workflow.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflows</h1>
              <p className="text-gray-600">Manage and monitor your automation workflows</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/workflows/create')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Workflow
            </motion.button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="failed">Failed</option>
            </select>
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/workflows/${workflow.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {workflow.name}
                    </h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {getStatusIcon(workflow.status)}
                      {workflow.status}
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">{workflow.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{workflow.executions}</p>
                  <p className="text-xs text-gray-500">Executions</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
                  <p className="text-xs text-gray-500">Last run</p>
                </div>
              </div>

              {/* Connected Apps */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {(workflow.apps || []).slice(0, 3).map((app, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-bold">{app.charAt(0)}</span>
                    </div>
                  ))}
                  {(workflow.apps || []).length > 3 && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-gray-600 text-xs">+{(workflow.apps || []).length - 3}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">{(workflow.apps || []).length} apps</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Created {workflow.created}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Play className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Pause className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first workflow to get started with automation'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/workflows/create')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Your First Workflow
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflows;
