import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  Zap, 
  CheckCircle, 
  Activity,
  TrendingUp,
  Plus,
  Link2,
  ChevronRight,
  Clock,
  Users,
  ArrowUpRight,
  Settings,
  Play,
  Pause,
  AlertCircle,
  GitBranch,
  Workflow,
  Calendar,
  Timer,
  Target,
  Sparkles,
  Bot,
  Database,
  Send,
  Mail,
  Slack,
  Chrome,
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalWorkflows: 0,
    executionsToday: 0,
    connectedApps: 0,
    thisWeek: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.idToken) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/dashboard`, {
          headers: {
            'Authorization': `Bearer ${user.idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setDashboardData(result.data);
          }
        } else {
          console.error('Failed to fetch dashboard data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);



  const getActivityIcon = (type, status) => {
    if (status === 'failed') {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (type === 'workflow_execution') {
      return <Play className="w-5 h-5 text-blue-500" />;
    }
    if (type === 'app_connection') {
      return <Link2 className="w-5 h-5 text-green-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'connected':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] }!
              </h1>
              <p className="text-gray-600">
                You have <span className="font-semibold text-indigo-600">{dashboardData?.totalWorkflows || 0} workflows</span> running today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Calendar className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/workflows/create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Workflow
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.totalWorkflows || 0}</p>
                  <p className="text-sm text-gray-500">Active Workflows</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">+12%</p>
                <p className="text-xs text-gray-400">This month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.executionsToday || 0}</p>
                  <p className="text-sm text-gray-500">Executions Today</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">98.7%</p>
                <p className="text-xs text-gray-400">Success rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.connectedApps || 0}</p>
                  <p className="text-sm text-gray-500">Connected Apps</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">8 active</p>
                <p className="text-xs text-gray-400">This week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.thisWeek || 0}</p>
                  <p className="text-sm text-gray-500">This Week</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">+24%</p>
                <p className="text-xs text-gray-400">vs last week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Usage Section */}
        {dashboardData?.plan && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {dashboardData.plan.name} Plan
                </h3>
                <p className="text-sm text-gray-600">
                  {dashboardData.plan.subscriptionStatus === 'active' 
                    ? `Active until ${new Date(dashboardData.plan.subscriptionEndDate).toLocaleDateString()}`
                    : 'Free plan with limited features'
                  }
                </p>
              </div>
              {dashboardData.plan.type === 'FREE' && (
                <button 
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Upgrade Plan
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Workflows Usage */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Workflows</span>
                  <span className="text-sm text-gray-500">
                    {dashboardData.plan.workflowsUsed} / {dashboardData.plan.workflowsLimit === 999999 ? '∞' : dashboardData.plan.workflowsLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      dashboardData.plan.workflowsUsed >= dashboardData.plan.workflowsLimit 
                        ? 'bg-red-500' 
                        : dashboardData.plan.workflowsUsed / dashboardData.plan.workflowsLimit > 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (dashboardData.plan.workflowsUsed / dashboardData.plan.workflowsLimit) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* API Calls Usage */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">API Calls</span>
                  <span className="text-sm text-gray-500">
                    {dashboardData.plan.apiCallsUsed} / {dashboardData.plan.apiCallsLimit === 999999 ? '∞' : dashboardData.plan.apiCallsLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      dashboardData.plan.apiCallsUsed >= dashboardData.plan.apiCallsLimit 
                        ? 'bg-red-500' 
                        : dashboardData.plan.apiCallsUsed / dashboardData.plan.apiCallsLimit > 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (dashboardData.plan.apiCallsUsed / dashboardData.plan.apiCallsLimit) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Now balanced 1:1 instead of 2:1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {dashboardData?.recentActivity?.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                      {getActivityIcon(activity.type, activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{activity.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        {activity.duration && (
                          <span className="text-xs text-gray-500">
                            {activity.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stacked sections */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/workflows/create')}
                  className="w-full flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-indigo-900">Create Workflow</p>
                    <p className="text-xs text-indigo-600">Build new automation</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </button>
                
                <button 
                  onClick={() => navigate('/integrations')}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">Connect Apps</p>
                    <p className="text-xs text-gray-500">Add integrations</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button 
                  onClick={() => navigate('/analytics')}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">View Analytics</p>
                    <p className="text-xs text-gray-500">Performance insights</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Connected Apps */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Connected Apps</h3>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  See all
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Gmail</p>
                    <p className="text-xs text-green-600">Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Slack</p>
                    <p className="text-xs text-green-600">Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Notion</p>
                    <p className="text-xs text-green-600">Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <button 
                  onClick={() => navigate('/integrations')}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Add Integration</span>
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Performance Insight</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-emerald-600">98.7%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{width: '98.7%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Avg. Execution Time</span>
                    <span className="font-semibold text-blue-600">2.3s</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/analytics')}
                className="w-full mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 py-2 px-4 rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;