import React, { useState, useEffect } from 'react';
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

// Default empty metrics
const defaultMetrics = {
  executions: {
    current: 0,
    previous: 0,
    change: 0,
    label: 'Total Executions'
  },
  workflows: {
    current: 0,
    previous: 0,
    change: 0,
    label: 'Active Workflows'
  },
  success: {
    current: 0,
    previous: 0,
    change: 0,
    label: 'Success Rate'
  },
  response: {
    current: 0,
    previous: 0,
    change: 0,
    label: 'Avg Response Time (ms)'
  }
};

const Analytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/analytics?range=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setAnalyticsData(data.analytics);
        } else {
          // Use default empty data on error
          setAnalyticsData(defaultMetrics);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalyticsData(defaultMetrics);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, timeRange]);

  // Use analytics data if available, otherwise default empty metrics
  const metrics = analyticsData || defaultMetrics;

  // Get workflow stats from analytics data or use empty array
  const workflowStats = analyticsData?.workflowStats || [];

  // Get recent errors from analytics data or use empty array
  const recentErrors = analyticsData?.recentErrors || [];

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

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">`
          {Object.entries(metrics).map(([key, metric]) => (
            <div
              key={key}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
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
            </div>
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
        </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
