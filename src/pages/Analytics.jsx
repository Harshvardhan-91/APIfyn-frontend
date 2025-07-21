import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Activity,
  Users,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('executions');

  const metrics = {
    executions: {
      current: 1234,
      previous: 1089,
      change: 13.3,
      label: 'Total Executions'
    },
    workflows: {
      current: 12,
      previous: 10,
      change: 20.0,
      label: 'Active Workflows'
    },
    success: {
      current: 98.7,
      previous: 97.2,
      change: 1.5,
      label: 'Success Rate'
    },
    response: {
      current: 245,
      previous: 289,
      change: -15.2,
      label: 'Avg Response Time (ms)'
    }
  };

  const workflowStats = [
    { name: 'Customer Onboarding', executions: 456, success: 99.1, errors: 4, trend: 'up' },
    { name: 'Lead Qualification', executions: 289, success: 97.5, errors: 7, trend: 'up' },
    { name: 'Social Media Monitoring', executions: 234, success: 98.8, errors: 3, trend: 'down' },
    { name: 'Invoice Processing', executions: 189, success: 95.2, errors: 9, trend: 'up' },
    { name: 'Email Campaigns', executions: 66, success: 100, errors: 0, trend: 'up' }
  ];

  const recentErrors = [
    { 
      id: 1, 
      workflow: 'Customer Onboarding', 
      error: 'API rate limit exceeded', 
      time: '2 minutes ago',
      severity: 'high'
    },
    { 
      id: 2, 
      workflow: 'Lead Qualification', 
      error: 'Invalid email format', 
      time: '15 minutes ago',
      severity: 'medium'
    },
    { 
      id: 3, 
      workflow: 'Invoice Processing', 
      error: 'Connection timeout', 
      time: '1 hour ago',
      severity: 'low'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
              <p className="text-gray-600">Monitor your workflow performance and system health</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(metrics).map(([key, metric]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMetric(key)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  {key === 'executions' && <Zap className="w-6 h-6 text-blue-600" />}
                  {key === 'workflows' && <Activity className="w-6 h-6 text-blue-600" />}
                  {key === 'success' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                  {key === 'response' && <Clock className="w-6 h-6 text-blue-600" />}
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(metric.change)}`}>
                  {getChangeIcon(metric.change)}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {key === 'success' ? `${metric.current}%` : metric.current.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Execution Trends */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Execution Trends</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Executions
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Success Rate
                </div>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">Integration with Chart.js or Recharts</p>
              </div>
            </div>
          </div>

          {/* Workflow Performance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Workflow Performance</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Details
              </button>
            </div>
            <div className="space-y-4">
              {workflowStats.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{workflow.name}</p>
                      <p className="text-sm text-gray-500">{workflow.executions} executions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{workflow.success}%</p>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                    <div className={`flex items-center gap-1 ${workflow.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {workflow.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Errors & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Errors */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Errors</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentErrors.map((error) => (
                <div key={error.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{error.workflow}</p>
                    <p className="text-sm text-gray-600">{error.error}</p>
                    <p className="text-xs text-gray-500">{error.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(error.severity)}`}>
                    {error.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">System Health</h2>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                All systems operational
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">API Uptime</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">99.9%</p>
                  <p className="text-xs text-gray-500">Excellent</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-sm text-gray-500">Average last hour</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">245ms</p>
                  <p className="text-xs text-gray-500">Good</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Error Rate</p>
                    <p className="text-sm text-gray-500">Last 24 hours</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-yellow-600">1.3%</p>
                  <p className="text-xs text-gray-500">Acceptable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
