import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Search,
  ChevronDown,
  ChevronRight,
  Settings,
  X,
  Mail,
  MessageSquare,
  Database,
  Zap,
  Filter,
  Clock,
  Code,
  Webhook,
  FileText,
  Calendar,
  CreditCard,
  CheckCircle,
  Trash2,
  Edit3,
  TestTube,
  Rocket,
  MousePointer,
  Link,
  ExternalLink,
  Lock,
  AlertCircle,
  Plus,
  Github,
  Eye,
  EyeOff,
  RotateCcw,
  Copy,
  Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

// Generate unique ID
const generateUniqueId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const WorkflowBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get workflow ID from URL params for editing
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  
  const [workflowName, setWorkflowName] = useState('');
  const [isEditing, setIsEditing] = useState(!!id); // true if editing existing workflow
  const [showNamingDialog, setShowNamingDialog] = useState(false);
  const [tempWorkflowName, setTempWorkflowName] = useState('');
  const [zoom, setZoom] = useState(1);
  const [canvasPosition] = useState({ x: 0, y: 0 });
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    triggers: true,
    actions: true,
    conditions: false,
    utilities: false
  });
  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);
  
  // OAuth Integration States
  const [integrations, setIntegrations] = useState({
    github: { connected: false, user: null, loading: false },
    slack: { connected: false, workspaces: [], loading: false }
  });
  const [repositories, setRepositories] = useState([]);
  const [slackChannels, setSlackChannels] = useState([]);
  const [repositoriesLoading, setRepositoriesLoading] = useState(false);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [repoSearchTerm, setRepoSearchTerm] = useState('');
  const [channelSearchTerm, setChannelSearchTerm] = useState('');
  
  // Connection functionality
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Block dragging
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Function to reconstruct icons based on block type
  const getIconForBlockType = (blockType) => {
    console.log('Getting icon for block type:', blockType);
    switch (blockType) {
      case 'github-trigger':
        return <Github className="w-6 h-6 text-white" />;
      case 'slack-send':
        return <MessageSquare className="w-6 h-6 text-white" />;
      case 'webhook':
        return <Webhook className="w-6 h-6 text-white" />;
      case 'http-request':
        return <Zap className="w-6 h-6 text-white" />;
      case 'email-send':
        return <Mail className="w-6 h-6 text-white" />;
      case 'database-query':
        return <Database className="w-6 h-6 text-white" />;
      case 'condition':
        return <Filter className="w-6 h-6 text-white" />;
      case 'delay':
        return <Clock className="w-6 h-6 text-white" />;
      case 'transform':
        return <Code className="w-6 h-6 text-white" />;
      default:
        console.warn(`Unknown block type: ${blockType}, using default icon`);
        return <Settings className="w-6 h-6 text-white" />;
    }
  };

  // Toast function
  const showToast = useCallback((message, type = 'info') => {
    const id = generateUniqueId('toast');
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  // Remove toast function
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // OAuth Integration Functions
  const handleGitHubAuth = async () => {
    try {
      setIntegrations(prev => ({
        ...prev,
        github: { ...prev.github, loading: true }
      }));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/github/auth`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        window.open(data.authUrl, '_blank', 'width=600,height=600');
      }
    } catch (error) {
      console.error('GitHub auth error:', error);
      showToast('Failed to initiate GitHub authentication', 'error');
    } finally {
      setIntegrations(prev => ({
        ...prev,
        github: { ...prev.github, loading: false }
      }));
    }
  };

  const handleSlackAuth = async () => {
    try {
      setIntegrations(prev => ({
        ...prev,
        slack: { ...prev.slack, loading: true }
      }));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/slack/auth`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        window.open(data.authUrl, '_blank', 'width=600,height=600');
      }
    } catch (error) {
      console.error('Slack auth error:', error);
      showToast('Failed to initiate Slack authentication', 'error');
    } finally {
      setIntegrations(prev => ({
        ...prev,
        slack: { ...prev.slack, loading: false }
      }));
    }
  };

  const fetchRepositories = useCallback(async () => {
    if (!integrations.github.connected) return;
    
    try {
      setRepositoriesLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/github/repositories`, {
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRepositories(data.repositories || []);
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      showToast('Failed to load repositories', 'error');
    } finally {
      setRepositoriesLoading(false);
    }
  }, [integrations.github.connected, user?.idToken, showToast]);

  const fetchSlackChannels = useCallback(async () => {
    if (!integrations.slack.connected) return;
    
    try {
      setChannelsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/slack/channels`, {
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSlackChannels(data.channels || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.message && errorData.message.includes('re-authorized')) {
          showToast('Slack integration needs to be updated. Please disconnect and reconnect your Slack account.', 'warning');
        } else {
          showToast('Failed to load Slack channels', 'error');
        }
      }
    } catch (error) {
      console.error('Error fetching Slack channels:', error);
      showToast('Failed to load Slack channels', 'error');
    } finally {
      setChannelsLoading(false);
    }
  }, [integrations.slack.connected, user?.idToken, showToast]);

  // Check integration status on component mount
  useEffect(() => {
    const checkIntegrations = async () => {
      if (!user?.idToken) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/status`, {
          headers: {
            'Authorization': `Bearer ${user.idToken}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Integration status response:', data);
          const newIntegrations = data.integrations || {
            github: { connected: false, user: null, loading: false },
            slack: { connected: false, workspaces: [], loading: false }
          };
          console.log('Setting integrations state to:', newIntegrations);
          setIntegrations(newIntegrations);
          
          // Update block statuses based on integration status
          setBlocks(prev => prev.map(block => {
            if (block.type.includes('github') && newIntegrations.github.connected) {
              return { ...block, integrationStatus: 'connected', status: 'configured' };
            }
            if (block.type.includes('slack') && newIntegrations.slack.connected) {
              return { ...block, integrationStatus: 'connected', status: 'configured' };
            }
            return block;
          }));
        }
      } catch (error) {
        console.error('Error checking integrations:', error);
      }
    };
    
    checkIntegrations();

    // Listen for OAuth success messages
    const handleMessage = (event) => {
      // Allow messages from our backend domain (GitHub OAuth callback)
      const allowedOrigins = [window.location.origin, import.meta.env.VITE_API_URL];
      if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) return;
      
      if (event.data.type === 'github_auth_success' || event.data.type === 'slack_auth_success') {
        // Refresh integration status with a small delay to ensure backend is updated
        setTimeout(() => {
          checkIntegrations();
        }, 1000);
        showToast('Integration connected successfully!', 'success');
      } else if (event.data.type === 'github_auth_error' || event.data.type === 'slack_auth_error') {
        showToast(`Authentication failed: ${event.data.error}`, 'error');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user?.idToken, showToast]);

  // Fetch repositories and channels when integrations become connected
  useEffect(() => {
    if (integrations.github.connected) {
      fetchRepositories();
    }
  }, [integrations.github.connected, fetchRepositories]);

  // Load existing workflow when in edit mode
  useEffect(() => {
    const loadExistingWorkflow = async () => {
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
          if (result.success && result.workflow) {
            const workflow = result.workflow;
            
            // Set workflow name
            setWorkflowName(workflow.name);
            
            // Load workflow definition (blocks and connections)
            if (workflow.definition) {
              // Reconstruct blocks with proper icons and ensure colors are preserved
              const blocksWithIcons = (workflow.definition.blocks || []).map(block => {
                const icon = getIconForBlockType(block.type || block.iconType);
                console.log(`Reconstructing icon for block ${block.id} (${block.type}):`, icon);
                
                // Ensure color class is properly set
                let colorClass = block.color || block.colorClass;
                if (!colorClass) {
                  // Default colors based on block type
                  switch (block.type || block.iconType) {
                    case 'github-trigger':
                      colorClass = 'bg-gray-800';
                      break;
                    case 'slack-send':
                      colorClass = 'bg-purple-600';
                      break;
                    default:
                      colorClass = 'bg-blue-600';
                  }
                }
                
                return {
                  ...block,
                  icon: icon,
                  color: colorClass
                };
              });
              
              console.log('Loaded blocks with icons:', blocksWithIcons);
              setBlocks(blocksWithIcons);
              setConnections(workflow.definition.connections || []);
            }
            
            showToast(`Loaded workflow: ${workflow.name}`, 'success');
          } else {
            showToast('Failed to load workflow', 'error');
            navigate('/workflows');
          }
        } else {
          showToast('Workflow not found', 'error');
          navigate('/workflows');
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
        showToast('Failed to load workflow', 'error');
        navigate('/workflows');
      }
    };

    if (id) {
      loadExistingWorkflow();
    }
  }, [id, user?.idToken, navigate, showToast]);

  useEffect(() => {
    if (integrations.slack.connected) {
      fetchSlackChannels();
    }
  }, [integrations.slack.connected, fetchSlackChannels]);

  // Sync integration status with blocks when integrations state changes
  useEffect(() => {
    const updatedBlocks = blocks.map(block => {
      if (block.type.includes('github') && integrations.github.connected) {
        return { ...block, integrationStatus: 'connected', status: 'configured' };
      }
      if (block.type.includes('slack') && integrations.slack.connected) {
        return { ...block, integrationStatus: 'connected', status: 'configured' };
      }
      return block;
    });
    
    // Check if there are actual integration status changes
    const hasChanges = updatedBlocks.some((block, index) => 
      block.integrationStatus !== blocks[index].integrationStatus || 
      block.status !== blocks[index].status
    );
    
    if (hasChanges) {
      setBlocks(updatedBlocks);
    }
    
    // Update selected block if it's affected
    if (selectedBlock) {
      if (selectedBlock.type.includes('github') && integrations.github.connected && selectedBlock.integrationStatus !== 'connected') {
        setSelectedBlock(prev => ({ ...prev, integrationStatus: 'connected', status: 'configured' }));
      }
      if (selectedBlock.type.includes('slack') && integrations.slack.connected && selectedBlock.integrationStatus !== 'connected') {
        setSelectedBlock(prev => ({ ...prev, integrationStatus: 'connected', status: 'configured' }));
      }
    }
  }, [integrations.github.connected, integrations.slack.connected, blocks, selectedBlock]);

  // Block Library with only GitHub, Slack, Gmail, Notion, Google Sheets
  const blockLibrary = {
    triggers: [
      { 
        id: 'github-trigger', 
        name: 'GitHub Events', 
        icon: <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" className="w-5 h-5 rounded" />, 
        color: 'bg-gray-50', 
        description: 'Triggered by GitHub webhooks (push, PR, issues, etc.)',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Developer Tools'
      },
      { 
        id: 'gmail-trigger', 
        name: 'Gmail Received', 
        icon: <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" alt="Gmail" className="w-5 h-5 rounded" />, 
        color: 'bg-red-50', 
        description: 'Triggered when a new email is received',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Email'
      },
      { 
        id: 'slack-trigger', 
        name: 'Slack Message', 
        icon: <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Slack" className="w-5 h-5 rounded" />, 
        color: 'bg-slate-50', 
        description: 'Triggered when Slack message is received',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Communication'
      },
      { 
        id: 'sheets-trigger', 
        name: 'Google Sheets Row', 
        icon: <img src="https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png" alt="Google Sheets" className="w-5 h-5 rounded" />, 
        color: 'bg-green-50', 
        description: 'Triggered when a new row is added to Google Sheets',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Productivity'
      },
      { 
        id: 'notion-trigger', 
        name: 'Notion Database', 
        icon: <img src="https://www.notion.so/images/favicon.ico" alt="Notion" className="w-5 h-5 rounded" />, 
        color: 'bg-gray-50', 
        description: 'Triggered when a new page is added to Notion database',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Productivity'
      }
    ],
    actions: [
      { 
        id: 'gmail-send', 
        name: 'Send Gmail', 
        icon: <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" alt="Gmail" className="w-5 h-5 rounded" />, 
        color: 'bg-red-50', 
        description: 'Send an email via Gmail',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Email'
      },
      { 
        id: 'slack-send', 
        name: 'Send Slack Message', 
        icon: <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Slack" className="w-5 h-5 rounded" />, 
        color: 'bg-slate-50', 
        description: 'Send a message to Slack channel',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Communication'
      },
      { 
        id: 'sheets-add', 
        name: 'Add to Google Sheets', 
        icon: <img src="https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png" alt="Google Sheets" className="w-5 h-5 rounded" />, 
        color: 'bg-green-50', 
        description: 'Add row to Google Sheets',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Productivity'
      },
      { 
        id: 'notion-create', 
        name: 'Create Notion Page', 
        icon: <img src="https://www.notion.so/images/favicon.ico" alt="Notion" className="w-5 h-5 rounded" />, 
        color: 'bg-gray-50', 
        description: 'Create a new Notion page',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Productivity'
      },
      { 
        id: 'github-issue', 
        name: 'Create GitHub Issue', 
        icon: <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" className="w-5 h-5 rounded" />, 
        color: 'bg-gray-50', 
        description: 'Create a new issue in GitHub repository',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Developer Tools'
      }
    ]
  };

  // Track expanded categories
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSave = useCallback(async () => {
    try {
      console.log('handleSave called');
      if (!user?.idToken) {
        showToast('Please log in to save workflows', 'error');
        return;
      }

      if (!workflowName.trim()) {
        console.log('No workflow name, showing naming dialog');
        // Show naming dialog instead of toast
        setTempWorkflowName(workflowName);
        setShowNamingDialog(true);
        return;
      }

      console.log('Workflow name:', workflowName);
      console.log('Blocks:', blocks.length);

      if (blocks.length === 0) {
        showToast('Please add at least one block to your workflow', 'warning');
        return;
      }

      // Check for unintegrated apps
      const unintegratedBlocks = blocks.filter(block => 
        block.integrationRequired && 
        (block.integrationStatus === 'not-connected' || block.status === 'requires-integration')
      );

      if (unintegratedBlocks.length > 0) {
        const blockNames = unintegratedBlocks.map(block => block.name).join(', ');
        showToast(
          `Please integrate these apps before saving: ${blockNames}. Click on each block to authorize the integration.`, 
          'warning'
        );
        return;
      }

      // Clean the blocks data for JSON serialization
      const cleanBlocks = blocks.map(block => ({
        id: block.id,
        type: block.type,
        name: block.name,
        description: block.description,
        position: block.position,
        config: block.config || {},
        status: block.status,
        // Remove the JSX icon and color classes that can't be serialized
        iconType: block.type, // Keep track of type for icon recreation
        colorClass: block.color
      }));

      const workflowData = {
        name: workflowName,
        description: `Workflow with ${blocks.length} blocks and ${connections.length} connections`,
        definition: {
          blocks: cleanBlocks,
          connections: connections,
          canvas: { zoom, position: canvasPosition }
        },
        category: 'general',
        triggerType: 'MANUAL',
        isActive: true // Make workflows active by default
      };

      console.log('Workflow data to save:', workflowData);
      showToast('Saving workflow...', 'info');

      // Use PUT for updates, POST for new workflows
      const isUpdate = !!id;
      const url = isUpdate 
        ? `${import.meta.env.VITE_API_URL}/api/workflow/${id}`
        : `${import.meta.env.VITE_API_URL}/api/workflow`;
      
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Save result:', result);
        if (result.success) {
          showToast('Workflow saved successfully! 🎉', 'success');
          setTimeout(() => navigate('/workflows'), 1500);
        } else {
          showToast('Failed to save workflow: ' + (result.error || 'Unknown error'), 'error');
        }
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        showToast('Failed to save workflow: ' + (errorData.error || response.statusText), 'error');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      showToast('Error saving workflow: ' + error.message, 'error');
    }
  }, [user, workflowName, blocks, connections, zoom, canvasPosition, navigate, showToast, id]);

  // Handle naming dialog confirmation
  const handleNamingConfirm = useCallback(async () => {
    if (!tempWorkflowName.trim()) {
      showToast('Please enter a workflow name', 'warning');
      return;
    }
    
    console.log('handleNamingConfirm called with name:', tempWorkflowName);
    
    try {
      if (!user?.idToken) {
        showToast('Please log in to save workflows', 'error');
        setShowNamingDialog(false);
        return;
      }

      if (blocks.length === 0) {
        showToast('Please add at least one block to your workflow', 'warning');
        setShowNamingDialog(false);
        return;
      }

      // Check for unintegrated apps
      const unintegratedBlocks = blocks.filter(block => 
        block.integrationRequired && 
        (block.integrationStatus === 'not-connected' || block.status === 'requires-integration')
      );

      if (unintegratedBlocks.length > 0) {
        const blockNames = unintegratedBlocks.map(block => block.name).join(', ');
        showToast(
          `Please integrate these apps before saving: ${blockNames}. Click on each block to authorize the integration.`, 
          'warning'
        );
        setShowNamingDialog(false);
        return;
      }

      // Close dialog immediately and show saving message
      setShowNamingDialog(false);
      showToast('Saving workflow...', 'info');

      // Clean the blocks data for JSON serialization
      const cleanBlocks = blocks.map(block => ({
        id: block.id,
        type: block.type,
        name: block.name,
        description: block.description,
        position: block.position,
        config: block.config || {},
        status: block.status,
        // Remove the JSX icon and color classes that can't be serialized
        iconType: block.type, // Keep track of type for icon recreation
        colorClass: block.color
      }));

      const workflowData = {
        name: tempWorkflowName.trim(), // Use tempWorkflowName directly
        description: `Workflow with ${blocks.length} blocks and ${connections.length} connections`,
        definition: {
          blocks: cleanBlocks,
          connections: connections,
          canvas: { zoom, position: canvasPosition }
        },
        category: 'general',
        triggerType: 'MANUAL',
        isActive: true // Make workflows active by default
      };

      console.log('Workflow data to save:', workflowData);

      // Use PUT for updates, POST for new workflows
      const isUpdate = !!id;
      const url = isUpdate 
        ? `${import.meta.env.VITE_API_URL}/api/workflow/${id}`
        : `${import.meta.env.VITE_API_URL}/api/workflow`;

      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Save result:', result);
        if (result.success) {
          // Update the workflow name in state after successful save
          setWorkflowName(tempWorkflowName.trim());
          showToast('Workflow saved successfully! 🎉', 'success');
          setTimeout(() => navigate('/workflows'), 1500);
        } else {
          showToast('Failed to save workflow: ' + (result.error || 'Unknown error'), 'error');
        }
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        showToast('Failed to save workflow: ' + (errorData.error || response.statusText), 'error');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      showToast('Error saving workflow: ' + error.message, 'error');
      setShowNamingDialog(false);
    }
  }, [tempWorkflowName, user, blocks, connections, zoom, canvasPosition, navigate, showToast, id]);

  const handleBlockDelete = useCallback((blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setConnections(prev => prev.filter(conn => conn.from !== blockId && conn.to !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            console.log('Undo triggered');
            break;
          case 'y':
            e.preventDefault();
            console.log('Redo triggered');
            break;
        }
      }
      
      if (e.key === 'Escape') {
        setIsConnecting(false);
        setConnectionStart(null);
        setTempConnection(null);
        setSelectedBlock(null);
      }
      
      if (e.key === 'Delete' && selectedBlock) {
        handleBlockDelete(selectedBlock.id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlock, handleSave, handleBlockDelete]);

  // Mouse tracking for temporary connections
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isConnecting && connectionStart) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          setMousePosition({
            x: (e.clientX - rect.left - canvasPosition.x) / zoom,
            y: (e.clientY - rect.top - canvasPosition.y) / zoom
          });
        }
      }
    };

    if (isConnecting) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isConnecting, connectionStart, canvasPosition, zoom]);

  const handleDragStart = (e, blockType) => {
    setDraggedBlock(blockType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedBlock) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasPosition.x) / zoom;
    const y = (e.clientY - rect.top - canvasPosition.y) / zoom;

    const newBlock = {
      id: generateUniqueId('block'),
      type: draggedBlock.id,
      name: draggedBlock.name,
      icon: draggedBlock.icon,
      color: draggedBlock.color,
      description: draggedBlock.description,
      position: { x, y },
      config: {},
      status: draggedBlock.integrationRequired && draggedBlock.integrationStatus !== 'ready' ? 'requires-integration' : 'not-configured',
      integrationRequired: draggedBlock.integrationRequired,
      integrationStatus: draggedBlock.integrationStatus,
      category: draggedBlock.category
    };

    setBlocks(prev => [...prev, newBlock]);
    setDraggedBlock(null);
  };

  // Connection handling
  const startConnection = (blockId, event) => {
    event.stopPropagation();
    setIsConnecting(true);
    setConnectionStart(blockId);
    
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setTempConnection({
        from: {
          x: block.position.x + 200,
          y: block.position.y + 50
        },
        to: { x: 0, y: 0 }
      });
    }
  };

  const endConnection = (blockId, event) => {
    event.stopPropagation();
    
    if (connectionStart && connectionStart !== blockId) {
      const existingConnection = connections.find(
        conn => conn.from === connectionStart && conn.to === blockId
      );
      
      if (!existingConnection) {
        const newConnection = {
          id: generateUniqueId('connection'),
          from: connectionStart,
          to: blockId,
          status: 'active'
        };
        
        setConnections(prev => [...prev, newConnection]);
      }
    }
    
    setIsConnecting(false);
    setConnectionStart(null);
    setTempConnection(null);
  };

  const deleteConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  // Block dragging
  const handleBlockMouseDown = (e, blockId) => {
    if (e.target.closest('.connection-port')) return;
    
    e.stopPropagation();
    setIsDraggingBlock(true);
    setDraggedBlockId(blockId);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const block = blocks.find(b => b.id === blockId);
    const startPos = { x: block.position.x, y: block.position.y };

    const handleMouseMove = (e) => {
      const deltaX = (e.clientX - startX) / zoom;
      const deltaY = (e.clientY - startY) / zoom;
      
      setBlocks(prev => prev.map(b => 
        b.id === blockId 
          ? { ...b, position: { x: startPos.x + deltaX, y: startPos.y + deltaY } }
          : b
      ));
    };

    const handleMouseUp = () => {
      setIsDraggingBlock(false);
      setDraggedBlockId(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Connection path calculation
  const getConnectionPath = (fromBlock, toBlock) => {
    if (!fromBlock || !toBlock) return '';
    
    const fromX = fromBlock.position.x + 200;
    const fromY = fromBlock.position.y + 50;
    const toX = toBlock.position.x;
    const toY = toBlock.position.y + 50;
    
    const controlPointOffset = Math.min(Math.abs(toX - fromX) * 0.5, 100);
    const controlX1 = fromX + controlPointOffset;
    const controlX2 = toX - controlPointOffset;
    
    return `M ${fromX},${fromY} C ${controlX1},${fromY} ${controlX2},${toY} ${toX},${toY}`;
  };

  const handleTestRun = async () => {
    try {
      if (!user?.idToken) {
        showToast('Please log in to test workflows', 'error');
        return;
      }

      if (blocks.length === 0) {
        showToast('Please add some blocks to test the workflow', 'warning');
        return;
      }

      if (connections.length === 0 && blocks.length > 1) {
        showToast('Please connect your blocks to create a workflow', 'warning');
        return;
      }

      showToast('Test run started! 🧪', 'info');
      console.log('Testing workflow...', { blocks, connections });
      
      // Simulate test run
      setTimeout(() => {
        showToast('Test run completed successfully! ✅', 'success');
      }, 2000);
    } catch (error) {
      console.error('Error testing workflow:', error);
      showToast('Error testing workflow: ' + error.message, 'error');
    }
  };

  const handlePublish = () => {
    if (!workflowName.trim()) {
      showToast('Please name your workflow before publishing', 'warning');
      setIsEditing(true);
      return;
    }

    if (blocks.length === 0) {
      showToast('Please add blocks to your workflow before publishing', 'warning');
      return;
    }
    
    if (connections.length === 0 && blocks.length > 1) {
      showToast('Please connect your blocks before publishing', 'warning');
      return;
    }

    // Check for unintegrated apps
    const unintegratedBlocks = blocks.filter(block => 
      block.integrationRequired && 
      (block.integrationStatus === 'not-connected' || block.status === 'requires-integration')
    );

    if (unintegratedBlocks.length > 0) {
      const blockNames = unintegratedBlocks.map(block => block.name).join(', ');
      showToast(
        `Please integrate these apps before publishing: ${blockNames}`, 
        'warning'
      );
      return;
    }
    
    showToast('Publishing workflow...', 'info');
    console.log('Publishing workflow...', { name: workflowName, blocks, connections });
    
    // Simulate publish
    setTimeout(() => {
      showToast('Workflow published successfully! 🚀', 'success');
    }, 1500);
  };

  // Function to check integration status from backend
  const checkIntegrationStatus = useCallback(async (provider) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.integrations[provider]?.connected) {
          // Update integrations state
          setIntegrations(prev => ({
            ...prev,
            [provider]: {
              ...prev[provider],
              connected: true,
              loading: false,
              ...(provider === 'github' && data.integrations.github.user && { user: data.integrations.github.user }),
              ...(provider === 'slack' && data.integrations.slack.workspaces && { workspaces: data.integrations.slack.workspaces })
            }
          }));

          // Update blocks that use this provider
          const providerTypes = [`${provider}-trigger`, `${provider}-send`];
          
          setBlocks(prev => prev.map(b => 
            providerTypes.includes(b.type)
              ? { ...b, integrationStatus: 'connected', status: 'configured' }
              : b
          ));
          
          if (selectedBlock && providerTypes.includes(selectedBlock.type)) {
            setSelectedBlock(prev => ({ ...prev, integrationStatus: 'connected', status: 'configured' }));
          }
          
          showToast(`${provider} integration successful! ✅`, 'success');
        } else {
          showToast(`${provider} integration was not completed. Please try again.`, 'warning');
        }
      } else {
        showToast('Failed to check integration status', 'error');
      }
    } catch (error) {
      console.error('Status check error:', error);
      showToast('Failed to verify integration status', 'error');
    }
  }, [user.idToken, selectedBlock, setBlocks, setSelectedBlock, showToast]);

  // Handle OAuth callback results (removed URL parameter handling since we use postMessage)
  // OAuth results are now handled via postMessage in the authorization button click handler

  // Function to check if a block type has any connected instances
  const getBlockTypeIntegrationStatus = (blockTypeId) => {
    const instancesOfType = blocks.filter(block => block.type === blockTypeId);
    if (instancesOfType.length === 0) return 'not-connected';
    
    const hasConnected = instancesOfType.some(block => block.integrationStatus === 'connected');
    if (hasConnected) return 'connected';
    
    return 'not-connected';
  };

  const filteredBlocks = Object.entries(blockLibrary).reduce((acc, [category, blocks]) => {
    const filtered = blocks.filter(block => 
      block.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/workflows')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to workflows"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {workflowName || 'Untitled Workflow'}
                </h1>
                <p className="text-sm text-gray-500">
                  {blocks.length} blocks • {connections.length} connections
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                className="p-2 hover:bg-white rounded-md transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700 min-w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className="p-2 hover:bg-white rounded-md transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Action Buttons */}
            <button
              onClick={() => setShowNamingDialog(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Workflow
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Block Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Block Library</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {Object.entries(filteredBlocks).map(([category, blocks]) => (
              <div key={category} className="border-b border-gray-100">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {category}
                    </span>
                    <span className="text-sm text-gray-500">({blocks.length})</span>
                  </div>
                  {expandedCategories[category] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedCategories[category] && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 p-4">
                        {blocks.map((block) => (
                          <div
                            key={block.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, block)}
                            className="flex items-start gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-all cursor-move group border-2 border-gray-100 hover:border-blue-300 hover:shadow-md"
                            title={block.description}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${block.color} flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                              {block.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-gray-900 text-sm">{block.name}</span>
                                {block.integrationRequired && (
                                  <div className={`w-3 h-3 rounded-full ${
                                    getBlockTypeIntegrationStatus(block.id) === 'connected' ? 'bg-green-500' :
                                    'bg-yellow-500'
                                  } flex-shrink-0`} title={`Integration ${getBlockTypeIntegrationStatus(block.id)}`}></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">{block.description}</p>
                              {block.category && (
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  {block.category}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-50 relative overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={(e) => {
              // Close sidebar when clicking on empty canvas area
              if (e.target === e.currentTarget && selectedBlock) {
                setSelectedBlock(null);
              }
            }}
            style={{
              backgroundImage: `
                radial-gradient(circle, #e5e7eb 1px, transparent 1px),
                linear-gradient(90deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)
              `,
              backgroundSize: '24px 24px, 100% 100%',
              transform: `scale(${zoom}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
            }}
          >
            {/* SVG for connections */}
            <svg 
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              {/* Existing connections */}
              {connections.map((connection) => {
                const fromBlock = blocks.find(b => b.id === connection.from);
                const toBlock = blocks.find(b => b.id === connection.to);
                if (!fromBlock || !toBlock) return null;
                
                return (
                  <g key={connection.id}>
                    <defs>
                      <filter id={`shadow-${connection.id}`}>
                        <dropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    <motion.path
                      d={getConnectionPath(fromBlock, toBlock)}
                      stroke="url(#connectionGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      filter={`url(#shadow-${connection.id})`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="drop-shadow-lg"
                    />
                    {/* Enhanced Arrow head */}
                    <motion.circle
                      cx={toBlock.position.x}
                      cy={toBlock.position.y + 50}
                      r="6"
                      fill="#3b82f6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                      className="drop-shadow-md"
                    />
                    {/* Connection delete button */}
                    <foreignObject
                      x={(fromBlock.position.x + 200 + toBlock.position.x) / 2 - 15}
                      y={(fromBlock.position.y + 50 + toBlock.position.y + 50) / 2 - 15}
                      width="30"
                      height="30"
                      className="pointer-events-auto opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={() => deleteConnection(connection.id)}
                        className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-xl border-2 border-white transition-all hover:scale-110"
                        title="Delete connection"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </foreignObject>
                  </g>
                );
              })}

              {/* Temporary connection while dragging */}
              {isConnecting && tempConnection && (
                <motion.path
                  d={`M ${tempConnection.from.x},${tempConnection.from.y} C ${tempConnection.from.x + 50},${tempConnection.from.y} ${mousePosition.x - 50},${mousePosition.y} ${mousePosition.x},${mousePosition.y}`}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="5,5"
                  className="opacity-70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                />
              )}
            </svg>

            {/* Canvas Content */}
            <div className="absolute inset-0">
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Build Your First Workflow</h3>
                    <p className="text-base text-gray-600 mb-8 leading-relaxed">
                      Start by dragging blocks from the left sidebar to create powerful automations
                    </p>
                    <div className="grid grid-cols-1 gap-4 text-left bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-lg">1</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Start with a Trigger</div>
                          <div className="text-sm text-gray-600">Choose what starts your workflow</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold text-lg">2</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Add Actions</div>
                          <div className="text-sm text-gray-600">Define what happens next</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MousePointer className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Connect Blocks</div>
                          <div className="text-sm text-gray-600">Link blocks by clicking connection ports</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute select-none z-20"
                    style={{
                      left: block.position.x,
                      top: block.position.y,
                      cursor: isDraggingBlock && draggedBlockId === block.id ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={(e) => handleBlockMouseDown(e, block.id)}
                  >
                    <div className={`
                      bg-white rounded-2xl border-2 p-5 shadow-lg min-w-[220px] group hover:shadow-xl transition-all relative
                      ${selectedBlock?.id === block.id ? 'border-blue-500 ring-4 ring-blue-200/50 shadow-blue-200/50' : 'border-gray-200 hover:border-gray-300'}
                      ${isDraggingBlock && draggedBlockId === block.id ? 'shadow-2xl scale-105 rotate-1' : ''}
                    `}>
                      {/* Input Connection Port */}
                      <div
                        className="connection-port absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-lg cursor-pointer hover:from-blue-600 hover:to-blue-700 hover:scale-110 transition-all z-30 group flex items-center justify-center"
                        onClick={(e) => isConnecting ? endConnection(block.id, e) : null}
                        title="Input connection point"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></div>
                        <div className="absolute -inset-2 rounded-full border-2 border-blue-300 opacity-0 group-hover:opacity-100 animate-ping"></div>
                      </div>

                      {/* Output Connection Port */}
                      <div
                        className="connection-port absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-4 border-white shadow-lg cursor-pointer hover:from-green-600 hover:to-green-700 hover:scale-110 transition-all z-30 group flex items-center justify-center"
                        onClick={(e) => !isConnecting ? startConnection(block.id, e) : null}
                        title="Output connection point - click to start connecting"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
                        <div className="absolute -inset-2 rounded-full border-2 border-green-300 opacity-0 group-hover:opacity-100 animate-ping"></div>
                      </div>

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${block.color} shadow-sm relative`}>
                            {block.icon}
                            {block.integrationRequired && block.integrationStatus !== 'connected' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" 
                                   title="Integration required"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">{block.name}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500 capitalize">{block.type.replace('-', ' ')}</p>
                              {block.category && (
                                <>
                                  <span className="text-xs text-gray-300">•</span>
                                  <span className="text-xs text-blue-600">{block.category}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBlock(block);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Configure block"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBlockDelete(block.id);
                            }}
                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete block"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs text-gray-600 line-clamp-2">{block.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              block.status === 'configured' ? 'bg-green-500' :
                              block.status === 'error' ? 'bg-red-500' :
                              block.status === 'testing' ? 'bg-yellow-500 animate-pulse' :
                              block.status === 'requires-integration' ? 'bg-orange-500' :
                              'bg-gray-300'
                            }`}></div>
                            <span className="text-xs text-gray-500 capitalize">
                              {block.status === 'requires-integration' ? 'Needs Integration' : block.status.replace('-', ' ')}
                            </span>
                            {block.integrationRequired && block.integrationStatus !== 'connected' && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                Integration Required
                              </span>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-400 flex items-center gap-4">
                            <span>{connections.filter(c => c.to === block.id).length} in</span>
                            <span>{connections.filter(c => c.from === block.id).length} out</span>
                          </div>
                        </div>
                      </div>

                      {/* Connecting State Indicator */}
                      {isConnecting && connectionStart === block.id && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap animate-bounce">
                          Click another block to connect
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}

              {/* Global Connection Mode Indicator */}
              {isConnecting && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-pulse">
                  <div className="flex items-center gap-3">
                    <MousePointer className="w-5 h-5" />
                    <span className="font-semibold">Connection Mode Active</span>
                    <button
                      onClick={() => {
                        setIsConnecting(false);
                        setConnectionStart(null);
                        setTempConnection(null);
                      }}
                      className="ml-3 text-white hover:text-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-blue-100 mt-1">Click on any input port to complete the connection</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Block Configuration */}
        <AnimatePresence>
          {selectedBlock && (
            <>
              {/* Overlay to close sidebar when clicked */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                onClick={() => setSelectedBlock(null)}
              />
              
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-white border-l border-gray-200 overflow-hidden flex flex-col h-full shadow-2xl relative z-40"
              >
                {/* Fixed Header with Better Close Button */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Configuration</h3>
                    <button
                      onClick={() => setSelectedBlock(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                      title="Close configuration panel (Press Esc)"
                    >
                      <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedBlock.color} shadow-md relative flex-shrink-0`}>
                      {selectedBlock.icon}
                      {selectedBlock.integrationRequired && selectedBlock.integrationStatus !== 'connected' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center" 
                             title="Integration required">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-lg truncate">{selectedBlock.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selectedBlock.description}</p>
                      {selectedBlock.category && (
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {selectedBlock.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-8 space-y-8">
                  {/* Integration Status & Authorization */}
                  {selectedBlock.integrationRequired && (
                    <div className={`p-6 rounded-xl border-2 ${
                      selectedBlock.integrationStatus === 'connected' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${
                            selectedBlock.integrationStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="font-semibold text-gray-900">
                            {selectedBlock.integrationStatus === 'connected' ? 'Integration Connected' : 'Integration Required'}
                          </span>
                        </div>
                        {selectedBlock.integrationStatus === 'connected' && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to disconnect this integration? You will need to re-authorize to use it again.')) {
                                  try {
                                    // Get the provider from block type
                                    let provider = '';
                                    if (selectedBlock.type.includes('github')) provider = 'github';
                                    else if (selectedBlock.type.includes('slack')) provider = 'slack';
                                    
                                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/${provider}/disconnect`, {
                                      method: 'DELETE',
                                      headers: {
                                        'Authorization': `Bearer ${user.idToken}`,
                                        'Content-Type': 'application/json',
                                      },
                                    });
                                    
                                    if (response.ok) {
                                      // Update local state
                                      setIntegrations(prev => ({
                                        ...prev,
                                        [provider]: { ...prev[provider], connected: false }
                                      }));
                                      
                                      // Update blocks
                                      const providerTypes = [`${provider}-trigger`, `${provider}-send`];
                                      setBlocks(prev => prev.map(b => 
                                        providerTypes.includes(b.type)
                                          ? { ...b, integrationStatus: 'not-connected', status: 'requires-integration' }
                                          : b
                                      ));
                                      
                                      if (selectedBlock && providerTypes.includes(selectedBlock.type)) {
                                        setSelectedBlock(prev => ({ ...prev, integrationStatus: 'not-connected', status: 'requires-integration' }));
                                      }
                                      
                                      showToast('Integration disconnected successfully!', 'success');
                                    } else {
                                      showToast('Failed to disconnect integration', 'error');
                                    }
                                  } catch (error) {
                                    console.error('Disconnect error:', error);
                                    showToast('Failed to disconnect integration', 'error');
                                  }
                                }
                              }}
                              className="text-sm text-red-600 hover:text-red-700 underline"
                            >
                              Disconnect
                            </button>
                          </div>
                        )}
                      </div>
                    
                    {selectedBlock.integrationStatus !== 'connected' ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          This block requires authorization to access your {selectedBlock.name} account.
                        </p>
                        <button
                          onClick={async () => {
                            try {
                              showToast(`Initiating ${selectedBlock.name} authorization...`, 'info');
                              
                              // Get the provider name from block type
                              let provider = '';
                              if (selectedBlock.type.includes('gmail')) provider = 'gmail';
                              else if (selectedBlock.type.includes('slack')) provider = 'slack';
                              else if (selectedBlock.type.includes('github')) provider = 'github';
                              else if (selectedBlock.type.includes('notion')) provider = 'notion';
                              else if (selectedBlock.type.includes('discord')) provider = 'discord';
                              else if (selectedBlock.type.includes('stripe')) provider = 'stripe';
                              else if (selectedBlock.type.includes('typeform')) provider = 'typeform';
                              
                              if (!provider) {
                                showToast('Integration not yet supported', 'warning');
                                return;
                              }
                              
                              // Call backend to get OAuth URL
                              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integrations/${provider}/auth`, {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${user.idToken}`,
                                  'Content-Type': 'application/json',
                                },
                              });
                              
                              if (response.ok) {
                                const data = await response.json();
                                if (data.success && data.authUrl) {
                                  showToast(`Redirecting to ${selectedBlock.name}...`, 'info');
                                  
                                  // Open OAuth in new window
                                  const authWindow = window.open(data.authUrl, '_blank', 'width=600,height=700');
                                  
                                  // Listen for postMessage from OAuth window
                                  const handleOAuthMessage = (event) => {
                                    // Verify origin for security
                                    if (event.origin !== import.meta.env.VITE_API_URL.replace('/api', '')) return;
                                    
                                    if (event.data.type === 'oauth_result' && event.data.provider === provider) {
                                      // Remove event listener
                                      window.removeEventListener('message', handleOAuthMessage);
                                      
                                      if (event.data.status === 'success') {
                                        showToast(`${selectedBlock.name} integration successful! ✅`, 'success');
                                        // Refresh integration status for the specific provider
                                        checkIntegrationStatus(provider);
                                      } else {
                                        const errorMsg = event.data.error || 'Authorization failed';
                                        showToast(`${selectedBlock.name} integration failed: ${errorMsg}`, 'error');
                                        console.error('OAuth error:', errorMsg);
                                      }
                                    }
                                  };
                                  
                                  // Add event listener for postMessage
                                  window.addEventListener('message', handleOAuthMessage);
                                  
                                  // Fallback: Monitor for window closure (in case postMessage fails)
                                  const checkClosed = setInterval(() => {
                                    if (authWindow?.closed) {
                                      clearInterval(checkClosed);
                                      window.removeEventListener('message', handleOAuthMessage);
                                      
                                      // If no message was received, show a generic message
                                      setTimeout(() => {
                                        showToast('Authorization window closed. Please check if integration was successful.', 'info');
                                        checkIntegrationStatus(provider);
                                      }, 500);
                                    }
                                  }, 1000);
                                  
                                } else {
                                  showToast('Failed to get authorization URL from server', 'error');
                                }
                              } else {
                                const errorData = await response.json().catch(() => ({}));
                                showToast(`OAuth configuration missing: ${errorData.message || 'Please configure OAuth credentials in server environment'}`, 'error');
                              }
                              
                            } catch (error) {
                              console.error('Authorization error:', error);
                              showToast(`Authorization failed: ${error.message}`, 'error');
                            }
                          }}
                          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                        >
                          <Link className="w-5 h-5" />
                          Authorize {selectedBlock.name}
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          You'll be redirected to {selectedBlock.name} for secure authorization
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-green-700">
                          ✅ Successfully connected to your {selectedBlock.name} account
                        </p>
                        <button
                          onClick={() => {
                            setBlocks(prev => prev.map(b => 
                              b.id === selectedBlock.id 
                                ? { ...b, integrationStatus: 'not-connected', status: 'requires-integration' }
                                : b
                            ));
                            setSelectedBlock(prev => ({ ...prev, integrationStatus: 'not-connected', status: 'requires-integration' }));
                            showToast(`${selectedBlock.name} disconnected`, 'info');
                          }}
                          className="text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Disconnect Integration
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
                  
                  {/* Block Name Configuration */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Block Name
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.name}
                      onChange={(e) => {
                        setBlocks(prev => prev.map(b => 
                          b.id === selectedBlock.id 
                            ? { ...b, name: e.target.value }
                            : b
                        ));
                        setSelectedBlock(prev => ({ ...prev, name: e.target.value }));
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white transition-colors"
                      placeholder="Enter block name..."
                    />
                  </div>

                {/* Gmail Send Configuration */}
                {selectedBlock.type === 'gmail-send' && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">Gmail Configuration</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Gmail Account
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                          <option value="">Select Gmail Account</option>
                          <option value="primary">Primary Gmail Account</option>
                          <option value="custom">Connect New Account</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          To Email
                        </label>
                        <input
                          type="email"
                          placeholder="recipient@example.com or {{trigger.email}}"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <p className="text-xs text-gray-600 mt-2">Use {`{{trigger.fieldname}}`} for dynamic data</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Subject
                        </label>
                        <input
                          type="text"
                          placeholder="Welcome {{trigger.name}}!"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Message
                        </label>
                        <textarea
                          rows="4"
                          placeholder="Hi {{trigger.name}}, welcome to our platform! Your email: {{trigger.email}}"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'discord-send' && (
                  <div className="space-y-8 mx-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Discord Webhook URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://discord.com/api/webhooks/your-webhook-url"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-3 ml-1">Get this from Discord Server Settings → Integrations → Webhooks</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Channel Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="#new-customers"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Message
                      </label>
                      <textarea
                        rows="5"
                        placeholder="🎉 New customer: {{trigger.name}} ({{trigger.email}}) just signed up!"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Bot Username (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="APIfyn Bot"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* GitHub Trigger Configuration */}
                {selectedBlock.type === 'github-trigger' && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">GitHub Webhook Configuration</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Repository
                        </label>
                        
                        {!integrations.github.connected ? (
                          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Lock className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">GitHub Not Connected</p>
                                  <p className="text-xs text-gray-500">Connect your GitHub account to access repositories</p>
                                </div>
                              </div>
                              <button
                                onClick={handleGitHubAuth}
                                disabled={integrations.github.loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                              >
                                {integrations.github.loading ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Github className="w-4 h-4" />
                                )}
                                <span>Connect GitHub</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {repositories.length > 8 && (
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search repositories..."
                                  value={repoSearchTerm}
                                  onChange={(e) => setRepoSearchTerm(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                              </div>
                            )}
                            
                            <select 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                              onChange={(e) => {
                                setBlocks(prev => prev.map(b => 
                                  b.id === selectedBlock.id 
                                    ? { ...b, config: { ...b.config, repository: e.target.value } }
                                    : b
                                ));
                                setSelectedBlock(prev => ({ ...prev, config: { ...prev.config, repository: e.target.value } }));
                              }}
                              value={selectedBlock.config?.repository || ''}
                              disabled={repositoriesLoading}
                            >
                              <option value="">
                                {repositoriesLoading ? 'Loading repositories...' : 'Select a repository'}
                              </option>
                              {repositories
                                .filter(repo => 
                                  !repoSearchTerm || 
                                  repo.full_name.toLowerCase().includes(repoSearchTerm.toLowerCase())
                                )
                                .slice(0, 8)
                                .map(repo => (
                                  <option key={repo.id} value={repo.full_name}>
                                    {repo.full_name} {repo.private ? '(Private)' : '(Public)'}
                                  </option>
                                ))
                              }
                              <option value="custom">Enter custom repository</option>
                            </select>
                            
                            {repositories.length > 8 && (
                              <p className="text-xs text-gray-500">
                                Showing top 8 results. Use search to find specific repositories.
                              </p>
                            )}
                          </div>
                        )}
                        
                        {selectedBlock.config?.repository === 'custom' && (
                          <input
                            type="text"
                            placeholder="owner/repository-name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-3"
                            onChange={(e) => {
                              setBlocks(prev => prev.map(b => 
                                b.id === selectedBlock.id 
                                  ? { ...b, config: { ...b.config, customRepository: e.target.value } }
                                  : b
                              ));
                              setSelectedBlock(prev => ({ ...prev, config: { ...prev.config, customRepository: e.target.value } }));
                            }}
                            value={selectedBlock.config?.customRepository || ''}
                          />
                        )}
                        <p className="text-xs text-gray-600 mt-2">Choose the GitHub repository to monitor</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          GitHub Events
                        </label>
                        <div className="space-y-3">
                          {[
                            { value: 'push', label: 'Push to repository', description: 'Triggered when code is pushed' },
                            { value: 'pull_request', label: 'Pull Request', description: 'Opened, closed, or updated PR' },
                            { value: 'issues', label: 'Issues', description: 'Issue opened, closed, or updated' },
                            { value: 'release', label: 'Release', description: 'New release published' },
                            { value: 'fork', label: 'Fork', description: 'Repository forked' }
                          ].map((event) => (
                            <label key={event.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                checked={selectedBlock.config?.events?.includes(event.value) || false}
                                onChange={(e) => {
                                  const events = selectedBlock.config?.events || [];
                                  const newEvents = e.target.checked 
                                    ? [...events, event.value]
                                    : events.filter(ev => ev !== event.value);
                                  
                                  setBlocks(prev => prev.map(b => 
                                    b.id === selectedBlock.id 
                                      ? { ...b, config: { ...b.config, events: newEvents } }
                                      : b
                                  ));
                                  setSelectedBlock(prev => ({ ...prev, config: { ...prev.config, events: newEvents } }));
                                }}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{event.label}</div>
                                <div className="text-sm text-gray-600">{event.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Webhook className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-blue-900 mb-1">Webhook URL</h5>
                            <p className="text-sm text-blue-700 mb-2">This URL will be automatically registered with your repository:</p>
                            <code className="text-xs bg-white p-2 rounded border text-gray-700 block break-all">
                              https://api.apifyn.com/api/webhook/github/{selectedBlock.id}
                            </code>
                            <p className="text-xs text-blue-600 mt-2">✅ Webhook will be automatically configured when you save this workflow</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'slack-send' && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">Slack Message Configuration</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Channel
                        </label>
                        
                        {!integrations.slack.connected ? (
                          <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Lock className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Slack Not Connected</p>
                                  <p className="text-xs text-gray-500">Connect your Slack workspace to access channels</p>
                                </div>
                              </div>
                              <button
                                onClick={handleSlackAuth}
                                disabled={integrations.slack.loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {integrations.slack.loading ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <MessageSquare className="w-4 h-4" />
                                )}
                                <span>Connect Slack</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Connected workspace info */}
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-900">
                                Connected to Slack workspace
                              </span>
                              {integrations.slack.workspaces?.length > 0 && (
                                <span className="text-sm text-green-700">
                                  ({integrations.slack.workspaces[0].name || 'workspace'})
                                </span>
                              )}
                            </div>
                            
                            {slackChannels.length > 8 && (
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search channels..."
                                  value={channelSearchTerm}
                                  onChange={(e) => setChannelSearchTerm(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                              </div>
                            )}
                            
                            <select 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                              onChange={(e) => {
                                setBlocks(prev => prev.map(b => 
                                  b.id === selectedBlock.id 
                                    ? { ...b, config: { ...b.config, channel: e.target.value } }
                                    : b
                                ));
                                setSelectedBlock(prev => ({ ...prev, config: { ...prev.config, channel: e.target.value } }));
                              }}
                              value={selectedBlock.config?.channel || ''}
                              disabled={channelsLoading}
                            >
                              <option value="">
                                {channelsLoading ? 'Loading channels...' : 'Select a channel'}
                              </option>
                              {slackChannels
                                .filter(channel => 
                                  !channelSearchTerm || 
                                  channel.name.toLowerCase().includes(channelSearchTerm.toLowerCase())
                                )
                                .slice(0, 8)
                                .map(channel => (
                                  <option key={channel.id} value={channel.id}>
                                    #{channel.name} {channel.is_private ? '(Private)' : ''}
                                  </option>
                                ))
                              }
                              <option value="custom">Custom channel/user</option>
                            </select>
                            
                            {slackChannels.length > 8 && (
                              <p className="text-xs text-gray-500">
                                Showing top 8 results. Use search to find specific channels.
                              </p>
                            )}
                          </div>
                        )}
                        
                        {selectedBlock.config?.channel === 'custom' && (
                          <input
                            type="text"
                            placeholder="#channel-name or @username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mt-3"
                            onChange={(e) => {
                              setBlocks(prev => prev.map(b => 
                                b.id === selectedBlock.id 
                                  ? { ...b, config: { ...b.config, customChannel: e.target.value } }
                                  : b
                              ));
                              setSelectedBlock(prev => ({ ...prev, config: { ...prev.config, customChannel: e.target.value } }));
                            }}
                            value={selectedBlock.config?.customChannel || ''}
                          />
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Message Template
                        </label>
                        <textarea
                          rows="4"
                          placeholder="🚀 New code update in {{repository_name}} by {{author_name}}!"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                          onChange={(e) => {
                            setBlocks(prev => prev.map(b => 
                              b.id === selectedBlock.id 
                                ? { ...b, config: { ...b.config, messageTemplate: e.target.value } }
                                : b
                            ));
                            setSelectedBlock(prev => ({ ...prev, config: { ...prev.config, messageTemplate: e.target.value } }));
                          }}
                          value={selectedBlock.config?.messageTemplate || 'Hi team! 👋 New changes made to the repository. Check it out! 🚀'}
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          Use simple variables like <code>{"{{repository_name}}"}</code> or <code>{"{{author_name}}"}</code> in your message
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-900 mb-2">📝 Message Variables Guide</h5>
                        <div className="space-y-2 text-sm text-blue-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div><code>{"{{repository_name}}"}</code> → Repository name</div>
                            <div><code>{"{{author_name}}"}</code> → Person who made changes</div>
                            <div><code>{"{{pull_request_title}}"}</code> → Pull request title</div>
                            <div><code>{"{{action}}"}</code> → What happened (opened, closed)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                          <p className="text-xs font-medium text-blue-900 mb-1">💡 Example Messages:</p>
                          <div className="text-xs text-blue-700 space-y-1">
                            <div>• "🚀 New push to your repository by team member"</div>
                            <div>• "📝 New PR: Feature request is ready for review"</div>
                            <div>• "✅ Pull request opened in your repository"</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-900 mb-2">Advanced Variables (Optional)</h5>
                        <div className="space-y-1 text-sm text-green-700">
                          <div><code>{"{{payload.repository.name}}"}</code> - Repository name</div>
                          <div><code>{"{{payload.repository.full_name}}"}</code> - Full repository name</div>
                          <div><code>{"{{payload.pusher.name}}"}</code> - User who pushed (for push events)</div>
                          <div><code>{"{{payload.pull_request.title}}"}</code> - PR title (for PR events)</div>
                          <div><code>{"{{payload.pull_request.user.login}}"}</code> - PR author</div>
                          <div><code>{"{{payload.action}}"}</code> - Event action (opened, closed, etc.)</div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Message Preview
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="text-sm text-gray-700">
                            {selectedBlock.config?.messageTemplate 
                              ? selectedBlock.config.messageTemplate
                                  // Simple variable replacements
                                  .replace(/\{\{repository_name\}\}/g, 'my-awesome-project')
                                  .replace(/\{\{author_name\}\}/g, 'john-doe')
                                  .replace(/\{\{pull_request_title\}\}/g, 'Fix bug in authentication')
                                  .replace(/\{\{action\}\}/g, 'opened')
                                  // Advanced variable replacements (backward compatibility)
                                  .replace(/\{\{payload\.repository\.name\}\}/g, 'my-awesome-project')
                                  .replace(/\{\{payload\.repository\.full_name\}\}/g, 'user/my-awesome-project')
                                  .replace(/\{\{payload\.pusher\.name\}\}/g, 'john-doe')
                                  .replace(/\{\{payload\.pull_request\.title\}\}/g, 'Fix bug in authentication')
                                  .replace(/\{\{payload\.pull_request\.user\.login\}\}/g, 'jane-dev')
                                  .replace(/\{\{payload\.action\}\}/g, 'opened')
                              : 'Enter a message template to see preview...'}
                          </div>
                          {selectedBlock.config?.messageTemplate && (
                            <div className="mt-2 text-xs text-gray-500">
                              💡 This is how your message will look when sent to Slack
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Typeform Trigger Configuration */}
                {selectedBlock.type === 'typeform-trigger' && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">Typeform Configuration</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Typeform Form
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                          <option value="">Select a form</option>
                          <option value="connect">Connect Typeform Account</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Form ID (Alternative)
                        </label>
                        <input
                          type="text"
                          placeholder="abc123def"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <p className="text-xs text-gray-600 mt-2">Find this in your Typeform URL: typeform.com/to/<strong>abc123def</strong></p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Webhook URL (Generated)
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <code className="text-sm text-gray-700 break-all font-mono">
                            https://api.apifyn.com/webhooks/typeform/{selectedBlock.id}
                          </code>
                          <button className="ml-3 text-blue-600 hover:text-blue-800 text-xs font-medium">Copy</button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Add this URL to your Typeform webhook settings</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                          Expected Fields
                        </label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Add Field</button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Define fields that will be available as {`{{trigger.fieldname}}`}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'webhook-trigger' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL (Generated)
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <code className="text-sm text-gray-600 break-all">
                          https://api.apifyn.com/webhooks/generic/{selectedBlock.id}
                        </code>
                        <button className="ml-2 text-blue-600 hover:text-blue-800 text-xs">Copy</button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Use this URL to send POST requests to trigger your workflow</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Data Format
                      </label>
                      <textarea
                        rows="4"
                        placeholder='{"name": "John Doe", "email": "john@example.com", "message": "Hello"}'
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authentication
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="none">No Authentication</option>
                        <option value="api-key">API Key</option>
                        <option value="signature">Signature Verification</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'sheets-add' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Account
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Google Account</option>
                        <option value="connect">Connect Google Account</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spreadsheet URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Worksheet Name
                      </label>
                      <input
                        type="text"
                        placeholder="Sheet1"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Column Mapping
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input type="text" placeholder="Column A" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                          <input type="text" placeholder="{{trigger.name}}" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Column B" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                          <input type="text" placeholder="{{trigger.email}}" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">+ Add Column</button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'delay' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delay Duration
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="5"
                          min="1"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="seconds">Seconds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delay Type
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="fixed">Fixed Delay</option>
                        <option value="dynamic">Dynamic Delay (from data)</option>
                        <option value="scheduled">Schedule for specific time</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-gray-200 mx-2">
                  <button
                    onClick={() => {
                      setBlocks(prev => prev.map(b => 
                        b.id === selectedBlock.id 
                          ? { ...b, status: 'configured' }
                          : b
                      ));
                      setSelectedBlock(prev => ({ ...prev, status: 'configured' }));
                      // Close the sidebar after saving
                      setTimeout(() => setSelectedBlock(null), 500);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Save Configuration
                  </button>
                </div>
                
                {/* Bottom padding to ensure content isn't cut off */}
                <div className="h-8"></div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{blocks.length} blocks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{connections.length} connections</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              blocks.filter(b => b.integrationRequired && b.integrationStatus === 'connected').length === blocks.filter(b => b.integrationRequired).length
                ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            <span>
              {blocks.filter(b => b.integrationRequired && b.integrationStatus === 'connected').length}/
              {blocks.filter(b => b.integrationRequired).length} integrations
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span>{isConnecting ? 'Connecting...' : 'Ready'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+S</kbd> to save</div>
          <div>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Del</kbd> to delete selected</div>
          <div>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to cancel</div>
        </div>
      </div>

      {/* Naming Dialog */}
      <AnimatePresence>
        {showNamingDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Save className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Save Workflow</h3>
                  <p className="text-sm text-gray-600">Give your workflow a name</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={tempWorkflowName}
                  onChange={(e) => setTempWorkflowName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNamingConfirm();
                    } else if (e.key === 'Escape') {
                      setShowNamingDialog(false);
                    }
                  }}
                  placeholder="e.g., Customer Onboarding, Lead Generation"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  autoFocus
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNamingDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNamingConfirm}
                  disabled={!tempWorkflowName.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Workflow
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`
                px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm max-w-sm border-l-4 relative
                ${toast.type === 'success' ? 'bg-green-50/90 border-green-500 text-green-800' : 
                  toast.type === 'error' ? 'bg-red-50/90 border-red-500 text-red-800' : 
                  toast.type === 'warning' ? 'bg-yellow-50/90 border-yellow-500 text-yellow-800' : 
                  'bg-blue-50/90 border-blue-500 text-blue-800'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {toast.type === 'error' && <X className="w-5 h-5 text-red-600" />}
                  {toast.type === 'warning' && <Zap className="w-5 h-5 text-yellow-600" />}
                  {toast.type === 'info' && <Zap className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Progress bar */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 rounded-full ${
                  toast.type === 'success' ? 'bg-green-500' : 
                  toast.type === 'error' ? 'bg-red-500' : 
                  toast.type === 'warning' ? 'bg-yellow-500' : 
                  'bg-blue-500'
                }`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
