import React from 'react';
import { Tool } from '../types';
import { ToolCard } from './ToolCard';
import { Mic, Search, Users } from 'lucide-react';

type AIToolsDashboardProps = {
  onSelectTool: (tool: string) => void;
};

export const AIToolsDashboard: React.FC<AIToolsDashboardProps> = ({ 
  onSelectTool 
}) => {
  const tools: Tool[] = [
    {
      id: 'mentor',
      name: 'AI Mentor Bot',
      description: 'Voice-interactive learning assistant powered by Whisper and GPT-4',
      icon: <Mic className="h-8 w-8 text-indigo-500" />,
      features: [
        'Speech-to-text conversion',
        'Natural conversation processing',
        'Text-to-speech output',
        'Real-time audio streaming'
      ],
      color: 'indigo'
    },
    {
      id: 'research',
      name: 'Market Research Assistant',
      description: 'Multi-agent system for market insights and trend analysis',
      icon: <Search className="h-8 w-8 text-teal-500" />,
      features: [
        'Web search integration',
        'Automated data extraction',
        'Intelligent trend analysis',
        'Data visualization dashboard'
      ],
      color: 'teal'
    },
    {
      id: 'cofounder',
      name: 'Co-Founder Simulator',
      description: 'Conversational AI that simulates startup co-founder scenarios',
      icon: <Users className="h-8 w-8 text-amber-500" />,
      features: [
        'Scenario-based simulations',
        'Adjustable communication styles',
        'Pre-defined startup situations',
        'Real-time response generation'
      ],
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
          Elevate Your Startup Journey with AI
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore our collection of state-of-the-art AI tools designed to enhance productivity, 
          provide insights, and simulate real-world interactions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onClick={() => onSelectTool(tool.id)} 
          />
        ))}
      </div>
      
      {/* <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Technical Implementation
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          All tools are built with industry-standard technologies:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span>FastAPI backend</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span>OpenAI GPT-4 API</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span>LangChain for agents</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span>React frontend</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span>Local deployment (uvicorn)</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span>Public testing (ngrok)</span>
          </li>
        </ul>
      </div> */}
    </div>
  );
};