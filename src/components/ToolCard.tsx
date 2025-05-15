import React from 'react';
import { Tool } from '../types';
import { ArrowRight } from 'lucide-react';

type ToolCardProps = {
  tool: Tool;
  onClick: () => void;
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const getGradient = () => {
    switch (tool.color) {
      case 'indigo':
        return 'from-indigo-500 to-purple-600';
      case 'teal':
        return 'from-teal-500 to-emerald-600';
      case 'amber':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className={`h-2 bg-gradient-to-r ${getGradient()}`}></div>
      <div className="p-6">
        <div className="mb-4">{tool.icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {tool.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {tool.description}
        </p>
        
        <ul className="space-y-2 mb-6">
          {tool.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 bg-${tool.color}-500`}></span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={onClick}
          className={`w-full mt-2 bg-${tool.color}-100 hover:bg-${tool.color}-200 dark:bg-${tool.color}-900/20 dark:hover:bg-${tool.color}-900/30 text-${tool.color}-600 dark:text-${tool.color}-400 font-medium rounded-lg py-2 px-4 flex items-center justify-center transition-colors duration-300 ease-in-out`}
        >
          <span>Explore Tool</span>
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};