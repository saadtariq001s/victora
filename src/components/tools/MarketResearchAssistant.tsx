import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, BarChart, Loader2, TrendingUp } from 'lucide-react';
import { searchAndAnalyzeMarket } from '../../lib/genai';

type ResearchResult = {
  title: string;
  source: string;
  summary: string;
};

type AnalysisResult = {
  trends: string[];
  insights: string;
  recommendations: string[];
  charts: {
    title: string;
    type: 'bar' | 'line';
    labels: string[];
    data: number[];
  }[];
};

type MarketResearchAssistantProps = {
  onBack: () => void;
};

export const MarketResearchAssistant: React.FC<MarketResearchAssistantProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchResults, setSearchResults] = useState<ResearchResult[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'analysis'>('search');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    setSearchResults(null);
    setAnalysisResult(null);
    setError(null);
    
    try {
      // Call the actual Gemini API for market research
      const result = await searchAndAnalyzeMarket(query);
      
      setSearchResults(result.searchResults);
      
      // Generate mock charts based on the query topic
      const mockCharts = generateMockCharts(query);
      
      setAnalysisResult({
        trends: result.analysis.trends,
        insights: result.analysis.insights,
        recommendations: result.analysis.recommendations,
        charts: mockCharts
      });
      
      setActiveTab('search');
    } catch (error) {
      console.error('Error in market research:', error);
      setError('Failed to search and analyze market data. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const generateMockCharts = (query: string) => {
    // Generate contextual chart data based on the query
    const charts = [];
    
    if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('artificial intelligence')) {
      charts.push({
        title: "AI Market Growth by Sector",
        type: "bar" as const,
        labels: ["Healthcare", "Finance", "Manufacturing", "Retail", "Education"],
        data: [42, 38, 35, 28, 22]
      });
      charts.push({
        title: "AI Investment Focus Areas",
        type: "bar" as const,
        labels: ["NLP", "Computer Vision", "Predictive Analytics", "Generative AI", "Robotics"],
        data: [35, 30, 25, 22, 18]
      });
    } else if (query.toLowerCase().includes('saas') || query.toLowerCase().includes('software')) {
      charts.push({
        title: "SaaS Market Segments",
        type: "bar" as const,
        labels: ["CRM", "Project Management", "Accounting", "HR", "Marketing"],
        data: [28, 24, 22, 20, 18]
      });
    } else {
      charts.push({
        title: "Market Growth by Region",
        type: "bar" as const,
        labels: ["North America", "Europe", "Asia-Pacific", "Latin America", "MEA"],
        data: [35, 28, 25, 18, 14]
      });
    }
    
    return charts;
  };

  const handleAnalyze = () => {
    setActiveTab('analysis');
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={40} className="text-teal-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Searching and analyzing "{query}"...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Powered by Google Gemini</p>
        </div>
      );
    }
    
    if (!searchResults) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search size={40} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Enter a search query to begin your research
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Search for market trends, competitive intelligence, or industry insights
          </p>
          <div className="mt-4 text-xs text-gray-400">
            Powered by Google Gemini AI
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Research Results for "{query}"
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center px-3 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors text-sm"
          >
            <BarChart size={16} className="mr-2" />
            View Analysis
          </button>
        </div>
        
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {result.title}
              </h4>
              <p className="text-sm text-teal-600 dark:text-teal-400 mb-2">
                {result.source}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {result.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnalysisResults = () => {
    if (!analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart size={40} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No analysis available yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Search for market data first to see insights and analysis here
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <TrendingUp size={20} className="mr-2 text-teal-500" />
            Key Trends
          </h3>
          <ul className="space-y-2">
            {analysisResult.trends.map((trend, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mt-1.5 mr-2"></span>
                <span className="text-gray-700 dark:text-gray-300">{trend}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Strategic Insights
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {analysisResult.insights}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Recommendations
          </h3>
          <ul className="space-y-2">
            {analysisResult.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-2"></span>
                <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Market Data Visualization
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {analysisResult.charts.map((chart, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 text-center">
                  {chart.title}
                </h4>
                <div className="h-64 flex items-end justify-around">
                  {chart.labels.map((label, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="w-10 bg-teal-500 rounded-t-sm mx-1" 
                        style={{ height: `${chart.data[i] * 2}px` }}
                      ></div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {label}
                      </div>
                      <div className="text-xs font-medium text-teal-600 dark:text-teal-400">
                        {chart.data[i]}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Analysis powered by Google Gemini AI
        </div>
      </div>
    );
  };

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Research Assistant</h2>
          <p className="text-gray-600 dark:text-gray-300">Powered by Google Gemini</p>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for market trends, competitors, industry insights..."
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
            >
              {isSearching ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Search size={20} />
              )}
            </button>
          </form>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === 'search'
                  ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              <FileText size={16} className="mr-2" /> 
              Search Results
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              disabled={!analysisResult}
              className={`px-4 py-2 text-sm font-medium flex items-center ${
                activeTab === 'analysis'
                  ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              } ${!analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <BarChart size={16} className="mr-2" /> 
              Analysis
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'search' ? renderSearchResults() : renderAnalysisResults()}
        </div>
      </div>
    </div>
  );
};