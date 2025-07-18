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
    totalWorkflows: 12,
    executionsToday: 156,
    connectedApps: 6,
    thisWeek: 1234,
    recentActivity: [
      {
        id: 1,
        name: "Customer Onboarding Flow",
        type: "workflow_execution",
        status: "completed",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        duration: "2.3s"
      },
      {
        id: 2,
        name: "Slack Integration",
        type: "app_connection",
        status: "connected",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        duration: null
      },
      {
        id: 3,
        name: "Email Campaign Trigger",
        type: "workflow_execution",
        status: "completed",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        duration: "1.8s"
      },
      {
        id: 4,
        name: "Data Sync Process",
        type: "workflow_execution",
        status: "failed",
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        duration: "0.5s"
      }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/dashboard', {
          headers: {
            'Authorization': `Bearer ${user.idToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'there'}!
              </h1>
              <p className="text-gray-600">
                Your automation hub is running smoothly. Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/workflows/create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                Create Workflow
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.totalWorkflows || 0}
            </h3>
            <p className="text-gray-600 text-sm font-medium">Active Workflows</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                98.7% success
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.executionsToday || 0}
            </h3>
            <p className="text-gray-600 text-sm font-medium">Executions Today</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                8 active
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.connectedApps || 0}
            </h3>
            <p className="text-gray-600 text-sm font-medium">Connected Apps</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +24%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dashboardData?.thisWeek || 0}
            </h3>
            <p className="text-gray-600 text-sm font-medium">This Week</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between p-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors">
                  View all
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="space-y-3">
                  {dashboardData?.recentActivity?.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-gray-200"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                        {getActivityIcon(activity.type, activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{activity.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                          {activity.duration && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {activity.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/workflows/create')}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all duration-200 group border border-indigo-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-indigo-700 block">Create Workflow</span>
                    <span className="text-xs text-indigo-600">Build new automation</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600" />
                </button>
                
                <button 
                  onClick={() => navigate('/integrations')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-700 block">Connect Apps</span>
                    <span className="text-xs text-gray-500">Add integrations</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                
                <button 
                  onClick={() => navigate('/analytics')}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-700 block">View Analytics</span>
                    <span className="text-xs text-gray-500">Performance insights</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>

            {/* Connected Apps */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Connected Apps</h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 block">Gmail</span>
                    <span className="text-xs text-green-600">Connected</span>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Slack className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 block">Slack</span>
                    <span className="text-xs text-blue-600">Connected</span>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 block">Notion</span>
                    <span className="text-xs text-purple-600">Connected</span>
                  </div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                
                <button 
                  onClick={() => navigate('/integrations')}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                >
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Add Integration</span>
                </button>
              </div>
            </div>

            {/* Workflow Performance */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Performance Insight</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="text-sm font-semibold text-emerald-600">98.7%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{width: '98.7%'}}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Execution Time</span>
                  <span className="text-sm font-semibold text-blue-600">2.3s</span>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/analytics')}
                className="w-full mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 bg-white hover:bg-indigo-50 py-2 px-4 rounded-lg transition-colors"
              >
                View Details
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;