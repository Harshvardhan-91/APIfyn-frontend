import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Play, 
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
  Plus,
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
  Globe,
  Bell,
  CheckCircle,
  AlertCircle,
  Copy,
  Trash2,
  Edit3,
  TestTube,
  Rocket,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const WorkflowBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    triggers: true,
    actions: true,
    conditions: false,
    utilities: false,
    templates: false
  });
  const [blocks, setBlocks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null);

  // Block Library
  const blockLibrary = {
    triggers: [
      { id: 'typeform-trigger', name: 'Typeform Submission', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
      { id: 'gmail-trigger', name: 'Gmail Received', icon: <Mail className="w-5 h-5" />, color: 'bg-red-100 text-red-600' },
      { id: 'stripe-trigger', name: 'Stripe Payment', icon: <CreditCard className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
      { id: 'webhook-trigger', name: 'Webhook', icon: <Webhook className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600' },
      { id: 'calendar-trigger', name: 'Calendar Event', icon: <Calendar className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
      { id: 'slack-trigger', name: 'Slack Message', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' }
    ],
    actions: [
      { id: 'gmail-send', name: 'Send Gmail', icon: <Mail className="w-5 h-5" />, color: 'bg-red-100 text-red-600' },
      { id: 'slack-send', name: 'Send Slack Message', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
      { id: 'sheets-add', name: 'Add to Google Sheets', icon: <Database className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
      { id: 'notion-create', name: 'Create Notion Page', icon: <Database className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600' },
      { id: 'webhook-send', name: 'Send Webhook', icon: <Webhook className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
      { id: 'discord-send', name: 'Send Discord Message', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' }
    ],
    conditions: [
      { id: 'if-condition', name: 'If/Then', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' },
      { id: 'filter', name: 'Filter', icon: <Filter className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' },
      { id: 'switch', name: 'Switch', icon: <Zap className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600' }
    ],
    utilities: [
      { id: 'delay', name: 'Delay', icon: <Clock className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600' },
      { id: 'formatter', name: 'Format Data', icon: <Code className="w-5 h-5" />, color: 'bg-teal-100 text-teal-600' },
      { id: 'code', name: 'Custom Code', icon: <Code className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' },
      { id: 'logger', name: 'Log Data', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' }
    ],
    templates: [
      { id: 'template-lead', name: 'Lead Qualification', icon: <Database className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
      { id: 'template-onboard', name: 'Customer Onboarding', icon: <Mail className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
      { id: 'template-support', name: 'Support Ticket', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' }
    ]
  };

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
      position: { x, y },
      config: {},
      status: 'not-tested' // not-tested, testing, success, error
    };

    setBlocks(prev => [...prev, newBlock]);
    setDraggedBlock(null);
  };

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
  };

  const handleBlockDelete = (blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setConnections(prev => prev.filter(conn => conn.from !== blockId && conn.to !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const handleSave = async () => {
    try {
      if (!user?.idToken) {
        alert('Please log in to save workflows');
        return;
      }

      const workflowData = {
        name: workflowName,
        description: `Workflow with ${blocks.length} blocks`,
        definition: {
          blocks: blocks,
          connections: connections,
          canvas: { zoom, position: canvasPosition }
        },
        category: 'general',
        triggerType: 'MANUAL',
        isActive: false // Start as inactive
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

      // For testing, we'll create a temporary workflow or use a test endpoint
      console.log('Testing workflow...', { blocks, connections });
      alert('Test run started! Check the console for details.');
      
      // TODO: Implement actual test run functionality
      // This could involve sending the workflow definition to a test endpoint
    } catch (error) {
      console.error('Error testing workflow:', error);
      alert('Error testing workflow: ' + error.message);
    }
  };

  const handlePublish = () => {
    console.log('Publishing workflow...', { name: workflowName, blocks, connections });
    // TODO: Implement publish functionality
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
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Undo className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button 
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 px-2">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Maximize className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button
            onClick={handleTestRun}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            <TestTube className="w-4 h-4" />
            Test Run
          </button>
          <button
            onClick={handleSave}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handlePublish}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Component Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
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
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-move"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${block.color}`}>
                              {block.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{block.name}</span>
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
            {/* Canvas Content */}
            <div className="absolute inset-0">
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Workflow</h3>
                    <p className="text-gray-600 mb-6">Drag blocks from the left sidebar to create your automation</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <p>💡 Start with a Trigger to begin your workflow</p>
                      <p>⚡ Add Actions to perform tasks</p>
                      <p>🔀 Use Conditions to add logic</p>
                    </div>
                  </div>
                </div>
              ) : (
                blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute cursor-pointer"
                    style={{
                      left: block.position.x,
                      top: block.position.y
                    }}
                    onClick={() => handleBlockClick(block)}
                  >
                    <div className={`
                      bg-white rounded-xl border-2 p-4 shadow-sm min-w-[200px] group hover:shadow-md transition-all
                      ${selectedBlock?.id === block.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                    `}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${block.color}`}>
                            {block.icon}
                          </div>
                          <span className="font-medium text-gray-900">{block.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBlock(block);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Settings className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBlockDelete(block.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          block.status === 'success' ? 'bg-green-500' :
                          block.status === 'error' ? 'bg-red-500' :
                          block.status === 'testing' ? 'bg-yellow-500 animate-pulse' :
                          'bg-gray-300'
                        }`}></div>
                        <span className="text-xs text-gray-500 capitalize">
                          {block.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Block Configuration */}
        <AnimatePresence>
          {selectedBlock && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              className="bg-white border-l border-gray-200 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Block Configuration</h3>
                  <button
                    onClick={() => setSelectedBlock(null)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedBlock.color}`}>
                    {selectedBlock.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedBlock.name}</h4>
                    <p className="text-sm text-gray-500">{selectedBlock.type}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Block Name
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.name}
                      onChange={(e) => {
                        const updatedBlocks = blocks.map(block => 
                          block.id === selectedBlock.id 
                            ? { ...block, name: e.target.value }
                            : block
                        );
                        setBlocks(updatedBlocks);
                        setSelectedBlock({ ...selectedBlock, name: e.target.value });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Dynamic configuration fields based on block type */}
                  {selectedBlock.type === 'gmail-send' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To Email
                        </label>
                        <input
                          type="email"
                          placeholder="recipient@example.com"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          placeholder="Email subject"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          placeholder="Email body"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  {selectedBlock.type === 'typeform-trigger' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Form ID
                      </label>
                      <input
                        type="text"
                        placeholder="Your Typeform ID"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <TestTube className="w-4 h-4" />
                    Test This Block
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{blocks.length} blocks</span>
          <span>{connections.length} connections</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded transition-colors">
            Save Draft
          </button>
          <button className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded transition-colors flex items-center gap-1">
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
