import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Brain, Target, Wrench, AlertTriangle, RotateCcw, Lightbulb, TrendingUp, Database, ShieldAlert } from 'lucide-react';
import { simulateCofounder, resetCofounderMemory } from '../../lib/genai';

type Scenario = {
  id: string;
  title: string;
  description: string;
};

type CommunicationStyle = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

type Message = {
  role: 'user' | 'cofounder';
  content: string;
  structuredData?: {
    reasoning?: string;
    nextSteps?: string[];
    dataPoints?: string[];
    risks?: string[];
    opportunities?: string[];
  };
};

type CoFounderSimulatorProps = {
  onBack: () => void;
};

export const CoFounderSimulator: React.FC<CoFounderSimulatorProps> = ({ onBack }) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStructuredData, setShowStructuredData] = useState(true);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scenarios: Scenario[] = [
    {
      id: 'fundraising',
      title: 'Fundraising Strategy',
      description: 'Discuss your startup\'s fundraising approach, valuation, and investor targeting'
    },
    {
      id: 'product',
      title: 'Product Development',
      description: 'Debate product roadmap priorities, feature development, and user feedback'
    },
    {
      id: 'pivot',
      title: 'Considering a Pivot',
      description: 'Evaluate whether to change your business model based on market feedback'
    },
    {
      id: 'hiring',
      title: 'Hiring Decision',
      description: 'Discuss potential candidates for key leadership positions and team building'
    },
    {
      id: 'competition',
      title: 'Competitive Response',
      description: 'Plan your strategy against new competitors and market disruptions'
    },
    {
      id: 'scaling',
      title: 'Scaling Operations',
      description: 'Discuss how to scale your business operations, team, and infrastructure'
    },
    {
      id: 'acquisition',
      title: 'Acquisition Opportunity',
      description: 'Evaluate a potential acquisition target or merger opportunity'
    },
    {
      id: 'international',
      title: 'International Expansion',
      description: 'Plan your strategy for entering new international markets'
    }
  ];

  const communicationStyles: CommunicationStyle[] = [
    {
      id: 'analytical',
      name: 'Analytical',
      description: 'Data-driven, logical, focused on metrics and evidence',
      icon: <Brain className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'visionary',
      name: 'Visionary',
      description: 'Big-picture thinker, inspirational, future-oriented',
      icon: <Target className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'pragmatic',
      name: 'Pragmatic',
      description: 'Practical, solution-oriented, focuses on implementation',
      icon: <Wrench className="h-5 w-5" />,
      color: 'green'
    },
    {
      id: 'devil',
      name: 'Devil\'s Advocate',
      description: 'Challenges assumptions, identifies potential issues',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'red'
    }
  ];

  useEffect(() => {
    if (selectedScenario && selectedStyle && !isConfigured) {
      initializeCofounder();
    }
  }, [selectedScenario, selectedStyle, isConfigured]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeCofounder = async () => {
    setIsConfigured(true);
    setIsProcessing(true);
    setError(null);
    
    try {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      const style = communicationStyles.find(s => s.id === selectedStyle);
      
      if (!scenario || !style) {
        throw new Error('Invalid scenario or style selected');
      }

      // Get initial message from LangChain-powered Gemini
      const initialPrompt = `Let's start discussing ${scenario.title}. This is the beginning of our co-founder conversation. Set the context and ask an engaging opening question.`;
      
      const response = await simulateCofounder(
        initialPrompt,
        selectedStyle as keyof any,
        scenario.title
      );
      
      setMessages([{ 
        role: 'cofounder', 
        content: response.response,
        structuredData: {
          reasoning: response.reasoning,
          nextSteps: response.nextSteps,
          dataPoints: response.dataPoints,
          risks: response.risks,
          opportunities: response.opportunities
        }
      }]);
    } catch (error) {
      console.error('Error initializing co-founder:', error);
      setError('Failed to initialize co-founder conversation. Please try again.');
      // Set a fallback message if API fails
      setMessages([{ 
        role: 'cofounder', 
        content: `Hi! I'm excited to discuss ${scenarios.find(s => s.id === selectedScenario)?.title} with you. What specific aspect would you like to focus on first?` 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isProcessing || !isConfigured) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputText('');
    setIsProcessing(true);
    setError(null);

    try {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      
      if (!scenario) {
        throw new Error('No scenario selected');
      }

      // Get structured response from LangChain-powered Gemini
      const response = await simulateCofounder(
        userMessage,
        selectedStyle as keyof any,
        scenario.title
      );
      
      setMessages(prev => [...prev, { 
        role: 'cofounder', 
        content: response.response,
        structuredData: {
          reasoning: response.reasoning,
          nextSteps: response.nextSteps,
          dataPoints: response.dataPoints,
          risks: response.risks,
          opportunities: response.opportunities
        }
      }]);
    } catch (error) {
      console.error('Error getting co-founder response:', error);
      setError('Failed to get co-founder response. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'cofounder', 
        content: 'I apologize, but I encountered an error. Could you please rephrase your message?' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetConversation = () => {
    if (selectedStyle) {
      resetCofounderMemory(selectedStyle as keyof any);
      setMessages([]);
      setIsConfigured(false);
      setError(null);
    }
  };

  const getStyleColor = (styleId: string) => {
    const style = communicationStyles.find(s => s.id === styleId);
    switch (style?.color) {
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      default: return 'text-amber-600 dark:text-amber-400';
    }
  };

  const renderStructuredData = (data: Message['structuredData']) => {
    if (!data || !showStructuredData) return null;

    return (
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
        {data.reasoning && (
          <div className="text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400">Reasoning:</span>
            <span className="ml-2 text-gray-500 dark:text-gray-400">{data.reasoning}</span>
          </div>
        )}
        
        {data.nextSteps && data.nextSteps.length > 0 && (
          <div className="text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <Lightbulb className="h-3 w-3 mr-1" />
              Next Steps:
            </span>
            <ul className="ml-4 mt-1 space-y-1">
              {data.nextSteps.map((step, index) => (
                <li key={index} className="text-gray-500 dark:text-gray-400">• {step}</li>
              ))}
            </ul>
          </div>
        )}
        
        {data.dataPoints && data.dataPoints.length > 0 && (
          <div className="text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <Database className="h-3 w-3 mr-1" />
              Data Points:
            </span>
            <ul className="ml-4 mt-1 space-y-1">
              {data.dataPoints.map((point, index) => (
                <li key={index} className="text-gray-500 dark:text-gray-400">• {point}</li>
              ))}
            </ul>
          </div>
        )}
        
        {data.risks && data.risks.length > 0 && (
          <div className="text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Risks:
            </span>
            <ul className="ml-4 mt-1 space-y-1">
              {data.risks.map((risk, index) => (
                <li key={index} className="text-gray-500 dark:text-gray-400">• {risk}</li>
              ))}
            </ul>
          </div>
        )}
        
        {data.opportunities && data.opportunities.length > 0 && (
          <div className="text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Opportunities:
            </span>
            <ul className="ml-4 mt-1 space-y-1">
              {data.opportunities.map((opportunity, index) => (
                <li key={index} className="text-gray-500 dark:text-gray-400">• {opportunity}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Render configuration form if not configured yet
  if (!isConfigured) {
    return (
      <div className="flex flex-col h-[calc(100vh-16rem)]">
        <div className="flex items-center mb-6">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Co-Founder Simulator</h2>
            <p className="text-gray-600 dark:text-gray-300">Powered by Google Gemini + LangChain</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Configure Your Co-Founder</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  1. Select a Scenario
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {scenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedScenario === scenario.id 
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <h5 className={`font-medium mb-1 ${
                        selectedScenario === scenario.id 
                          ? 'text-amber-700 dark:text-amber-400' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {scenario.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {scenario.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  2. Choose Communication Style
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {communicationStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedStyle === style.id 
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`mr-2 ${
                          selectedStyle === style.id 
                            ? 'text-amber-600 dark:text-amber-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {style.icon}
                        </div>
                        <h5 className={`font-medium ${
                          selectedStyle === style.id 
                            ? 'text-amber-700 dark:text-amber-400' 
                            : 'text-gray-800 dark:text-gray-200'
                        }`}>
                          {style.name}
                        </h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {style.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (selectedScenario && selectedStyle) {
                      setIsConfigured(true);
                    }
                  }}
                  disabled={!selectedScenario || !selectedStyle}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Co-Founder Simulator</h2>
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
              <span>{scenarios.find(s => s.id === selectedScenario)?.title}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <span className={getStyleColor(selectedStyle || '')}>
                  {communicationStyles.find(s => s.id === selectedStyle)?.icon}
                </span>
                <span className="ml-1">{communicationStyles.find(s => s.id === selectedStyle)?.name} Style</span>
              </div>
              <span className="mx-2">•</span>
              <span className="text-xs">Powered by Gemini + LangChain</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStructuredData(!showStructuredData)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              showStructuredData 
                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
            }`}
          >
            {showStructuredData ? 'Hide' : 'Show'} Insights
          </button>
          <button
            onClick={handleResetConversation}
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Reset conversation"
          >
            <RotateCcw size={14} className="mr-1" />
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.role === 'cofounder' && renderStructuredData(message.structuredData)}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2 text-amber-500" />
                  <span className="text-gray-600 dark:text-gray-300">Co-founder is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
              placeholder="Type your message to your co-founder..."
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
              aria-label="Send message"
            >
              {isProcessing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Enhanced with LangChain for structured responses with reasoning, insights, and next steps
          </div>
        </div>
      </div>
    </div>
  );
};