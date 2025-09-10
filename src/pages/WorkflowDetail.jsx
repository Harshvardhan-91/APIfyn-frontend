import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WebhookSetup from '../components/WebhookSetup';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Share,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Calendar,
  MoreHorizontal
} from 'lucide-react';

const WorkflowDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executions, setExecutions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!user?.idToken || !id) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workflow/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setWorkflow(result.workflow);
            setExecutions(result.workflow.executions || []);
          } else {
            setError('Workflow not found');
          }
        } else {
          setError('Failed to fetch workflow');
        }
      } catch (error) {
        console.error('Error fetching workflow:', error);
        setError('Error loading workflow');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [user, id]);

  const handleToggleStatus = async () => {
    if (!workflow) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workflow/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !workflow.isActive
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setWorkflow(prev => ({ ...prev, isActive: !prev.isActive }));
        }
      }
    } catch (error) {
      console.error('Error toggling workflow status:', error);
    }
  };

  const handleDelete = async () => {
    if (!workflow || !confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workflow/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/workflows');
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  const handleTestWorkflow = async () => {
    if (!workflow) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/webhooks/test/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Test workflow result:', result);
        alert('Test workflow triggered successfully! Check your Slack channel.');
        // Refresh the page to see new execution data
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert('Test failed: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error testing workflow:', error);
      alert('Error testing workflow: ' + error.message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'RUNNING': return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'RUNNING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Workflow not found</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/workflows')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Workflows
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/workflows')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{workflow.name}</h1>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {workflow.isActive ? <CheckCircle className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  {workflow.isActive ? 'Active' : 'Paused'}
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {workflow.description || 'No description available'}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                workflow.isActive
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {workflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {workflow.isActive ? 'Pause' : 'Activate'}
            </button>
            
            <button
              onClick={handleTestWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Activity className="w-4 h-4" />
              Test Workflow
            </button>
            
            <button
              onClick={() => navigate(`/workflows/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
              <Share className="w-4 h-4" />
              Share
            </button>
            
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{workflow.totalRuns || 0}</p>
                    <p className="text-sm text-gray-500">Total Runs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{workflow.successfulRuns || 0}</p>
                    <p className="text-sm text-gray-500">Successful</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{workflow.failedRuns || 0}</p>
                    <p className="text-sm text-gray-500">Failed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {workflow.avgExecutionTime ? `${workflow.avgExecutionTime}ms` : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">Avg Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Executions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Executions</h3>
              
              {executions.length > 0 ? (
                <div className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(execution.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            Execution #{execution.id.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(execution.startedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </div>
                        {execution.duration && (
                          <p className="text-xs text-gray-500 mt-1">
                            {execution.duration}ms
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <h4 className="text-sm font-medium text-gray-900 mb-1">No executions yet</h4>
                  <p className="text-sm text-gray-500">This workflow hasn't been executed yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-sm text-gray-900 capitalize">{workflow.category || 'General'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Trigger Type</p>
                  <p className="text-sm text-gray-900 capitalize">{workflow.triggerType || 'Manual'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                {workflow.lastExecutedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Executed</p>
                    <p className="text-sm text-gray-900">
                      {new Date(workflow.lastExecutedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Play className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Run Now</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Configure</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Setup Section */}
        <div className="mt-8">
          <WebhookSetup workflow={workflow} />
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail;
