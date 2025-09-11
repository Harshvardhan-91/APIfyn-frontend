import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play,
  MousePointer2,
  Settings,
  Link2,
  Save,
  CheckCircle,
  ArrowRight,
  Zap,
  Database,
  Send
} from 'lucide-react';

const WorkflowCreationGuide = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Create New Workflow",
      description: "Start by clicking 'Create Workflow' button to open the visual workflow builder",
      icon: Play,
      color: "bg-blue-500",
      image: "https://i.postimg.cc/wjTMdYm8/Screenshot-2025-09-11-160333.png", 
      mockup: (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Workflows</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Play className="w-4 h-4" />
              Create Workflow
            </button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No workflows yet. Create your first workflow!</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Select Trigger",
      description: "Choose a trigger from the sidebar - this is what starts your workflow automatically",
      icon: Zap,
      color: "bg-green-500",
      image: "https://i.postimg.cc/1tzrgjTL/Screenshot-2025-09-11-160715.png", 
      mockup: (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex gap-4">
            <div className="w-64 bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-3">Triggers</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">GitHub Push</p>
                    <p className="text-xs text-gray-500">When code is pushed</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Send className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Webhook</p>
                    <p className="text-xs text-gray-500">HTTP request received</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg p-8 shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-500">Drag a trigger here to start</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Add Action",
      description: "Select an action from the sidebar - this is what happens when your workflow runs",
      icon: Settings,
      color: "bg-purple-500",
      image: "https://i.postimg.cc/VLXZP3cR/Screenshot-2025-09-11-160851.png", 
      mockup: (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex gap-4">
            <div className="w-64 bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-3">Actions</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <Send className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Send Slack Message</p>
                    <p className="text-xs text-gray-500">Post to channel</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                    <Database className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium">Create Database Entry</p>
                    <p className="text-xs text-gray-500">Add new record</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg p-8 shadow">
              <div className="flex items-center justify-center gap-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center relative">
                  <Zap className="w-8 h-8 text-green-600" />
                  <div className="absolute -right-2 top-2 w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center relative">
                  <Send className="w-8 h-8 text-purple-600" />
                  <div className="absolute -left-2 top-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Configure Components",
      description: "Click on each component to configure its settings and parameters",
      icon: Settings,
      color: "bg-orange-500",
      image: "https://i.postimg.cc/K8x5tjgX/Screenshot-2025-09-11-162343.png", 
      mockup: (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex gap-4">
            <div className="flex-1 bg-white rounded-lg p-8 shadow relative">
              <div className="flex items-center justify-center gap-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center ring-4 ring-blue-200">
                  <Send className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="w-80 bg-white rounded-lg p-4 shadow">
              <h4 className="font-semibold mb-3">Configure Action</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Channel</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>#general</option>
                    <option>#development</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea className="w-full mt-1 p-2 border rounded h-20" placeholder="Enter your message..."></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded">Apply Changes</button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Connect Components",
      description: "Click on the green dot of the trigger and drag to the blue dot of the action to connect them",
      icon: Link2,
      color: "bg-indigo-500",
      image: "https://i.postimg.cc/7YsgJ9Dz/Screenshot-2025-09-11-163119.png", 
      mockup: (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="bg-white rounded-lg p-8 shadow">
            <div className="flex items-center justify-center gap-8 relative">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center relative">
                <Zap className="w-8 h-8 text-green-600" />
                <div className="absolute -right-2 top-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <MousePointer2 className="w-6 h-6 text-blue-600 animate-bounce" />
              </div>
              <svg className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-8" style={{marginLeft: '-4rem'}}>
                <path d="M 0 4 Q 64 4 128 4" stroke="#22c55e" strokeWidth="3" fill="none" strokeDasharray="5,5" className="animate-pulse" />
              </svg>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center relative">
                <Send className="w-8 h-8 text-purple-600" />
                <div className="absolute -left-2 top-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">Click and drag from green dot to blue dot</p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Save Workflow",
      description: "Press Ctrl+S to save your workflow, give it a name, and make it live",
      icon: Save,
      color: "bg-emerald-500",
      image: "https://i.postimg.cc/65v9C5xh/Screenshot-2025-09-11-163239.png",
      mockup: (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="bg-white rounded-lg p-8 shadow relative">
            <div className="flex items-center justify-center gap-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <div className="w-8 h-1 bg-green-500 rounded"></div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Send className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            {/* Save Dialog */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">Save Workflow</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Workflow Name</label>
                    <input type="text" className="w-full mt-1 p-2 border rounded" placeholder="GitHub to Slack Notification" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea className="w-full mt-1 p-2 border rounded h-16" placeholder="Send Slack notification when code is pushed..."></textarea>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded">Cancel</button>
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      Save & Activate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Test Your Workflow",
      description: "Your workflow is now live! Test it by going to the workflow detail page and sending a test message",
      icon: CheckCircle,
      color: "bg-green-500",
      image: "https://i.postimg.cc/Gp238PL4/Screenshot-2025-09-11-163453.png", 
      mockup: (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold">GitHub to Slack Notification</h3>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Total Runs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-500">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">N/A</div>
              <div className="text-sm text-gray-500">Avg Time</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Play className="w-4 h-4" />
              Test Workflow
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Edit</button>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            How to Create Your First Workflow
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Follow these simple steps to create, configure, and activate your automated workflow in minutes
          </motion.p>
        </div>

        {/* Steps Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeStep === index
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <step.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{step.id}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${steps[activeStep].color} rounded-full flex items-center justify-center text-white`}>
                    {React.createElement(steps[activeStep].icon, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Step {steps[activeStep].id}</div>
                    <h3 className="text-2xl font-bold text-gray-900">{steps[activeStep].title}</h3>
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {steps[activeStep].description}
                </p>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeStep ? 'bg-blue-600 w-8' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    disabled={activeStep === steps.length - 1}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Image or Mockup */}
              <div className="p-8 bg-gray-50">
                <div className="sticky top-8">
                  {steps[activeStep].image ? (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <img 
                        src={steps[activeStep].image} 
                        alt={steps[activeStep].title}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : (
                    steps[activeStep].mockup
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 mt-3">No credit card required • Free forever plan available</p>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowCreationGuide;
