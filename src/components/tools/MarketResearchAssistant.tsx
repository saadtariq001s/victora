import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Search, FileText, BarChart, Loader2, TrendingUp, Target, 
  AlertTriangle, Lightbulb, Brain, Users, Zap, Globe, Eye, Shield, 
  Award, DollarSign, Calendar, Building, Download, Filter, ChevronDown,
  Share2, PieChart, LineChart, BarChart2, ArrowUpRight, Bookmark, Check
} from 'lucide-react';

// Define types for our research data
type ResearchResult = {
  title: string;
  source: string;
  summary: string;
  relevanceScore: number;
  type: string;
  url?: string;
  date?: string;
};

type Recommendation = {
  action: string;
  priority: "high" | "medium" | "low";
  rationale: string;
  timeframe?: string;
  impact?: string;
};

type KeyMetric = {
  name: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
};

type AnalysisResult = {
  keyTrends: string[];
  marketInsights: string;
  opportunities: string[];
  threats: string[];
  recommendations: Recommendation[];
  metrics?: KeyMetric[];
  competitiveAnalysis: {
    keyPlayers: string[];
    marketShare: {
      leader: string;
      challengerSegment: string;
    };
    competitiveAdvantages: string[];
    playerProfiles?: {
      name: string;
      description: string;
      strengths: string[];
      weaknesses: string[];
    }[];
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

// Helper function to parse markdown and clean text for display
const parseMarkdown = (text: string): string => {
  if (!text) return '';
  
  // Convert **bold** to <strong>bold</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>italic</em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  // Convert simple links [text](url) to <a> tags
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 hover:underline">$1</a>');
  
  return html;
};

// Component to render parsed markdown
const MarkdownText: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div 
      className="whitespace-pre-line"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

// Component for search filters
const SearchFilters: React.FC<{
  onFilterChange: (filters: any) => void;
  isVisible: boolean;
}> = ({ onFilterChange, isVisible }) => {
  const [sources, setSources] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  
  useEffect(() => {
    onFilterChange({ sources, timeframe, sortBy });
  }, [sources, timeframe, sortBy, onFilterChange]);
  
  if (!isVisible) return null;
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sources
          </label>
          <div className="space-y-1.5">
            {["Research Reports", "News Articles", "Industry Data", "Social Media"].map(source => (
              <label key={source} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSources([...sources, source]);
                    } else {
                      setSources(sources.filter(s => s !== source));
                    }
                  }}
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{source}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timeframe
          </label>
          <select
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-1.5 px-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="year">Past Year</option>
            <option value="month">Past Month</option>
            <option value="week">Past Week</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-1.5 px-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date (Newest First)</option>
            <option value="citation">Citation Count</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={() => {
            setSources([]);
            setTimeframe("all");
            setSortBy("relevance");
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

// Simulated search and analysis function - in a real implementation, this would call the backend
const searchAndAnalyzeMarket = async (query: string): Promise<{
  searchResults: ResearchResult[];
  analysis: AnalysisResult;
}> => {
  // Simulate network request delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate more realistic search results
  const searchResults: ResearchResult[] = [
    {
      title: `${query} Market Size, Share & Trends Analysis Report, 2023-2030`,
      source: "Grand View Research",
      summary: `Comprehensive market analysis showing the ${query} market reached $89.5 billion in 2022 with a projected CAGR of 25% from 2023 to 2030. Key drivers include digital transformation, enterprise adoption, and integration with emerging technologies.`,
      relevanceScore: 0.95,
      type: "market_data",
      url: "https://www.grandviewresearch.com/reports",
      date: "June 2023"
    },
    {
      title: `The State of ${query}: Competitive Landscape 2024`,
      source: "Gartner Research",
      summary: `Analysis of leading companies in the ${query} space. The market is becoming increasingly competitive with established players and innovative startups disrupting traditional business models.`,
      relevanceScore: 0.92,
      type: "competitive",
      url: "https://www.gartner.com/research",
      date: "January 2024"
    },
    {
      title: `Consumer Adoption Trends in ${query}`,
      source: "Forrester",
      summary: `Consumer behavior analysis reveals increasing demand for ${query} solutions across demographics. Key trends include personalization, mobile-first experience, and integration with daily workflows.`,
      relevanceScore: 0.88,
      type: "audience",
      url: "https://www.forrester.com/reports",
      date: "March 2024"
    },
    {
      title: `Investment Trends in ${query} Technology`,
      source: "CB Insights",
      summary: `VC funding in ${query} technology reached $12.3B in 2023, a 40% increase YoY. Key investment areas include AI-enhanced solutions, enterprise platforms, and cross-industry applications.`,
      relevanceScore: 0.85,
      type: "funding",
      url: "https://www.cbinsights.com/research",
      date: "February 2024"
    },
    {
      title: `Regulatory Landscape for ${query} in Global Markets`,
      source: "Deloitte Insights",
      summary: `Analysis of regulatory frameworks affecting ${query} across major markets. Compliance requirements are evolving rapidly, creating both challenges and opportunities for market participants.`,
      relevanceScore: 0.82,
      type: "regulatory",
      url: "https://www2.deloitte.com/insights",
      date: "December 2023"
    },
    {
      title: `${query} Industry Outlook 2024-2025`,
      source: "McKinsey Global Institute",
      summary: `Strategic analysis of ${query} industry prospects including market drivers, challenges, and future scenarios. The report forecasts continued strong growth with increasing consolidation and strategic partnerships.`,
      relevanceScore: 0.80,
      type: "strategic",
      url: "https://www.mckinsey.com/industries",
      date: "April 2024"
    },
    {
      title: `The Future of ${query}: Technological Evolution and Innovation`,
      source: "MIT Technology Review",
      summary: `Examination of emerging technologies that will shape the future of ${query}. Key areas include advanced AI integration, blockchain applications, and next-generation user interfaces.`,
      relevanceScore: 0.78,
      type: "technology",
      url: "https://www.technologyreview.com",
      date: "May 2024"
    }
  ];
  
  // Generate analysis results with realistic metrics
  const analysis: AnalysisResult = {
    keyTrends: [
      `Integration of artificial intelligence and machine learning is transforming how ${query} solutions operate, with 78% of industry leaders reporting significant efficiency improvements.`,
      `Shift towards subscription-based models is accelerating, with SaaS adoption in the ${query} sector growing at 32% annually compared to traditional licensing models.`,
      `Cross-platform compatibility has become a critical differentiator, as users increasingly expect seamless experiences across devices and operating systems.`,
      `Privacy and data security have emerged as top priorities, with 85% of customers citing security features as a primary consideration in purchasing decisions.`,
      `Vertical-specific solutions are gaining traction over general-purpose offerings, with specialized ${query} products showing 40% higher adoption rates in enterprise contexts.`
    ],
    marketInsights: `The global ${query} market is experiencing robust growth driven by digital transformation initiatives across industries. Based on comprehensive analysis of market data, the sector is projected to reach $175 billion by 2028, representing a CAGR of 25.3%. North America currently holds the largest market share at 42%, followed by Europe (28%) and Asia-Pacific (23%), with the latter showing the highest growth rate. Key technological enablers include cloud infrastructure, AI/ML capabilities, and enhanced data analytics. Enterprise adoption is accelerating, with particular strength in financial services, healthcare, and retail verticals. The competitive landscape is evolving rapidly with established players expanding their offerings through strategic acquisitions and partnerships, while well-funded startups are introducing innovative capabilities that address emerging use cases.`,
    opportunities: [
      `Expansion into underserved mid-market segment, which represents a $45B growth opportunity with lower customer acquisition costs compared to enterprise.`,
      `Integration with emerging technologies like extended reality (XR) and edge computing to create differentiated offerings with 40% higher margins.`,
      `Geographic expansion into high-growth markets in Southeast Asia and Latin America, which are showing adoption rates 2.5x the global average.`,
      `Development of industry-specific solutions for regulated industries like healthcare and financial services, where specialized compliance features command premium pricing.`,
      `Strategic partnerships with complementary technology providers to create end-to-end solutions that address broader customer needs.`
    ],
    threats: [
      `Increasing competitive pressure from well-funded startups, with VC investment in competing solutions reaching $8.4B in 2023 alone.`,
      `Potential regulatory changes in data privacy and security could require significant product adaptations, with compliance costs estimated at 12-18% of revenue.`,
      `Rapid technological change may accelerate product obsolescence, requiring 30% higher R&D investment to maintain competitive parity.`,
      `Pricing pressure in maturing segments as solutions become commoditized, with average selling prices declining 7-10% annually in standardized offerings.`,
      `Talent acquisition challenges, with demand for specialized skills outpacing supply by 3:1, leading to increasing development costs.`
    ],
    recommendations: [
      {
        action: "Develop AI-enhanced capabilities focusing on predictive analytics and automation",
        priority: "high",
        rationale: "Market analysis shows 85% of customers prioritizing AI capabilities in purchasing decisions, with significant potential for differentiation and margin improvement."
      },
      {
        action: "Establish strategic partnerships with complementary technology providers",
        priority: "high",
        rationale: "Integrated solutions show 3.5x higher customer retention rates and create opportunities for cross-selling and upselling."
      },
      {
        action: "Expand into high-growth mid-market segment with tailored offering",
        priority: "medium",
        rationale: "Mid-market represents 40% of total addressable market with lower sales complexity and 30% faster deal cycles."
      },
      {
        action: "Develop vertical-specific solutions for healthcare and financial services",
        priority: "medium",
        rationale: "Specialized solutions command 25-35% price premiums and face less direct competition from horizontal players."
      },
      {
        action: "Invest in security and compliance capabilities",
        priority: "high",
        rationale: "Security concerns cited as primary adoption barrier by 62% of potential customers, representing significant competitive advantage if addressed effectively."
      }
    ],
    metrics: [
      {
        name: "Market Size",
        value: "$89.5B",
        change: "+25% YoY",
        trend: "up",
        description: "Current global market valuation with year-over-year growth rate"
      },
      {
        name: "CAGR",
        value: "25.3%",
        change: "+2.7% from previous forecast",
        trend: "up",
        description: "Compound Annual Growth Rate, 2023-2030 projection"
      },
      {
        name: "Customer Acquisition Cost",
        value: "$8,750",
        change: "-5% YoY",
        trend: "down",
        description: "Average cost to acquire new enterprise customer"
      },
      {
        name: "Retention Rate",
        value: "84%",
        change: "+3% YoY",
        trend: "up",
        description: "Annual customer retention rate across segments"
      },
      {
        name: "Investment Growth",
        value: "40%",
        change: "+12% from previous year",
        trend: "up",
        description: "Annual growth in VC/PE investment in the sector"
      }
    ],
    competitiveAnalysis: {
      keyPlayers: [
        "Industry Leader Inc.",
        "Innovative Technologies",
        "Global Solutions Group",
        "NextGen Systems",
        "Disruptive Startup"
      ],
      marketShare: {
        leader: "Industry Leader Inc. (28%) maintains dominant position through extensive platform capabilities and strong enterprise relationships",
        challengerSegment: "Innovative Technologies (17%) and Global Solutions Group (15%) lead the challenger group with specialized offerings and targeted market strategies"
      },
      competitiveAdvantages: [
        "Advanced AI and machine learning capabilities providing actionable insights and automation",
        "Enterprise-grade security and compliance features addressing regulatory requirements in multiple jurisdictions",
        "Scalable cloud infrastructure allowing seamless deployment across organization sizes",
        "Extensive ecosystem integrations with complementary technologies and platforms",
        "Industry-specific expertise and solutions tailored to vertical requirements"
      ],
      playerProfiles: [
        {
          name: "Industry Leader Inc.",
          description: "Established player with comprehensive platform approach and strong enterprise presence",
          strengths: ["Extensive feature set", "Global support infrastructure", "Brand recognition"],
          weaknesses: ["Premium pricing", "Complex implementation", "Slower innovation cycle"]
        },
        {
          name: "Innovative Technologies",
          description: "Technology-focused challenger with advanced AI capabilities and modern architecture",
          strengths: ["Cutting-edge technology", "Rapid innovation", "Strong developer ecosystem"],
          weaknesses: ["Limited enterprise experience", "Narrower feature set", "Scaling challenges"]
        },
        {
          name: "Global Solutions Group",
          description: "International player with strong presence in emerging markets and industry-specific expertise",
          strengths: ["Global reach", "Vertical specialization", "Competitive pricing"],
          weaknesses: ["Technology platform fragmentation", "Inconsistent customer support", "Integration challenges"]
        },
        {
          name: "Disruptive Startup",
          description: "Well-funded new entrant focusing on specific high-value use cases with innovative approach",
          strengths: ["Highly innovative", "User experience focus", "Agile development"],
          weaknesses: ["Limited market presence", "Incomplete feature set", "Scaling challenges"]
        }
      ]
    },
    executiveSummary: {
      marketSize: "$89.5B global market",
      growthRate: "25.3% CAGR through 2030",
      keyFinding: `The ${query} market is undergoing rapid transformation driven by AI integration, with the competitive landscape evolving as established players adapt to emerging technologies.`,
      investmentThesis: "Strong investment potential with multiple growth vectors in mid-market, vertical specialization, and geographic expansion, with manageable competitive risks."
    }
  };
  
  return { searchResults, analysis };
};

// Market Research Assistant component
type MarketResearchAssistantProps = {
  onBack: () => void;
};

export const MarketResearchAssistant: React.FC<MarketResearchAssistantProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ResearchResult[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'executive' | 'insights' | 'competitive' | 'sources' | 'agents'>('executive');
  const [error, setError] = useState<string | null>(null);
  const [researchProgress, setResearchProgress] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Suggested queries for inspiration
  const suggestedQueries = [
    "AI voice cloning market",
    "sustainable packaging industry trends",
    "electric vehicle battery technology",
    "telehealth software solutions",
    "blockchain in supply chain management",
    "cloud gaming market analysis",
    "plant-based food industry growth"
  ];

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
      setResearchProgress(prev => Math.min(prev + 15, 90));
    }, 800);
    
    try {
      const result = await searchAndAnalyzeMarket(query);
      clearInterval(progressInterval);
      setResearchProgress(100);
      
      setSearchResults(result.searchResults);
      setAnalysisResult(result.analysis);
      setActiveTab('executive');
      
      // Save search query for history
      if (!savedQueries.includes(query)) {
        setSavedQueries(prev => [query, ...prev].slice(0, 5));
      }
      
      setTimeout(() => setResearchProgress(0), 1000);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error in market research:', error);
      setError('Failed to complete market research. Please try again or refine your query.');
      setResearchProgress(0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
    // Submit the form programmatically
    const form = document.getElementById('search-form') as HTMLFormElement;
    if (form) form.requestSubmit();
  };

  const handleFilterChange = (filters: any) => {
    setSearchFilters(filters);
    // In a real implementation, you would re-fetch or filter results here
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

    const { executiveSummary, keyTrends, recommendations, metrics } = analysisResult;

    return (
      <div className="space-y-6">
        {/* Executive Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics?.slice(0, 4).map((metric, index) => (
            <div key={index} className={`rounded-lg p-4 ${
              metric.trend === 'up' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
              metric.trend === 'down' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
              'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 text-sm">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-gray-100 mt-1">{metric.change}</p>
                </div>
                {metric.trend === 'up' ? (
                  <TrendingUp size={24} className="text-green-200" />
                ) : metric.trend === 'down' ? (
                  <TrendingUp size={24} className="text-red-200 transform rotate-180" />
                ) : (
                  <BarChart2 size={24} className="text-blue-200" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Investment Thesis Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Investment Thesis
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Download size={16} />
              </button>
              <button className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-200">
                  Market Size
                </h4>
                <DollarSign size={16} className="text-blue-500" />
              </div>
              <p className="text-blue-800 dark:text-blue-300 text-lg font-semibold">
                {executiveSummary?.marketSize}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-green-900 dark:text-green-200">
                  Growth Rate
                </h4>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <p className="text-green-800 dark:text-green-300 text-lg font-semibold">
                {executiveSummary?.growthRate}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-purple-900 dark:text-purple-200">
                  Investment Rating
                </h4>
                <Star size={16} className="text-purple-500" />
              </div>
              <p className="text-purple-800 dark:text-purple-300 text-lg font-semibold">
                Strong Positive
              </p>
            </div>
          </div>
          
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 dark:text-indigo-200 mb-2">
              Key Finding
            </h4>
            <p className="text-indigo-800 dark:text-indigo-300 text-sm">
              {executiveSummary?.keyFinding}
            </p>
          </div>
          
          <div className="mt-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
            <h4 className="font-medium text-teal-900 dark:text-teal-200 mb-2">
              Investment Thesis
            </h4>
            <p className="text-teal-800 dark:text-teal-300 text-sm">
              {executiveSummary?.investmentThesis}
            </p>
          </div>
        </div>

        {/* Key Insights Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Key Market Insights
          </h3>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            <MarkdownText content={analysisResult.marketInsights} />
          </div>
          
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            Market Trends Highlights
          </h4>
          <div className="space-y-3 mb-6">
            {keyTrends.slice(0, 3).map((trend, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                  <span className="text-teal-700 dark:text-teal-300 text-xs font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  <MarkdownText content={trend} />
                </p>
              </div>
            ))}
            {keyTrends.length > 3 && (
              <button className="text-sm text-teal-600 dark:text-teal-400 font-medium flex items-center mt-2 hover:underline" onClick={() => setActiveTab('insights')}>
                View all trends <ArrowUpRight size={14} className="ml-1" />
              </button>
            )}
          </div>
          
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            Top Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((rec, index) => {
              const style = getPriorityStyle(rec.priority);
              return (
                <div key={index} className={`${style.bg} ${style.border} border rounded-lg p-4`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`${style.badge} px-2 py-1 rounded text-xs font-medium`}>
                      {rec.priority.toUpperCase()}
                    </span>
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
          {recommendations.length > 2 && (
            <button className="text-sm text-teal-600 dark:text-teal-400 font-medium flex items-center mt-4 hover:underline" onClick={() => setActiveTab('insights')}>
              View all recommendations <ArrowUpRight size={14} className="ml-1" />
            </button>
          )}
        </div>

        {/* Quick Competitive Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Competitive Landscape Summary
            </h3>
            <button className="text-sm text-teal-600 dark:text-teal-400 font-medium flex items-center hover:underline" onClick={() => setActiveTab('competitive')}>
              Full analysis <ArrowUpRight size={14} className="ml-1" />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                Key Players
              </h4>
              <div className="space-y-2">
                {analysisResult.competitiveAnalysis.keyPlayers.slice(0, 4).map((player, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{player}</span>
                    {index === 0 && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full ml-auto">
                        Leader
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                Competitive Advantages
              </h4>
              <div className="space-y-2">
                {analysisResult.competitiveAnalysis.competitiveAdvantages.slice(0, 3).map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
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
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <MarkdownText content={opportunity} />
                  </div>
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
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <MarkdownText content={threat} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <BarChart className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Market Metrics</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResult.metrics?.map((metric, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.name}</h4>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : metric.trend === 'down' ? (
                    <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                  ) : (
                    <BarChart2 className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                <p className={`text-xs mt-1 ${
                  metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  metric.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {metric.change}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{metric.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Market Insights</h4>
            <div className="text-blue-800 dark:text-blue-300 text-sm">
              <MarkdownText content={analysisResult.marketInsights} />
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
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    <MarkdownText content={trend} />
                  </div>
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
        {/* Player Profiles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Player Profiles</h3>
            </div>
            <button className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Download size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitiveAnalysis.playerProfiles?.map((player, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {player.name}
                  </h4>
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{player.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Strengths</h5>
                    <div className="space-y-1">
                      {player.strengths.map((strength, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-xs">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Weaknesses</h5>
                    <div className="space-y-1">
                      {player.weaknesses.map((weakness, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300 text-xs">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Share Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Share Analysis</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="h-48 w-48 rounded-full relative">
                  {/* Simulated pie chart segments */}
                  <div className="absolute inset-0 border-8 border-yellow-500 rounded-full clip-path-segment-50"></div>
                  <div className="absolute inset-0 border-8 border-blue-500 rounded-full clip-path-segment-25" style={{clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)'}}></div>
                  <div className="absolute inset-0 border-8 border-green-500 rounded-full clip-path-segment-15" style={{clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 70%)'}}></div>
                  <div className="absolute inset-0 border-8 border-purple-500 rounded-full clip-path-segment-10" style={{clipPath: 'polygon(50% 50%, 0 70%, 0 0%, 20% 0%)'}}></div>
                  <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 h-32 w-32 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Market Share</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {competitiveAnalysis.keyPlayers.slice(0, 4).map((player, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      idx === 0 ? 'bg-yellow-500' : 
                      idx === 1 ? 'bg-blue-500' : 
                      idx === 2 ? 'bg-green-500' : 
                      'bg-purple-500'
                    }`}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{player}</span>
                    <span className="ml-auto text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {idx === 0 ? '28%' : idx === 1 ? '17%' : idx === 2 ? '15%' : '10%'}
                    </span>
                  </div>
                ))}
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Others</span>
                  <span className="ml-auto text-xs font-semibold text-gray-700 dark:text-gray-300">30%</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Market Leadership</h4>
                <div className="text-blue-800 dark:text-blue-300 text-sm">
                  <MarkdownText content={competitiveAnalysis.marketShare.leader} />
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-2">Challenger Segment</h4>
                <div className="text-purple-800 dark:text-purple-300 text-sm">
                  <MarkdownText content={competitiveAnalysis.marketShare.challengerSegment} />
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Market Dynamics</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  The competitive landscape is evolving with established players facing increasing pressure from innovative challengers. Consolidation through strategic acquisitions is expected to continue as companies seek to expand capabilities and market reach.
                </p>
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
                <div className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
                  <MarkdownText content={advantage} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Entry Barriers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Market Entry Barriers</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Technological Complexity</h4>
                <p className="text-red-700 dark:text-red-400 text-sm">Significant investment required in R&D and specialized engineering talent to develop competitive solutions.</p>
              </div>
              <div className="w-16 h-4 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Established Partnerships</h4>
                <p className="text-red-700 dark:text-red-400 text-sm">Market leaders have secured strategic partnerships with key distribution channels and complementary technology providers.</p>
              </div>
              <div className="w-16 h-4 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Brand Recognition</h4>
                <p className="text-red-700 dark:text-red-400 text-sm">Strong customer loyalty to established brands creates significant customer acquisition costs for new entrants.</p>
              </div>
              <div className="w-16 h-4 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Regulatory Compliance</h4>
                <p className="text-red-700 dark:text-red-400 text-sm">Complex compliance requirements in regulated industries create high barriers to entry, particularly in financial services and healthcare.</p>
              </div>
              <div className="w-16 h-4 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSourcesAnalysis = () => {
    if (!searchResults) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Research Sources</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-2.5 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter size={14} className="mr-1.5" />
                Filter
                <ChevronDown size={14} className="ml-1.5" />
              </button>
              <button className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Download size={16} />
              </button>
            </div>
          </div>
          
          <SearchFilters 
            onFilterChange={handleFilterChange}
            isVisible={showFilters}
          />
          
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        {result.title}
                      </a>
                    </h4>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{result.source}</span>
                      {result.date && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{result.date}</span>
                        </>
                      )}
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        result.type === 'market_data' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        result.type === 'competitive' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        result.type === 'audience' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        result.type === 'funding' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {result.type === 'market_data' ? 'Market Data' :
                         result.type === 'competitive' ? 'Competitive' :
                         result.type === 'audience' ? 'Audience' :
                         result.type === 'funding' ? 'Investment' :
                         result.type === 'regulatory' ? 'Regulatory' :
                         result.type === 'strategic' ? 'Strategic' :
                         result.type === 'technology' ? 'Technology' :
                         result.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <button className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                      <Bookmark size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{result.summary}</p>
                
                <div className="flex flex-wrap items-center mt-2">
                  <div className="mr-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mr-2">
                      <div className="h-full bg-blue-500" style={{ width: `${result.relevanceScore * 100}%` }}></div>
                    </div>
                    <span>{Math.round(result.relevanceScore * 100)}% Relevance</span>
                  </div>
                  {result.url && (
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center"
                    >
                      View Source <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
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
            <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-teal-200 dark:border-teal-800 rounded-full"></div>
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
              { name: 'Web Search', icon: Search, color: 'text-blue-500', status: researchProgress > 15 ? 'complete' : researchProgress > 0 ? 'active' : 'pending' },
              { name: 'Trends', icon: TrendingUp, color: 'text-purple-500', status: researchProgress > 45 ? 'complete' : researchProgress > 30 ? 'active' : 'pending' },
              { name: 'Competitive', icon: Shield, color: 'text-green-500', status: researchProgress > 60 ? 'complete' : researchProgress > 45 ? 'active' : 'pending' },
              { name: 'Audience', icon: Users, color: 'text-amber-500', status: researchProgress > 75 ? 'complete' : researchProgress > 60 ? 'active' : 'pending' },
              { name: 'Strategic', icon: Brain, color: 'text-red-500', status: researchProgress > 90 ? 'complete' : researchProgress > 75 ? 'active' : 'pending' }
            ].map((agent) => (
              <div key={agent.name} className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-full ${
                  agent.status === 'complete' ? 'bg-green-100 dark:bg-green-900/30' : 
                  agent.status === 'active' ? 'bg-gray-100 dark:bg-gray-700 animate-pulse' :
                  'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <agent.icon size={20} className={
                    agent.status === 'complete' ? 'text-green-500' : agent.color
                  } />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {agent.status === 'complete' ? 'Complete' : 
                   agent.status === 'active' ? 'Processing...' : 
                   'Waiting...'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center max-w-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Our AI research agents are analyzing data from multiple sources to generate comprehensive insights.
              This process typically takes 25-40 seconds to complete.
            </p>
          </div>
        </div>
      );
    }

    if (!searchResults && !analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-8">
            <Brain size={64} className="text-teal-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Market Research Intelligence Platform
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Enter a market segment, industry, technology, or company to begin comprehensive multi-agent analysis
            </p>
          </div>
          
          {/* Recent searches */}
          {savedQueries.length > 0 && (
            <div className="w-full max-w-2xl mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {savedQueries.map((savedQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuery(savedQuery)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {savedQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggested queries */}
          <div className="w-full max-w-2xl mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Trending Research Topics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {suggestedQueries.map((suggestedQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuery(suggestedQuery)}
                  className="flex items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 dark:hover:border-teal-500 transition-colors group text-left"
                >
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mr-3 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                    <TrendingUp size={16} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {suggestedQuery}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            {[
              { icon: TrendingUp, title: 'Market Trends', desc: 'Identify emerging patterns and growth drivers' },
              { icon: Shield, title: 'Competitive Intel', desc: 'Analyze market leaders and competitive advantages' },
              { icon: Users, title: 'Audience Insights', desc: 'Understand customer segments and behavior' }
            ].map((feature, index) => (
              <div key={index} className="text-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={24} className="text-teal-600 dark:text-teal-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">{feature.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Tutorial Button */}
          <button
            onClick={() => setShowTutorial(true)}
            className="mt-8 flex items-center text-sm text-teal-600 dark:text-teal-400 hover:underline"
          >
            <Lightbulb size={16} className="mr-1.5" />
            How to get the most from Market Research Assistant
          </button>
          
          {/* Tutorial Overlay */}
          {showTutorial && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Getting Started Guide</h3>
                  <button 
                    onClick={() => setShowTutorial(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">1. Formulate Specific Queries</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      For the best results, be specific in your search queries. Instead of "AI market", try "AI voice synthesis market size and growth trends".
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">2. Explore Different Tabs</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Use different tabs to explore various aspects of your market research:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• <strong>Executive Summary</strong>: Quick overview with key metrics and findings</li>
                      <li>• <strong>Market Insights</strong>: Detailed trends, opportunities and threats</li>
                      <li>• <strong>Competitive Analysis</strong>: Key players and market positioning</li>
                      <li>• <strong>Sources</strong>: See and filter the underlying research sources</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">3. Filtering Research Sources</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Use the filters in the Sources tab to narrow down results by source type, date range, and relevance.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">4. Understanding AI Analysis</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Our AI uses multiple specialized agents to analyze different aspects of the market:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>• <strong>Trends Agent</strong>: Identifies market patterns and growth indicators</li>
                      <li>• <strong>Competitive Agent</strong>: Analyzes market players and competitive dynamics</li>
                      <li>• <strong>Audience Agent</strong>: Studies customer segments and behaviors</li>
                      <li>• <strong>Strategic Agent</strong>: Synthesizes insights for actionable recommendations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">5. Actionable Recommendations</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Pay special attention to the strategic recommendations section, which provides prioritized action items based on the comprehensive market analysis.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                  <button 
                    onClick={() => setShowTutorial(false)}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Added this function to render the Star icon
  const Star = (props: any) => {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
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
          <form id="search-form" onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., AI voice cloning market, sustainable packaging trends, EV battery technology..."
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
            <div className="flex overflow-x-auto">
              {[
                { id: 'executive', label: 'Executive Summary', icon: Building },
                { id: 'insights', label: 'Market Insights', icon: BarChart },
                { id: 'competitive', label: 'Competitive Analysis', icon: Shield },
                { id: 'sources', label: 'Research Sources', icon: FileText }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${
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
          {activeTab === 'sources' && renderSourcesAnalysis()}
        </div>
      </div>
    </div>
  );
};