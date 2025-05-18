import React, { useState } from 'react';
import { ArrowLeft, Search, FileText, BarChart, Loader2, TrendingUp, Target, AlertTriangle, Lightbulb, Brain, Users, Zap, Globe, Eye, Shield, Award, DollarSign, Calendar, Building } from 'lucide-react';
import { searchAndAnalyzeMarket } from '../../lib/genai';

type ResearchResult = {
  title: string;
  source: string;
  summary: string;
  relevanceScore: number;
  type: string;
};

type Recommendation = {
  action: string;
  priority: "high" | "medium" | "low";
  rationale: string;
  timeframe?: string;
  impact?: string;
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
  agentInsights?: {
    trends: any;
    competitive: any;
    audience: any;
    strategic: any;
  };
  executiveSummary?: {
    marketSize: string;
    growthRate: string;
    keyFinding: string;
    investmentThesis: string;
  };
};

type MarketResearchAssistantProps = {
  onBack: () => void;
};

export const MarketResearchAssistant: React.FC<MarketResearchAssistantProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ResearchResult[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'executive' | 'insights' | 'competitive' | 'agents'>('executive');
  const [error, setError] = useState<string | null>(null);
  const [researchProgress, setResearchProgress] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    setSearchResults(null);
    setAnalysisResult(null);
    setError(null);
    setResearchProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setResearchProgress(prev => Math.min(prev + 20, 90));
    }, 500);
    
    try {
      const result = await searchAndAnalyzeMarket(query);
      clearInterval(progressInterval);
      setResearchProgress(100);
      
      // Enhanced parsing and structuring
      const enhancedResult = {
        ...result.analysis,
        competitiveAnalysis: result.competitiveAnalysis,
        agentInsights: result.agentInsights,
        executiveSummary: {
          marketSize: extractMarketSize(result.analysis.marketInsights),
          growthRate: extractGrowthRate(result.analysis.marketInsights),
          keyFinding: result.analysis.keyTrends[0] || "Market showing positive momentum",
          investmentThesis: generateInvestmentThesis(result.analysis)
        }
      };
      
      setSearchResults(result.searchResults);
      setAnalysisResult(enhancedResult);
      setActiveTab('executive');
      
      setTimeout(() => setResearchProgress(0), 1000);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error in market research:', error);
      setError('Failed to complete market research. Please try again.');
      setResearchProgress(0);
    } finally {
      setIsSearching(false);
    }
  };

  const extractMarketSize = (insights: string): string => {
    // Look for market size indicators in the insights
    const sizeMatch = insights.match(/\$[\d.]+\s*[bBmM]illion|\$[\d.]+\s*[tT]rillion/);
    return sizeMatch ? sizeMatch[0] : "Market size analysis pending";
  };

  const extractGrowthRate = (insights: string): string => {
    // Look for growth rate indicators
    const growthMatch = insights.match(/(\d+\.?\d*%)\s*(growth|CAGR|increase)/i);
    return growthMatch ? growthMatch[1] + " growth" : "Growth analysis in progress";
  };

  const generateInvestmentThesis = (analysis: any): string => {
    const opportunities = analysis.opportunities || [];
    const threats = analysis.threats || [];
    
    if (opportunities.length > threats.length) {
      return "Strong investment potential with multiple growth vectors and manageable risk profile.";
    } else if (threats.length > opportunities.length) {
      return "Cautious approach recommended due to significant market headwinds and competitive pressures.";
    } else {
      return "Balanced investment opportunity requiring strategic execution and risk management.";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
      case 'low':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          text: 'text-gray-800 dark:text-gray-200',
          badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
        };
    }
  };

  const renderExecutiveSummary = () => {
    if (!analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building size={48} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Executive Summary Pending
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Search for a market segment to generate comprehensive executive insights
          </p>
        </div>
      );
    }

    const { executiveSummary, keyTrends, recommendations } = analysisResult;

    return (
      <div className="space-y-6">
        {/* Executive Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Market Size</p>
                <p className="text-2xl font-bold">{executiveSummary?.marketSize}</p>
              </div>
              <DollarSign size={24} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold">{executiveSummary?.growthRate}</p>
              </div>
              <TrendingUp size={24} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Opportunities</p>
                <p className="text-2xl font-bold">{analysisResult.opportunities.length}</p>
              </div>
              <Lightbulb size={24} className="text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Risk Level</p>
                <p className="text-2xl font-bold">{analysisResult.threats.length > 3 ? 'High' : analysisResult.threats.length > 1 ? 'Medium' : 'Low'}</p>
              </div>
              <AlertTriangle size={24} className="text-amber-200" />
            </div>
          </div>
        </div>

        {/* Key Insights Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Market Insights
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {analysisResult.marketInsights}
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              Investment Thesis
            </h4>
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              {executiveSummary?.investmentThesis}
            </p>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Priority Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec, index) => {
              const style = getPriorityStyle(rec.priority);
              return (
                <div key={index} className={`${style.bg} ${style.border} border rounded-lg p-4`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`${style.badge} px-2 py-1 rounded text-xs font-medium`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <Calendar size={14} className="text-gray-400" />
                  </div>
                  <h4 className={`${style.text} font-medium mb-2`}>
                    {rec.action}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {rec.rationale}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Trends Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Market Trends Overview
          </h3>
          <div className="space-y-3">
            {keyTrends.slice(0, 3).map((trend, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {trend}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMarketInsights = () => {
    if (!analysisResult) return null;

    return (
      <div className="space-y-6">
        {/* Opportunities & Threats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Opportunities</h3>
            </div>
            <div className="space-y-3">
              {analysisResult.opportunities.map((opportunity, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {opportunity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Threats</h3>
            </div>
            <div className="space-y-3">
              {analysisResult.threats.map((threat, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {threat}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Trends Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Trends Deep Dive</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResult.keyTrends.map((trend, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Strategic Action Items</h3>
          </div>
          <div className="space-y-4">
            {analysisResult.recommendations.map((rec, index) => {
              const style = getPriorityStyle(rec.priority);
              return (
                <div key={index} className={`${style.bg} ${style.border} border rounded-lg p-4`}>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className={`${style.text} font-semibold`}>
                      {rec.action}
                    </h4>
                    <span className={`${style.badge} px-2 py-1 rounded text-xs font-medium`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCompetitiveAnalysis = () => {
    if (!analysisResult?.competitiveAnalysis) return null;

    const { competitiveAnalysis } = analysisResult;

    return (
      <div className="space-y-6">
        {/* Market Share Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Share Analysis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Market Leader</h4>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  {competitiveAnalysis.marketShare.leader}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">Challenger</h4>
                <p className="text-purple-800 dark:text-purple-300 text-sm">
                  {competitiveAnalysis.marketShare.challengerSegment}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Players</h4>
              <div className="space-y-2">
                {competitiveAnalysis.keyPlayers.map((player, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{player}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Advantages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Competitive Advantages</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitiveAnalysis.competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
                  {advantage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Competitive Landscape Visual */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Competitive Positioning Map
          </h3>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Interactive competitive positioning visualization would appear here
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAgentInsights = () => {
    if (!analysisResult?.agentInsights) return null;

    const { trends, competitive, audience, strategic } = analysisResult.agentInsights;

    return (
      <div className="space-y-6">
        {/* Trends Agent */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Market Trends Agent</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Trending Topics</h4>
              <div className="space-y-2">
                {Object.entries(trends.trendingTopics || {}).map(([key, value]) => (
                  <div key={key} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <span className="font-medium text-blue-900 dark:text-blue-200 text-sm block mb-1">{key}</span>
                    <span className="text-blue-700 dark:text-blue-300 text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Emerging Technologies</h4>
              <div className="space-y-2">
                {Object.entries(trends.emergingTechnologies || {}).map(([key, value]) => (
                  <div key={key} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <span className="font-medium text-purple-900 dark:text-purple-200 text-sm block mb-1">{key}</span>
                    <span className="text-purple-700 dark:text-purple-300 text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Agent */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-purple-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Competitive Intelligence Agent</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Key Competitors Analysis</h4>
              <div className="space-y-2">
                {Object.entries(competitive.keyCompetitors || {}).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <span className="font-medium text-gray-900 dark:text-white text-sm block mb-1">{key}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Market Gaps</h4>
              <div className="space-y-2">
                {Object.entries(competitive.marketGaps || {}).map(([key, value]) => (
                  <div key={key} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <span className="font-medium text-orange-900 dark:text-orange-200 text-sm block mb-1">{key}</span>
                    <span className="text-orange-700 dark:text-orange-300 text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audience Agent */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Audience Analysis Agent</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Target Segments</h4>
              <div className="space-y-2">
                {Object.entries(audience.targetSegments || {}).map(([key, value]) => (
                  <div key={key} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <span className="font-medium text-green-900 dark:text-green-200 text-sm block mb-1">{key}</span>
                    <span className="text-green-700 dark:text-green-300 text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Unmet Needs</h4>
              <div className="space-y-2">
                {Object.entries(audience.unmetNeeds || {}).map(([key, value]) => (
                  <div key={key} className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
                    <span className="font-medium text-teal-900 dark:text-teal-200 text-sm block mb-1">{key}</span>
                    <span className="text-teal-700 dark:text-teal-300 text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Agent */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-amber-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Strategic Insights Agent</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Investment Priorities</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(strategic.investmentPriorities || {}).map(([key, value]) => (
                  <div key={key} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                    <span className="font-medium text-amber-900 dark:text-amber-200 text-sm block mb-1">{key}</span>
                    <span className="text-amber-700 dark:text-amber-300 text-xs">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Key Success Factors</h4>
              <div className="space-y-2">
                {Object.entries(strategic.keySuccessFactors || {}).map(([key, value]) => (
                  <div key={key} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm block">{key}</span>
                      <span className="text-gray-600 dark:text-gray-400 text-xs">{String(value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSearchInterface = () => {
    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-teal-200 dark:border-teal-800 rounded-full"></div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Multi-Agent Research in Progress
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Analyzing "{query}" across multiple dimensions
          </p>
          
          {/* Progress Bar */}
          <div className="w-80 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${researchProgress}%` }}
            ></div>
          </div>
          
          {/* Agent Status */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { name: 'Web Search', icon: Search, color: 'text-blue-500' },
              { name: 'Trends', icon: TrendingUp, color: 'text-purple-500' },
              { name: 'Competitive', icon: Shield, color: 'text-green-500' },
              { name: 'Audience', icon: Users, color: 'text-amber-500' },
              { name: 'Strategic', icon: Brain, color: 'text-red-500' }
            ].map((agent, index) => (
              <div key={agent.name} className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${
                  researchProgress > index * 20 ? 'animate-pulse' : ''
                }`}>
                  <agent.icon size={20} className={agent.color} />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!searchResults && !analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6">
            <Brain size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Comprehensive Market Research
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Enter a market segment or company to begin multi-agent analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
            {[
              { icon: TrendingUp, title: 'Market Trends', desc: 'Identify emerging patterns and growth drivers' },
              { icon: Eye, title: 'Competitive Intel', desc: 'Analyze market leaders and competitive advantages' },
              { icon: Users, title: 'Audience Insights', desc: 'Understand customer segments and behavior' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <feature.icon size={32} className="text-teal-500 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Header */}
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
          <p className="text-gray-600 dark:text-gray-300">AI-Powered Multi-Agent Research System</p>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* Search Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., AI voice cloning market, ElevenLabs competitors, B2B SaaS trends..."
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-white placeholder-gray-400"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSearching ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Search size={20} className="inline mr-2" />
                  Research
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Navigation Tabs */}
        {analysisResult && (
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              {[
                { id: 'executive', label: 'Executive Summary', icon: Building },
                { id: 'insights', label: 'Market Insights', icon: BarChart },
                { id: 'competitive', label: 'Competitive Analysis', icon: Shield },
                { id: 'agents', label: 'Agent Reports', icon: Brain }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderSearchInterface()}
          {activeTab === 'executive' && renderExecutiveSummary()}
          {activeTab === 'insights' && renderMarketInsights()}
          {activeTab === 'competitive' && renderCompetitiveAnalysis()}
          {activeTab === 'agents' && renderAgentInsights()}
        </div>
      </div>
    </div>
  );
};