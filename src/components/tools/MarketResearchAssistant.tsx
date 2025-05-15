import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, BarChart, Loader2, TrendingUp, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { searchAndAnalyzeMarket } from '../../lib/genai';

type ResearchResult = {
  title: string;
  source: string;
  summary: string;
  relevanceScore: number;
};

type Recommendation = {
  action: string;
  priority: "high" | "medium" | "low";
  rationale: string;
};

type AnalysisResult = {
  keyTrends: string[];
  marketInsights: string;
  opportunities: string[];
  threats: string[];
  recommendations: Recommendation[];
  competitiveAnalysis: {
    keyPlayers: string[];
    marketShare: {
      leader: string;
      challengerSegment: string;
    };
    competitiveAdvantages: string[];
  };
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
      // Call the LangChain-powered Gemini API for market research
      const result = await searchAndAnalyzeMarket(query);
      
      setSearchResults(result.searchResults);
      
      // Generate mock charts based on the query topic
      const mockCharts = generateMockCharts(query);
      
      setAnalysisResult({
        keyTrends: result.analysis.keyTrends,
        marketInsights: result.analysis.marketInsights,
        opportunities: result.analysis.opportunities,
        threats: result.analysis.threats,
        recommendations: result.analysis.recommendations,
        competitiveAnalysis: result.competitiveAnalysis,
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
        title: "AI Market Growth by Sector (%)",
        type: "bar" as const,
        labels: ["Healthcare", "Finance", "Manufacturing", "Retail", "Education"],
        data: [42, 38, 35, 28, 22]
      });
      charts.push({
        title: "AI Investment Focus Areas (%)",
        type: "bar" as const,
        labels: ["NLP", "Computer Vision", "Predictive Analytics", "Generative AI", "Robotics"],
        data: [35, 30, 25, 22, 18]
      });
    } else if (query.toLowerCase().includes('saas') || query.toLowerCase().includes('software')) {
      charts.push({
        title: "SaaS Market Segments (%)",
        type: "bar" as const,
        labels: ["CRM", "Project Management", "Accounting", "HR", "Marketing"],
        data: [28, 24, 22, 20, 18]
      });
      charts.push({
        title: "SaaS Growth by Company Size (%)",
        type: "bar" as const,
        labels: ["Enterprise", "Mid-Market", "SMB", "Startup"],
        data: [45, 30, 20, 15]
      });
    } else {
      charts.push({
        title: "Market Growth by Region (%)",
        type: "bar" as const,
        labels: ["North America", "Europe", "Asia-Pacific", "Latin America", "MEA"],
        data: [35, 28, 25, 18, 14]
      });
      charts.push({
        title: "Market Maturity Index",
        type: "bar" as const,
        labels: ["Mature", "Growth", "Emerging", "Early Stage"],
        data: [40, 35, 20, 5]
      });
    }
    
    return charts;
  };

  const handleAnalyze = () => {
    setActiveTab('analysis');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Target className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Lightbulb className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={40} className="text-teal-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Analyzing "{query}" with LangChain...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Gathering insights from multiple sources</p>
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
            Get structured market analysis with trends, opportunities, and strategic recommendations
          </p>
          <div className="mt-4 text-xs text-gray-400">
            Enhanced with LangChain for better data parsing and insights
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
            className="flex items-center px-3 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
          >
            <BarChart size={16} className="mr-2" />
            View Analysis
          </button>
        </div>
        
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {result.title}
                </h4>
                <div className="flex items-center ml-2">
                  <div className="bg-teal-100 dark:bg-teal-900/30 px-2 py-1 rounded text-xs font-medium text-teal-700 dark:text-teal-300">
                    Relevance: {Math.round(result.relevanceScore * 100)}%
                  </div>
                </div>
              </div>
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
            Search for market data first to see structured insights and analysis here
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Key Trends */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <TrendingUp size={20} className="mr-2 text-teal-500" />
            Key Market Trends
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysisResult.keyTrends.map((trend, index) => (
              <div key={index} className="flex items-start p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mt-2 mr-3"></span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{trend}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Market Insights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Strategic Market Insights
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {analysisResult.marketInsights}
            </p>
          </div>
        </div>

        {/* Opportunities and Threats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Lightbulb size={18} className="mr-2 text-green-500" />
              Market Opportunities
            </h3>
            <div className="space-y-2">
              {analysisResult.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></span>
                  <span className="text-green-800 dark:text-green-300 text-sm">{opportunity}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <AlertTriangle size={18} className="mr-2 text-red-500" />
              Market Threats
            </h3>
            <div className="space-y-2">
              {analysisResult.threats.map((threat, index) => (
                <div key={index} className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-2 mr-3"></span>
                  <span className="text-red-800 dark:text-red-300 text-sm">{threat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Strategic Recommendations
          </h3>
          <div className="space-y-3">
            {analysisResult.recommendations.map((recommendation, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(recommendation.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                    {getPriorityIcon(recommendation.priority)}
                    <span className="ml-2">{recommendation.action}</span>
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    recommendation.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {recommendation.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {recommendation.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Competitive Landscape
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Players</h4>
                <ul className="space-y-1">
                  {analysisResult.competitiveAnalysis.keyPlayers.map((player, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {player}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Market Share</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Leader:</strong> {analysisResult.competitiveAnalysis.marketShare.leader}</p>
                  <p><strong>Challenger:</strong> {analysisResult.competitiveAnalysis.marketShare.challengerSegment}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Competitive Advantages</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysisResult.competitiveAnalysis.competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {advantage}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Visualization */}
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
          Structured analysis powered by Google Gemini + LangChain with advanced parsing
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
          <p className="text-gray-600 dark:text-gray-300">Powered by Google Gemini + LangChain</p>
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
              Structured Analysis
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