import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2, Brain, Target, Wrench, AlertTriangle } from 'lucide-react';
import { simulateCofounder } from '../../lib/genai';

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
};

type Message = {
  role: 'user' | 'cofounder';
  content: string;
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
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scenarios: Scenario[] = [
    {
      id: 'fundraising',
      title: 'Fundraising Strategy',
      description: 'Discuss your startup\'s fundraising approach and investor pitch'
    },
    {
      id: 'product',
      title: 'Product Development',
      description: 'Debate product roadmap priorities and feature development'
    },
    {
      id: 'pivot',
      title: 'Considering a Pivot',
      description: 'Evaluate whether to change your business model based on market feedback'
    },
    {
      id: 'hiring',
      title: 'Hiring Decision',
      description: 'Discuss potential candidates for a key leadership position'
    },
    {
      id: 'competition',
      title: 'Competitive Response',
      description: 'Plan your strategy against new competitors in the market'
    },
    {
      id: 'scaling',
      title: 'Scaling Operations',
      description: 'Discuss how to scale your business operations and team'
    }
  ];

  const communicationStyles: CommunicationStyle[] = [
    {
      id: 'analytical',
      name: 'Analytical',
      description: 'Data-driven, logical, focused on metrics and evidence',
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: 'visionary',
      name: 'Visionary',
      description: 'Big-picture thinker, inspirational, future-oriented',
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 'pragmatic',
      name: 'Pragmatic',
      description: 'Practical, solution-oriented, focuses on implementation',
      icon: <Wrench className="h-5 w-5" />
    },
    {
      id: 'devil',
      name: 'Devil\'s Advocate',
      description: 'Challenges assumptions, identifies potential issues',
      icon: <AlertTriangle className="h-5 w-5" />
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

      // Get initial message from Gemini
      const initialPrompt = `Start a co-founder conversation about ${scenario.title}. This is the beginning of our discussion.`;
      
      const initialMessage = await simulateCofounder(
        initialPrompt,
        selectedStyle as keyof any,
        scenario.title,
        []
      );
      
      setMessages([{ role: 'cofounder', content: initialMessage }]);
    } catch (error) {
      console.error('Error initializing co-founder:', error);
      setError('Failed to initialize co-founder conversation. Please try again.');
      // Set a fallback message if API fails
      setMessages([{ 
        role: 'cofounder', 
        content: `Hi! I'm excited to discuss ${scenarios.find(s => s.id === selectedScenario)?.title} with you. What's on your mind?` 
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

      // Pass conversation history to maintain context
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant' as const,
        content: msg.content
      }));

      const responseContent = await simulateCofounder(
        userMessage,
        selectedStyle as keyof any,
        scenario.title,
        conversationHistory
      );
      
      setMessages(prev => [...prev, { role: 'cofounder', content: responseContent }]);
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
            <p className="text-gray-600 dark:text-gray-300">Powered by Google Gemini</p>
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
      <div className="flex items-center mb-6">
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
              {communicationStyles.find(s => s.id === selectedStyle)?.icon}
              <span className="ml-1">{communicationStyles.find(s => s.id === selectedStyle)?.name} Style</span>
            </div>
            <span className="mx-2">•</span>
            <span className="text-xs">Powered by Gemini</span>
          </div>
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
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2 text-amber-500" />
                  <span className="text-gray-600 dark:text-gray-300">Co-founder is thinking...</span>
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
        </div>
      </div>
    </div>
  );
};