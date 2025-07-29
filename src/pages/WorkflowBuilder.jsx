import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
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
  Link
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const WorkflowBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  
  const [workflowName, setWorkflowName] = useState('');
  const [isEditing, setIsEditing] = useState(true);
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

  // Toast function
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
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

  // Block Library with real logos and integration requirements
  const blockLibrary = {
    triggers: [
      { 
        id: 'typeform-trigger', 
        name: 'Typeform Submission', 
        icon: <img src="https://images.typeform.com/images/2dpnUBBkz2VN" alt="Typeform" className="w-5 h-5 rounded" />, 
        color: 'bg-blue-50', 
        description: 'Triggered when a new form is submitted',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Forms'
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
        id: 'stripe-trigger', 
        name: 'Stripe Payment', 
        icon: <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">S</div>, 
        color: 'bg-purple-50', 
        description: 'Triggered when a payment is made',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Payments'
      },
      { 
        id: 'webhook-trigger', 
        name: 'Webhook', 
        icon: <Webhook className="w-5 h-5" />, 
        color: 'bg-gray-100 text-gray-600', 
        description: 'Triggered when webhook receives data',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Developer Tools'
      },
      { 
        id: 'calendar-trigger', 
        name: 'Google Calendar', 
        icon: <img src="https://ssl.gstatic.com/calendar/images/favicon_v2014_26.ico" alt="Google Calendar" className="w-5 h-5 rounded" />, 
        color: 'bg-blue-50', 
        description: 'Triggered when calendar event occurs',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Calendar'
      },
      { 
        id: 'slack-trigger', 
        name: 'Slack Message', 
        icon: <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Slack" className="w-5 h-5 rounded" />, 
        color: 'bg-purple-50', 
        description: 'Triggered when Slack message is received',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Communication'
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
        color: 'bg-purple-50', 
        description: 'Send a message to Slack channel',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Communication'
      },
      { 
        id: 'sheets-add', 
        name: 'Google Sheets', 
        icon: <img src="https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png" alt="Google Sheets" className="w-5 h-5 rounded" />, 
        color: 'bg-green-50', 
        description: 'Add row to Google Sheets',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Productivity'
      },
      { 
        id: 'notion-create', 
        name: 'Notion', 
        icon: <img src="https://www.notion.so/images/favicon.ico" alt="Notion" className="w-5 h-5 rounded" />, 
        color: 'bg-gray-50', 
        description: 'Create a new Notion page',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Productivity'
      },
      { 
        id: 'webhook-send', 
        name: 'Send Webhook', 
        icon: <Webhook className="w-5 h-5" />, 
        color: 'bg-blue-100 text-blue-600', 
        description: 'Send data to webhook URL',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Developer Tools'
      },
      { 
        id: 'discord-send', 
        name: 'Discord', 
        icon: <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">D</div>, 
        color: 'bg-indigo-50', 
        description: 'Send message to Discord channel',
        integrationRequired: true,
        integrationStatus: 'not-connected',
        category: 'Communication'
      }
    ],
    conditions: [
      { 
        id: 'if-condition', 
        name: 'If/Then Logic', 
        icon: <div className="w-5 h-5 bg-yellow-500 rounded flex items-center justify-center text-white font-bold text-xs">?</div>, 
        color: 'bg-yellow-50', 
        description: 'Add conditional logic to your workflow',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Logic'
      },
      { 
        id: 'filter', 
        name: 'Data Filter', 
        icon: <Filter className="w-5 h-5" />, 
        color: 'bg-orange-100 text-orange-600', 
        description: 'Filter data based on conditions',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Logic'
      },
      { 
        id: 'switch', 
        name: 'Multi-path Switch', 
        icon: <div className="w-5 h-5 bg-pink-500 rounded flex items-center justify-center text-white font-bold text-xs">◊</div>, 
        color: 'bg-pink-50', 
        description: 'Route data based on multiple conditions',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Logic'
      }
    ],
    utilities: [
      { 
        id: 'delay', 
        name: 'Delay Timer', 
        icon: <Clock className="w-5 h-5" />, 
        color: 'bg-gray-100 text-gray-600', 
        description: 'Add time delay before next action',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Utility'
      },
      { 
        id: 'formatter', 
        name: 'Data Formatter', 
        icon: <div className="w-5 h-5 bg-teal-500 rounded flex items-center justify-center text-white font-bold text-xs">{ }</div>, 
        color: 'bg-teal-50', 
        description: 'Transform and format data',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Utility'
      },
      { 
        id: 'code', 
        name: 'Custom Code', 
        icon: <Code className="w-5 h-5" />, 
        color: 'bg-indigo-100 text-indigo-600', 
        description: 'Execute custom JavaScript code',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Utility'
      },
      { 
        id: 'logger', 
        name: 'Debug Logger', 
        icon: <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">📋</div>, 
        color: 'bg-blue-50', 
        description: 'Log data for debugging and monitoring',
        integrationRequired: false,
        integrationStatus: 'ready',
        category: 'Utility'
      }
    ]
  };

  const handleSave = useCallback(async () => {
    try {
      if (!user?.idToken) {
        showToast('Please log in to save workflows', 'error');
        return;
      }

      if (!workflowName.trim()) {
        showToast('Please enter a workflow name before saving', 'warning');
        setIsEditing(true);
        return;
      }

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
        isActive: false
      };

      showToast('Saving workflow...', 'info');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workflow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showToast('Workflow saved successfully! 🎉', 'success');
          setTimeout(() => navigate('/workflows'), 1500);
        } else {
          showToast('Failed to save workflow: ' + (result.error || 'Unknown error'), 'error');
        }
      } else {
        const errorData = await response.json();
        showToast('Failed to save workflow: ' + (errorData.error || response.statusText), 'error');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      showToast('Error saving workflow: ' + error.message, 'error');
    }
  }, [user, workflowName, blocks, connections, zoom, canvasPosition, navigate, showToast]);

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

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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
      id: `block-${Date.now()}`,
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
          id: `connection-${Date.now()}`,
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
  const checkIntegrationStatus = async (provider) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integration/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.integrations[provider] === 'connected') {
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
  };

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
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm min-h-[80px]">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={() => navigate('/workflows')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Prominent Workflow Name Section */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors flex-1 min-w-0 max-w-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  placeholder="Enter workflow name..."
                  className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0 text-gray-800 placeholder-gray-400 w-full"
                  autoFocus
                />
              ) : (
                <h1 
                  className={`text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors truncate ${
                    !workflowName ? 'text-gray-400' : 'text-gray-800'
                  }`}
                  onClick={() => setIsEditing(true)}
                  title={workflowName || 'Click to name your workflow'}
                >
                  {workflowName || 'Click to name your workflow'}
                </h1>
              )}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
              title="Edit workflow name"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {/* Workflow Status */}
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${workflowName ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{workflowName ? 'Named' : 'Unnamed'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Undo (Ctrl+Z)">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Redo (Ctrl+Y)">
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-2"></div>
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 px-2 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <Maximize className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-2"></div>
          <button
            onClick={handleTestRun}
            className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
            title="Test Run (Requires connected blocks)"
          >
            <TestTube className="w-4 h-4" />
            Test Run
          </button>
          <button
            onClick={handleSave}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handlePublish}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 text-sm"
            title="Publish Workflow"
          >
            <Rocket className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Block Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Block Library</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <div className="space-y-2">
                        {blocks.map((block) => (
                          <div
                            key={block.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, block)}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-move group border-l-3 border-transparent hover:border-blue-400"
                            title={block.description}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${block.color} flex-shrink-0 shadow-sm`}>
                              {block.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 block">{block.name}</span>
                                {block.integrationRequired && (
                                  <div className={`w-2 h-2 rounded-full ${
                                    getBlockTypeIntegrationStatus(block.id) === 'connected' ? 'bg-green-500' :
                                    'bg-yellow-500'
                                  }`} title={`Integration ${getBlockTypeIntegrationStatus(block.id)}`}></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-1">{block.description}</p>
                              {block.category && (
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
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
            style={{
              backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              transform: `scale(${zoom}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
            }}
          >
            {/* SVG for connections */}
            <svg 
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{ overflow: 'visible' }}
            >
              {/* Existing connections */}
              {connections.map((connection) => {
                const fromBlock = blocks.find(b => b.id === connection.from);
                const toBlock = blocks.find(b => b.id === connection.to);
                if (!fromBlock || !toBlock) return null;
                
                return (
                  <g key={connection.id}>
                    <motion.path
                      d={getConnectionPath(fromBlock, toBlock)}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="drop-shadow-sm"
                    />
                    {/* Arrow head */}
                    <motion.circle
                      cx={toBlock.position.x}
                      cy={toBlock.position.y + 50}
                      r="4"
                      fill="#3b82f6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    />
                    {/* Connection delete button */}
                    <foreignObject
                      x={(fromBlock.position.x + 200 + toBlock.position.x) / 2 - 12}
                      y={(fromBlock.position.y + 50 + toBlock.position.y + 50) / 2 - 12}
                      width="24"
                      height="24"
                      className="pointer-events-auto opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={() => deleteConnection(connection.id)}
                        className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg"
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
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Your First Workflow</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Drag blocks from the left sidebar to create your automation workflow
                    </p>
                    <div className="space-y-3 text-sm text-gray-500 bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold">1</span>
                        </div>
                        <span>Start with a <strong>Trigger</strong> to begin your workflow</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold">2</span>
                        </div>
                        <span>Add <strong>Actions</strong> to perform tasks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Link className="w-4 h-4 text-purple-600" />
                        </div>
                        <span>Click <strong>connection ports</strong> to link blocks together</span>
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
                      bg-white rounded-2xl border-2 p-4 shadow-lg min-w-[200px] group hover:shadow-xl transition-all relative
                      ${selectedBlock?.id === block.id ? 'border-blue-500 ring-4 ring-blue-200/50' : 'border-gray-200'}
                      ${isDraggingBlock && draggedBlockId === block.id ? 'shadow-2xl scale-105' : ''}
                    `}>
                      {/* Input Connection Port */}
                      <div
                        className="connection-port absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg cursor-pointer hover:bg-blue-600 hover:scale-110 transition-all z-30 group"
                        onClick={(e) => isConnecting ? endConnection(block.id, e) : null}
                        title="Input connection point"
                      >
                        <div className="absolute inset-1 rounded-full bg-blue-400 animate-pulse opacity-60"></div>
                        <div className="absolute -inset-2 rounded-full border-2 border-blue-300 opacity-0 group-hover:opacity-100 animate-ping"></div>
                      </div>

                      {/* Output Connection Port */}
                      <div
                        className="connection-port absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg cursor-pointer hover:bg-green-600 hover:scale-110 transition-all z-30 group"
                        onClick={(e) => !isConnecting ? startConnection(block.id, e) : null}
                        title="Output connection point - click to start connecting"
                      >
                        <div className="absolute inset-1 rounded-full bg-green-400 animate-pulse opacity-60"></div>
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
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-pulse">
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
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 360 }}
              exit={{ width: 0 }}
              className="bg-white border-l border-gray-200 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Block Configuration</h3>
                  <button
                    onClick={() => setSelectedBlock(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedBlock.color} relative`}>
                    {selectedBlock.icon}
                    {selectedBlock.integrationRequired && selectedBlock.integrationStatus !== 'connected' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" 
                           title="Integration required"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{selectedBlock.name}</h4>
                    <p className="text-sm text-gray-600">{selectedBlock.description}</p>
                    {selectedBlock.category && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                        {selectedBlock.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Integration Status & Authorization */}
                {selectedBlock.integrationRequired && (
                  <div className={`p-4 rounded-xl border-2 ${
                    selectedBlock.integrationStatus === 'connected' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedBlock.integrationStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">
                          {selectedBlock.integrationStatus === 'connected' ? 'Integration Connected' : 'Integration Required'}
                        </span>
                      </div>
                      {selectedBlock.integrationStatus === 'connected' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
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
                              else if (selectedBlock.type.includes('notion')) provider = 'notion';
                              else if (selectedBlock.type.includes('discord')) provider = 'discord';
                              else if (selectedBlock.type.includes('stripe')) provider = 'stripe';
                              else if (selectedBlock.type.includes('typeform')) provider = 'typeform';
                              
                              if (!provider) {
                                showToast('Integration not yet supported', 'warning');
                                return;
                              }
                              
                              // Call backend to get OAuth URL
                              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/integration/oauth/${provider}/authorize`, {
                                method: 'GET',
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
                                  
                                  // Monitor for window closure (user completed or cancelled OAuth)
                                  const checkClosed = setInterval(() => {
                                    if (authWindow?.closed) {
                                      clearInterval(checkClosed);
                                      showToast('Authorization window closed. Please check if integration was successful.', 'info');
                                      
                                      // Check integration status from backend instead of assuming success
                                      checkIntegrationStatus(provider);
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
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium"
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
              
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {selectedBlock.type === 'gmail-send' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gmail Account
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Gmail Account</option>
                        <option value="primary">Primary Gmail Account</option>
                        <option value="custom">Connect New Account</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Email
                      </label>
                      <input
                        type="email"
                        placeholder="recipient@example.com or {{trigger.email}}"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Use {`{trigger.fieldname}`} for dynamic data</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Welcome {{trigger.name}}!"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Hi {{trigger.name}}, welcome to our platform! Your email: {{trigger.email}}"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'discord-send' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discord Webhook URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://discord.com/api/webhooks/your-webhook-url"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Get this from Discord Server Settings → Integrations → Webhooks</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Channel Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="#new-customers"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows="4"
                        placeholder="🎉 New customer: {{trigger.name}} ({{trigger.email}}) just signed up!"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bot Username (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="APIfyn Bot"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'slack-send' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slack Workspace
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Workspace</option>
                        <option value="connect">Connect Slack Workspace</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Channel
                      </label>
                      <input
                        type="text"
                        placeholder="#general or @username"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows="4"
                        placeholder="New lead: {{trigger.name}} - {{trigger.email}}"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'typeform-trigger' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Typeform Form
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select a form</option>
                        <option value="connect">Connect Typeform Account</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Form ID (Alternative)
                      </label>
                      <input
                        type="text"
                        placeholder="abc123def"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Find this in your Typeform URL: typeform.com/to/<strong>abc123def</strong></p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL (Generated)
                      </label>
                      <div className="bg-gray-50 p-3 rounded-lg border">
                        <code className="text-sm text-gray-600 break-all">
                          https://api.apifyn.com/webhooks/typeform/{selectedBlock.id}
                        </code>
                        <button className="ml-2 text-blue-600 hover:text-blue-800 text-xs">Copy</button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Add this URL to your Typeform webhook settings</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Fields
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="name"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          placeholder="email"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <button className="text-blue-600 hover:text-blue-800 text-sm">+ Add Field</button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Define fields that will be available as {`{trigger.fieldname}`}</p>
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

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setBlocks(prev => prev.map(b => 
                        b.id === selectedBlock.id 
                          ? { ...b, status: 'configured' }
                          : b
                      ));
                      setSelectedBlock(prev => ({ ...prev, status: 'configured' }));
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Save Configuration
                  </button>
                </div>
              </div>
            </motion.div>
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
