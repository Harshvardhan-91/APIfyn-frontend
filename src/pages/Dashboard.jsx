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
                <p className="text-sm font-medium text-gray-500">0%</p>
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
                <p className="text-sm font-medium text-gray-500">--</p>
                <p className="text-xs text-gray-400">Success rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.connectedApps || 0}</p>
                  <p className="text-sm text-gray-500">Connected Apps</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">0 connected</p>
                <p className="text-xs text-gray-400">Available: 5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData?.thisWeek || 0}</p>
                  <p className="text-sm text-gray-500">This Week</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">0%</p>
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
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
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

        {/* Main Content - Independent sections with fixed height */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Recent Activity - Fixed height, no scroll */}
          <div className="bg-white rounded-xl border border-gray-200 h-96">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all
              </button>
            </div>
            
            <div className="p-4 overflow-hidden">
              {dashboardData?.recentActivity?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentActivity.slice(0, 4).map((activity) => (
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
              ) : (
                <div className="flex flex-col items-center justify-center h-72 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                  <p className="text-gray-500 mb-6 max-w-sm">
                    Start building workflows to see your automation activity here. Create your first workflow to get started.
                  </p>
                  <div className="space-y-3 w-full max-w-sm">
                    <button
                      onClick={() => navigate('/workflows/create')}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                      Create Your First Workflow
                    </button>
                    <button
                      onClick={() => navigate('/templates')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                      Browse Templates
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stacked sections */}
          <div className="space-y-6">
            
            {/* Quick Actions - Fixed height, no scroll */}
            <div className="bg-white rounded-xl border border-gray-200 h-96">
              <div className="flex items-center gap-2 mb-4 p-4">
                <Zap className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 overflow-hidden">
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
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" alt="Gmail" className="w-6 h-6 rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Gmail</p>
                    <p className="text-xs text-gray-500">Not Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Slack" className="w-6 h-6 rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Slack</p>
                    <p className="text-xs text-gray-500">Not Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" className="w-6 h-6 rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">GitHub</p>
                    <p className="text-xs text-gray-500">Not Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src="https://www.notion.so/images/favicon.ico" alt="Notion" className="w-6 h-6 rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Notion</p>
                    <p className="text-xs text-gray-500">Not Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src="https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png" alt="Google Sheets" className="w-6 h-6 rounded" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Google Sheets</p>
                    <p className="text-xs text-gray-500">Not Connected</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
                
                <button 
                  onClick={() => navigate('/integrations')}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Connect Apps</span>
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Performance Insight</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-gray-500">--</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Avg. Execution Time</span>
                    <span className="font-semibold text-gray-500">--</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div className="bg-gray-300 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No workflow executions yet</p>
                  <p className="text-xs text-gray-400 mt-1">Create workflows to see performance metrics</p>
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