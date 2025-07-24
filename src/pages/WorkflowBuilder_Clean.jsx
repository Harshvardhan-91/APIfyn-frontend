import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isEditing, setIsEditing] = useState(false);
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

  // Block Library
  const blockLibrary = {
    triggers: [
      { id: 'typeform-trigger', name: 'Typeform Submission', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', description: 'Triggered when a new form is submitted' },
      { id: 'gmail-trigger', name: 'Gmail Received', icon: <Mail className="w-5 h-5" />, color: 'bg-red-100 text-red-600', description: 'Triggered when a new email is received' },
      { id: 'stripe-trigger', name: 'Stripe Payment', icon: <CreditCard className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600', description: 'Triggered when a payment is made' },
      { id: 'webhook-trigger', name: 'Webhook', icon: <Webhook className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600', description: 'Triggered when webhook receives data' },
      { id: 'calendar-trigger', name: 'Calendar Event', icon: <Calendar className="w-5 h-5" />, color: 'bg-green-100 text-green-600', description: 'Triggered when calendar event occurs' },
      { id: 'slack-trigger', name: 'Slack Message', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600', description: 'Triggered when Slack message is received' }
    ],
    actions: [
      { id: 'gmail-send', name: 'Send Gmail', icon: <Mail className="w-5 h-5" />, color: 'bg-red-100 text-red-600', description: 'Send an email via Gmail' },
      { id: 'slack-send', name: 'Send Slack Message', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600', description: 'Send a message to Slack channel' },
      { id: 'sheets-add', name: 'Add to Google Sheets', icon: <Database className="w-5 h-5" />, color: 'bg-green-100 text-green-600', description: 'Add row to Google Sheets' },
      { id: 'notion-create', name: 'Create Notion Page', icon: <Database className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600', description: 'Create a new Notion page' },
      { id: 'webhook-send', name: 'Send Webhook', icon: <Webhook className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', description: 'Send data to webhook URL' },
      { id: 'discord-send', name: 'Send Discord Message', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600', description: 'Send message to Discord channel' }
    ],
    conditions: [
      { id: 'if-condition', name: 'If/Then', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600', description: 'Add conditional logic' },
      { id: 'filter', name: 'Filter', icon: <Filter className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600', description: 'Filter data based on conditions' },
      { id: 'switch', name: 'Switch', icon: <Zap className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600', description: 'Route data based on conditions' }
    ],
    utilities: [
      { id: 'delay', name: 'Delay', icon: <Clock className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600', description: 'Add delay before next action' },
      { id: 'formatter', name: 'Format Data', icon: <Code className="w-5 h-5" />, color: 'bg-teal-100 text-teal-600', description: 'Transform and format data' },
      { id: 'code', name: 'Custom Code', icon: <Code className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600', description: 'Execute custom JavaScript code' },
      { id: 'logger', name: 'Log Data', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600', description: 'Log data for debugging' }
    ]
  };

  const handleSave = async () => {
    try {
      if (!user?.idToken) {
        alert('Please log in to save workflows');
        return;
      }

      const workflowData = {
        name: workflowName,
        description: `Workflow with ${blocks.length} blocks and ${connections.length} connections`,
        definition: {
          blocks: blocks,
          connections: connections,
          canvas: { zoom, position: canvasPosition }
        },
        category: 'general',
        triggerType: 'MANUAL',
        isActive: false
      };

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
          alert('Workflow saved successfully!');
          navigate('/workflows');
        } else {
          alert('Failed to save workflow: ' + (result.error || 'Unknown error'));
        }
      } else {
        const errorData = await response.json();
        alert('Failed to save workflow: ' + (errorData.error || response.statusText));
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow: ' + error.message);
    }
  };

  const handleBlockDelete = (blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setConnections(prev => prev.filter(conn => conn.from !== blockId && conn.to !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

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
  }, [selectedBlock]);

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
      status: 'not-configured'
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
        alert('Please log in to test workflows');
        return;
      }

      if (blocks.length === 0) {
        alert('Please add some blocks to test the workflow');
        return;
      }

      if (connections.length === 0 && blocks.length > 1) {
        alert('Please connect your blocks to create a workflow');
        return;
      }

      console.log('Testing workflow...', { blocks, connections });
      alert('Test run started! Check the console for details.');
    } catch (error) {
      console.error('Error testing workflow:', error);
      alert('Error testing workflow: ' + error.message);
    }
  };

  const handlePublish = () => {
    if (blocks.length === 0) {
      alert('Please add blocks to your workflow before publishing');
      return;
    }
    
    if (connections.length === 0 && blocks.length > 1) {
      alert('Please connect your blocks before publishing');
      return;
    }
    
    console.log('Publishing workflow...', { name: workflowName, blocks, connections });
    alert('Workflow published successfully!');
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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/workflows')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                autoFocus
              />
            ) : (
              <h1 
                className="text-xl font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setIsEditing(true)}
              >
                {workflowName}
              </h1>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Undo (Ctrl+Z)">
            <Undo className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Redo (Ctrl+Y)">
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 px-2 min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setZoom(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Zoom"
          >
            <Maximize className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button
            onClick={handleTestRun}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
            title="Test Run (Requires connected blocks)"
          >
            <TestTube className="w-4 h-4" />
            Test Run
          </button>
          <button
            onClick={handleSave}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handlePublish}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
            title="Publish Workflow"
          >
            <Rocket className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Block Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
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

          <div className="flex-1 overflow-y-auto">
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
                      <div className="px-4 pb-4 space-y-2">
                        {blocks.map((block) => (
                          <div
                            key={block.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, block)}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-move group"
                            title={block.description}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${block.color} flex-shrink-0`}>
                              {block.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-gray-900 block">{block.name}</span>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{block.description}</p>
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
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full bg-gray-50 relative"
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
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${block.color} shadow-sm`}>
                            {block.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">{block.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{block.type.replace('-', ' ')}</p>
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
                              'bg-gray-300'
                            }`}></div>
                            <span className="text-xs text-gray-500 capitalize">
                              {block.status.replace('-', ' ')}
                            </span>
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedBlock.color}`}>
                    {selectedBlock.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedBlock.name}</h4>
                    <p className="text-sm text-gray-600">{selectedBlock.description}</p>
                  </div>
                </div>
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
                        To Email
                      </label>
                      <input
                        type="email"
                        placeholder="recipient@example.com"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Email subject"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Email message"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                )}

                {selectedBlock.type === 'typeform-trigger' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Typeform ID
                    </label>
                    <input
                      type="text"
                      placeholder="Your Typeform ID"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {selectedBlock.type === 'webhook-trigger' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border">
                      <code className="text-sm text-gray-600 break-all">
                        https://api.apifyn.com/webhooks/{selectedBlock.id}
                      </code>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Use this URL to send data to trigger your workflow
                    </p>
                  </div>
                )}

                {selectedBlock.type === 'delay' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delay Duration
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="5"
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
            <div className={`w-2 h-2 rounded-full ${isConnecting ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}></div>
            <span>{isConnecting ? 'Connecting...' : 'Ready'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+S</kbd> to save
          </div>
          <div className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Del</kbd> to delete selected
          </div>
          <div className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
