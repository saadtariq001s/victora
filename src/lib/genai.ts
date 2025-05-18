import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import * as cheerio from 'cheerio';

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyBg3Hip1lHjGdquwPUeLyR0Mhr9gTn17-g");

// Store conversation history for different tools
let mentorHistory: Array<{ role: 'user' | 'model'; parts: string }> = [];
const cofounderHistories: Record<string, Array<{ role: 'user' | 'model'; parts: string }>> = {
  analytical: [],
  visionary: [],
  pragmatic: [],
  devil: []
};

// Market Research System with Multiple Agents
class MarketResearchCrew {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  // Web Search Agent
  async webSearchAgent(query: string): Promise<any[]> {
    try {
      // In a real implementation, you'd use APIs like:
      // - Google Custom Search API
      // - Serper API
      // - Brave Search API
      // For demo purposes, we'll search some key sources directly

      const searchResults = [];
      
      // Search multiple sources
      const sources = [
        { url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(query)}`, type: 'trends' },
        { url: `https://www.statista.com/search/${encodeURIComponent(query)}`, type: 'market_data' },
        { url: `https://www.crunchbase.com/search/organizations/${encodeURIComponent(query)}`, type: 'companies' }
      ];

      // Simulate web search results (in production, use real APIs)
      const mockResults = [
        {
          title: `Market Analysis: ${query} - Industry Growth Report`,
          url: "https://industry-analysis.com/reports/2024",
          snippet: "Comprehensive market analysis showing 25% YoY growth in the sector with emerging trends in digital transformation and sustainability initiatives.",
          source: "Industry Analysis Reports",
          relevance: 0.95,
          type: "market_data"
        },
        {
          title: `${query} Competitive Landscape 2024`,
          url: "https://competitive-intel.com/analysis",
          snippet: "Leading companies in the space include major players focusing on innovation and market expansion through strategic partnerships.",
          source: "Competitive Intelligence",
          relevance: 0.92,
          type: "competitive"
        },
        {
          title: `Consumer Trends in ${query} Market`,
          url: "https://consumer-insights.com/trends",
          snippet: "Consumer behavior analysis reveals increasing demand for personalized solutions and sustainable options in the market.",
          source: "Consumer Insights",
          relevance: 0.88,
          type: "audience"
        },
        {
          title: `Investment Flows in ${query} Sector`,
          url: "https://funding-tracker.com/sectors",
          snippet: "VC funding increased by 40% last quarter with focus on AI-driven solutions and scalable technologies.",
          source: "Funding Tracker",
          relevance: 0.85,
          type: "funding"
        }
      ];

      return mockResults;
    } catch (error) {
      console.error('Web search error:', error);
      return [];
    }
  }

  // Market Trends Agent
  async marketTrendsAgent(searchResults: any[], query: string): Promise<any> {
    const prompt = `You are a Market Trends Analyst. Analyze the following search results and extract key market trends for "${query}".

Search Results:
${searchResults.map(r => `Title: ${r.title}\nSource: ${r.source}\nSnippet: ${r.snippet}\n`).join('\n')}

Provide analysis in this format:
TRENDING_TOPICS:
- [Trend 1]: [Description]
- [Trend 2]: [Description]
- [Trend 3]: [Description]

MARKET_DRIVERS:
- [Driver 1]: [Impact description]
- [Driver 2]: [Impact description]
- [Driver 3]: [Impact description]

EMERGING_TECHNOLOGIES:
- [Technology 1]: [Application and potential]
- [Technology 2]: [Application and potential]

GROWTH_METRICS:
- Market Size: [Estimate]
- Growth Rate: [Percentage]
- Key Segments: [List]

REGIONAL_TRENDS:
- North America: [Trend description]
- Europe: [Trend description]
- Asia-Pacific: [Trend description]`;

    try {
      const result = await this.model.generateContent(prompt);
      return this.parseTrendsAnalysis(result.response.text());
    } catch (error) {
      console.error('Market trends analysis error:', error);
      return this.getFallbackTrends(query);
    }
  }

  // Competitive Intelligence Agent
  async competitiveAgent(searchResults: any[], query: string): Promise<any> {
    const prompt = `You are a Competitive Intelligence Analyst. Analyze the competitive landscape for "${query}" based on the search results.

Search Results:
${searchResults.filter(r => r.type === 'competitive' || r.type === 'companies').map(r => 
  `Title: ${r.title}\nSource: ${r.source}\nSnippet: ${r.snippet}\n`).join('\n')}

Provide analysis in this format:
KEY_COMPETITORS:
- [Company 1]: [Market position, strengths, strategy]
- [Company 2]: [Market position, strengths, strategy]
- [Company 3]: [Market position, strengths, strategy]
- [Company 4]: [Market position, strengths, strategy]

MARKET_SHARE:
- Leader: [Company] ([Percentage]%)
- Challenger: [Company] ([Percentage]%)
- Niche Players: [List]

COMPETITIVE_STRATEGIES:
- [Strategy 1]: [Which companies, effectiveness]
- [Strategy 2]: [Which companies, effectiveness]
- [Strategy 3]: [Which companies, effectiveness]

COMPETITIVE_ADVANTAGES:
- Technology: [Leader and description]
- Brand: [Leader and description]
- Distribution: [Leader and description]
- Cost: [Leader and description]

MARKET_GAPS:
- [Gap 1]: [Opportunity description]
- [Gap 2]: [Opportunity description]
- [Gap 3]: [Opportunity description]`;

    try {
      const result = await this.model.generateContent(prompt);
      return this.parseCompetitiveAnalysis(result.response.text());
    } catch (error) {
      console.error('Competitive analysis error:', error);
      return this.getFallbackCompetitive(query);
    }
  }

  // Audience Analysis Agent
  async audienceAgent(searchResults: any[], query: string): Promise<any> {
    const prompt = `You are an Audience Research Analyst. Analyze customer segments, demographics, and behavior patterns for "${query}".

Search Results:
${searchResults.filter(r => r.type === 'audience' || r.snippet.includes('consumer')).map(r => 
  `Title: ${r.title}\nSource: ${r.source}\nSnippet: ${r.snippet}\n`).join('\n')}

Provide analysis in this format:
TARGET_SEGMENTS:
- [Segment 1]: [Demographics, size, characteristics]
- [Segment 2]: [Demographics, size, characteristics]
- [Segment 3]: [Demographics, size, characteristics]

CUSTOMER_PERSONAS:
- [Persona 1]: [Age, income, needs, pain points]
- [Persona 2]: [Age, income, needs, pain points]
- [Persona 3]: [Age, income, needs, pain points]

BEHAVIORAL_PATTERNS:
- Purchase Behavior: [Description]
- Digital Engagement: [Channels, preferences]
- Decision Factors: [Key influencers]

DEMOGRAPHICS:
- Age Distribution: [Breakdown]
- Income Levels: [Ranges]
- Geographic: [Primary markets]
- Psychographics: [Values, lifestyle]

UNMET_NEEDS:
- [Need 1]: [Description and market size]
- [Need 2]: [Description and market size]
- [Need 3]: [Description and market size]`;

    try {
      const result = await this.model.generateContent(prompt);
      return this.parseAudienceAnalysis(result.response.text());
    } catch (error) {
      console.error('Audience analysis error:', error);
      return this.getFallbackAudience(query);
    }
  }

  // Strategic Insights Agent
  async strategicInsightsAgent(trends: any, competitive: any, audience: any, query: string): Promise<any> {
    const prompt = `You are a Strategic Business Analyst. Synthesize insights from market trends, competitive analysis, and audience research for "${query}".

Market Trends Summary:
${JSON.stringify(trends, null, 2)}

Competitive Analysis Summary:
${JSON.stringify(competitive, null, 2)}

Audience Analysis Summary:
${JSON.stringify(audience, null, 2)}

Provide strategic recommendations in this format:
STRATEGIC_OPPORTUNITIES:
- [Opportunity 1]: [Description, market potential, timeline]
- [Opportunity 2]: [Description, market potential, timeline]
- [Opportunity 3]: [Description, market potential, timeline]

STRATEGIC_THREATS:
- [Threat 1]: [Description, probability, impact]
- [Threat 2]: [Description, probability, impact]
- [Threat 3]: [Description, probability, impact]

MARKET_ENTRY_STRATEGY:
- Target Segment: [Primary segment to focus on]
- Value Proposition: [Key differentiator]
- Go-to-Market: [Approach and channels]
- Competitive Positioning: [How to compete]

INVESTMENT_PRIORITIES:
- High Priority: [Area requiring immediate investment]
- Medium Priority: [Area for medium-term investment]
- Low Priority: [Area for future consideration]

KEY_SUCCESS_FACTORS:
- [Factor 1]: [Why it's critical]
- [Factor 2]: [Why it's critical]
- [Factor 3]: [Why it's critical]

ACTIONABLE_RECOMMENDATIONS:
1. [Immediate Action]: [Timeline, resources needed]
2. [Short-term Action]: [Timeline, resources needed]
3. [Long-term Action]: [Timeline, resources needed]`;

    try {
      const result = await this.model.generateContent(prompt);
      return this.parseStrategicInsights(result.response.text());
    } catch (error) {
      console.error('Strategic insights error:', error);
      return this.getFallbackStrategic(query);
    }
  }

  // Main orchestration method
  async executeMarketResearch(query: string): Promise<any> {
    try {
      console.log(`Starting comprehensive market research for: ${query}`);
      
      // Step 1: Web Search Agent gathers data
      console.log('🔍 Web Search Agent: Gathering market data...');
      const searchResults = await this.webSearchAgent(query);
      
      // Step 2: Run specialized agents in parallel
      console.log('👥 Running specialized agents...');
      const [trends, competitive, audience] = await Promise.all([
        this.marketTrendsAgent(searchResults, query),
        this.competitiveAgent(searchResults, query),
        this.audienceAgent(searchResults, query)
      ]);
      
      // Step 3: Strategic Insights Agent synthesizes everything
      console.log('🧠 Strategic Insights Agent: Synthesizing findings...');
      const strategic = await this.strategicInsightsAgent(trends, competitive, audience, query);
      
      // Compile final research report
      const researchReport = {
        query,
        searchResults: searchResults.slice(0, 5), // Top 5 sources
        analysis: {
          marketTrends: trends,
          competitiveIntelligence: competitive,
          audienceAnalysis: audience,
          strategicInsights: strategic
        },
        metadata: {
          timestamp: new Date().toISOString(),
          sources: searchResults.length,
          agentsUsed: 4
        }
      };
      
      console.log('✅ Market research complete!');
      return researchReport;
    } catch (error) {
      console.error('Market research execution error:', error);
      throw error;
    }
  }

  // Parsing methods
  private parseTrendsAnalysis(text: string): any {
    try {
      const trending = this.extractSection(text, 'TRENDING_TOPICS');
      const drivers = this.extractSection(text, 'MARKET_DRIVERS');
      const tech = this.extractSection(text, 'EMERGING_TECHNOLOGIES');
      const growth = this.extractSection(text, 'GROWTH_METRICS');
      const regional = this.extractSection(text, 'REGIONAL_TRENDS');

      return {
        trendingTopics: trending,
        marketDrivers: drivers,
        emergingTechnologies: tech,
        growthMetrics: growth,
        regionalTrends: regional
      };
    } catch (error) {
      return this.getFallbackTrends("");
    }
  }

  private parseCompetitiveAnalysis(text: string): any {
    try {
      return {
        keyCompetitors: this.extractSection(text, 'KEY_COMPETITORS'),
        marketShare: this.extractSection(text, 'MARKET_SHARE'),
        competitiveStrategies: this.extractSection(text, 'COMPETITIVE_STRATEGIES'),
        competitiveAdvantages: this.extractSection(text, 'COMPETITIVE_ADVANTAGES'),
        marketGaps: this.extractSection(text, 'MARKET_GAPS')
      };
    } catch (error) {
      return this.getFallbackCompetitive("");
    }
  }

  private parseAudienceAnalysis(text: string): any {
    try {
      return {
        targetSegments: this.extractSection(text, 'TARGET_SEGMENTS'),
        customerPersonas: this.extractSection(text, 'CUSTOMER_PERSONAS'),
        behavioralPatterns: this.extractSection(text, 'BEHAVIORAL_PATTERNS'),
        demographics: this.extractSection(text, 'DEMOGRAPHICS'),
        unmetNeeds: this.extractSection(text, 'UNMET_NEEDS')
      };
    } catch (error) {
      return this.getFallbackAudience("");
    }
  }

  private parseStrategicInsights(text: string): any {
    try {
      return {
        opportunities: this.extractSection(text, 'STRATEGIC_OPPORTUNITIES'),
        threats: this.extractSection(text, 'STRATEGIC_THREATS'),
        marketEntryStrategy: this.extractSection(text, 'MARKET_ENTRY_STRATEGY'),
        investmentPriorities: this.extractSection(text, 'INVESTMENT_PRIORITIES'),
        keySuccessFactors: this.extractSection(text, 'KEY_SUCCESS_FACTORS'),
        actionableRecommendations: this.extractListItems(text, 'ACTIONABLE_RECOMMENDATIONS')
      };
    } catch (error) {
      return this.getFallbackStrategic("");
    }
  }

  private extractSection(text: string, sectionName: string): any {
    const regex = new RegExp(`${sectionName}:\\s*(.*?)(?=\\n[A-Z_]+:|$)`, 's');
    const match = text.match(regex);
    if (!match) return {};

    const content = match[1].trim();
    const lines = content.split('\n').filter(line => line.trim());
    const result: any = {};

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const parsed = trimmed.substring(2);
        const [key, ...valueParts] = parsed.split(':');
        if (key && valueParts.length > 0) {
          result[key.trim()] = valueParts.join(':').trim();
        }
      }
    });

    return result;
  }

  private extractListItems(text: string, sectionName: string): string[] {
    const regex = new RegExp(`${sectionName}:\\s*(.*?)(?=\\n[A-Z_]+:|$)`, 's');
    const match = text.match(regex);
    if (!match) return [];

    const content = match[1].trim();
    return content.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(item => item);
  }

  // Fallback methods
  private getFallbackTrends(query: string): any {
    return {
      trendingTopics: {
        "Digital Transformation": "Accelerating adoption of digital technologies across industries",
        "Sustainability Focus": "Increasing emphasis on environmental and social responsibility",
        "AI Integration": "Growing integration of artificial intelligence in business processes"
      },
      marketDrivers: {
        "Technology Innovation": "Rapid advancement in core technologies driving market growth",
        "Consumer Behavior": "Changing consumer preferences and expectations",
        "Regulatory Environment": "Evolving regulations creating new opportunities and challenges"
      },
      emergingTechnologies: {
        "Artificial Intelligence": "Machine learning and AI transforming industry operations",
        "Cloud Computing": "Scalable cloud solutions enabling business agility"
      },
      growthMetrics: {
        "Market Size": "Estimated at $XX billion",
        "Growth Rate": "20-25% CAGR",
        "Key Segments": "Enterprise, SMB, Consumer"
      },
      regionalTrends: {
        "North America": "Leading in technology adoption and innovation",
        "Europe": "Focus on regulatory compliance and sustainability",
        "Asia-Pacific": "Rapid growth driven by digital transformation"
      }
    };
  }

  private getFallbackCompetitive(query: string): any {
    return {
      keyCompetitors: {
        "Market Leader Corp": "Dominant market position with 35% share, strong brand recognition",
        "Innovation Inc": "Technology leader with cutting-edge solutions, 18% market share",
        "Global Systems": "Extensive international presence, focus on enterprise segment",
        "Startup Disruptor": "Agile new entrant with innovative approach"
      },
      marketShare: {
        "Leader": "Market Leader Corp (35%)",
        "Challenger": "Innovation Inc (18%)",
        "Niche Players": "Multiple specialized providers"
      },
      competitiveStrategies: {
        "Innovation": "Focus on R&D and product development",
        "Cost Leadership": "Operational efficiency and economies of scale",
        "Differentiation": "Unique value propositions and customer experience"
      },
      competitiveAdvantages: {
        "Technology": "Advanced AI and machine learning capabilities",
        "Brand": "Strong customer loyalty and market recognition",
        "Distribution": "Extensive partner networks and channels",
        "Cost": "Efficient operations and competitive pricing"
      },
      marketGaps: {
        "SMB Solutions": "Underserved small and medium business segment",
        "Integration": "Need for better system integration capabilities",
        "Personalization": "Demand for more customized solutions"
      }
    };
  }

  private getFallbackAudience(query: string): any {
    return {
      targetSegments: {
        "Enterprise": "Large organizations with complex needs, budget >$1M",
        "Mid-Market": "Growing companies, budget $100K-$1M",
        "SMB": "Small businesses, budget <$100K"
      },
      customerPersonas: {
        "Enterprise Executive": "C-level, 45-55 years, strategic focus",
        "Technology Manager": "30-45 years, implementation focus",
        "Small Business Owner": "35-50 years, cost-conscious, efficiency focused"
      },
      behavioralPatterns: {
        "Purchase Behavior": "Research-heavy, committee-based decisions",
        "Digital Engagement": "Multi-channel, mobile-first",
        "Decision Factors": "ROI, security, scalability, support"
      },
      demographics: {
        "Age Distribution": "25-55 years (primary), 30-45 (core)",
        "Income Levels": "Varies by segment",
        "Geographic": "Global with focus on developed markets",
        "Psychographics": "Innovation-oriented, efficiency-focused"
      },
      unmetNeeds: {
        "Ease of Use": "Simpler interfaces and user experience",
        "Integration": "Better integration with existing systems",
        "Customization": "More flexible and customizable solutions"
      }
    };
  }

  private getFallbackStrategic(query: string): any {
    return {
      opportunities: {
        "Digital Transformation": "Growing demand for digital solutions across industries",
        "SMB Market": "Underserved small business segment with high growth potential",
        "International Expansion": "Emerging markets with increasing adoption"
      },
      threats: {
        "Intense Competition": "Well-funded competitors with significant resources",
        "Technology Disruption": "Rapid pace of technological change",
        "Economic Uncertainty": "Market volatility affecting customer spending"
      },
      marketEntryStrategy: {
        "Target Segment": "Mid-market companies seeking digital transformation",
        "Value Proposition": "Cost-effective, easy-to-implement solutions",
        "Go-to-Market": "Partner-focused distribution strategy",
        "Competitive Positioning": "Agile alternative to enterprise solutions"
      },
      investmentPriorities: {
        "High Priority": "Product development and technology innovation",
        "Medium Priority": "Market expansion and customer acquisition",
        "Low Priority": "Infrastructure and operational optimization"
      },
      keySuccessFactors: {
        "Product-Market Fit": "Strong alignment with customer needs",
        "Execution Speed": "Rapid development and deployment",
        "Customer Success": "Strong support and customer satisfaction"
      },
      actionableRecommendations: [
        "Develop minimum viable product for target segment",
        "Establish strategic partnerships for market entry",
        "Invest in customer success and support capabilities"
      ]
    };
  }
}

// Export the main market research function
export const searchAndAnalyzeMarket = async (query: string): Promise<any> => {
  const crew = new MarketResearchCrew();
  
  try {
    const research = await crew.executeMarketResearch(query);
    
    // Transform the research into the expected format for the frontend
    return {
      searchResults: research.searchResults.map((result: any) => ({
        title: result.title,
        source: result.source,
        summary: result.snippet,
        relevanceScore: result.relevance || 0.8
      })),
      analysis: {
        keyTrends: Object.values(research.analysis.marketTrends.trendingTopics || {}),
        marketInsights: `Based on comprehensive analysis of ${research.metadata.sources} sources, the ${query} market shows strong growth potential. ${Object.values(research.analysis.marketTrends.marketDrivers || {})[0] || 'Key drivers include technology innovation and changing consumer behavior.'}`,
        opportunities: Object.values(research.analysis.strategicInsights.opportunities || {}),
        threats: Object.values(research.analysis.strategicInsights.threats || {}),
        recommendations: research.analysis.strategicInsights.actionableRecommendations.map((rec: string, index: number) => ({
          action: rec,
          priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
          rationale: "Based on multi-agent market analysis and competitive research"
        }))
      },
      competitiveAnalysis: {
        keyPlayers: Object.keys(research.analysis.competitiveIntelligence.keyCompetitors || {}),
        marketShare: {
          leader: Object.values(research.analysis.competitiveIntelligence.marketShare || {})[0] || "Market leader identified through analysis",
          challengerSegment: Object.values(research.analysis.competitiveIntelligence.marketShare || {})[1] || "Challenger segment analysis"
        },
        competitiveAdvantages: Object.values(research.analysis.competitiveIntelligence.competitiveAdvantages || {})
      },
      agentInsights: {
        trends: research.analysis.marketTrends,
        competitive: research.analysis.competitiveIntelligence,
        audience: research.analysis.audienceAnalysis,
        strategic: research.analysis.strategicInsights
      }
    };
  } catch (error) {
    console.error('Market research error:', error);
    throw error;
  }
};

// AI Mentor Bot Implementation (keeping existing code)
export const mentorChat = async (message: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `You are an expert AI mentor and learning assistant with deep expertise in technology, business, science, and personal development.

Your role is to:
- Provide clear, actionable guidance tailored to the user's learning level
- Break down complex concepts into digestible explanations
- Offer practical examples and real-world applications
- Encourage critical thinking and problem-solving
- Adapt your communication style to match the user's expertise level
- Provide step-by-step guidance when needed
- Share relevant resources and best practices

Guidelines:
- Keep responses concise but comprehensive
- Focus on practical value and actionable insights
- Always encourage the user's growth mindset and learning journey
- Use examples to illustrate complex concepts
- Ask follow-up questions to guide deeper learning

Please respond to the user's message in a helpful and mentoring way.`;

    // Add user message to history
    mentorHistory.push({ role: 'user', parts: message });
    
    // Create prompt with context
    const prompt = `${systemPrompt}\n\nConversation history:\n${formatHistory(mentorHistory)}`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Add assistant response to history
    mentorHistory.push({ role: 'model', parts: response });
    
    // Keep only last 10 exchanges (20 messages)
    if (mentorHistory.length > 20) {
      mentorHistory = mentorHistory.slice(-20);
    }
    
    return response;
  } catch (error) {
    console.error('Error in mentor chat:', error);
    
    // Provide a helpful fallback response
    return "I apologize, but I'm having trouble processing your request right now. This might be due to a temporary issue with the AI service. Please try rephrasing your question or try again in a moment. \n\nIn the meantime, I encourage you to: \n1. Break down your challenge into smaller, specific questions \n2. Consider what resources or approaches you've already tried \n3. Think about what specific outcome you're hoping to achieve \n\nI'm here to help you learn and grow, so please don't hesitate to try again!";
  }
};

// Co-Founder Simulator Implementation (keeping existing code)
export const simulateCofounder = async (
  message: string, 
  style: 'analytical' | 'visionary' | 'pragmatic' | 'devil',
  scenario: string
): Promise<{
  response: string;
  reasoning: string;
  nextSteps?: string[];
  dataPoints?: string[];
  risks?: string[];
  opportunities?: string[];
}> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompts = {
      analytical: `You are an analytical co-founder with a data-driven mindset. Your personality:
- Focus on metrics, KPIs, and quantifiable outcomes
- Reference specific data points and statistical insights
- Approach decisions through rigorous analysis
- Question assumptions with evidence
- Prioritize ROI and measurable results
- Think systematically about cause and effect

Always support your points with data or logical frameworks. Provide your response in this format:

RESPONSE:
[Your main response to the co-founder]

REASONING:
[Explain your analytical thinking process]

DATA POINTS:
- [Relevant metric or data point 1]
- [Relevant metric or data point 2]
- [Relevant metric or data point 3]

NEXT STEPS:
- [Actionable step 1]
- [Actionable step 2]`,

      visionary: `You are a visionary co-founder who inspires through big-picture thinking. Your personality:
- Focus on transformative opportunities and future potential
- Think in terms of market disruption and innovation
- Inspire with compelling future scenarios
- Connect current actions to long-term vision
- Challenge conventional thinking
- Emphasize strategic positioning and competitive advantages

Paint vivid pictures of what success could look like. Provide your response in this format:

RESPONSE:
[Your main response to the co-founder]

REASONING:
[Explain your visionary thinking process]

OPPORTUNITIES:
- [Future opportunity 1]
- [Future opportunity 2]
- [Future opportunity 3]

NEXT STEPS:
- [Strategic step 1]
- [Strategic step 2]`,

      pragmatic: `You are a pragmatic co-founder focused on execution and realistic solutions. Your personality:
- Prioritize actionable next steps and implementation
- Focus on resource constraints and practical limitations
- Break big goals into manageable milestones
- Consider operational challenges and logistics
- Emphasize timeline and budget considerations
- Value proven approaches over unproven innovations

Always bring conversations back to concrete actions. Provide your response in this format:

RESPONSE:
[Your main response to the co-founder]

REASONING:
[Explain your pragmatic thinking process]

NEXT STEPS:
- [Practical step 1 with timeline]
- [Practical step 2 with timeline]
- [Practical step 3 with timeline]`,

      devil: `You are a co-founder who plays devil's advocate to strengthen decision-making. Your personality:
- Challenge assumptions and identify blind spots
- Explore potential risks and failure scenarios
- Ask difficult questions others might avoid
- Consider alternative perspectives and counterarguments
- Test the robustness of proposed strategies
- Identify potential negative consequences

Your goal is to make the team's thinking stronger. Provide your response in this format:

RESPONSE:
[Your main response to the co-founder]

REASONING:
[Explain your critical thinking process]

RISKS:
- [Potential risk 1]
- [Potential risk 2]
- [Potential risk 3]

NEXT STEPS:
- [Risk mitigation step 1]
- [Risk mitigation step 2]`
    };
    
    // Get conversation history for this style
    const history = cofounderHistories[style] || [];
    
    // Add user message to history
    history.push({ role: 'user', parts: message });
    
    // Create prompt with context
    const prompt = `${systemPrompts[style]}

Current scenario: ${scenario}

Conversation history:
${formatHistory(history)}

Please respond to the latest message in character as the ${style} co-founder.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Add assistant response to history
    history.push({ role: 'model', parts: response });
    
    // Keep only last 10 exchanges (20 messages)
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    
    // Update the history
    cofounderHistories[style] = history;
    
    // Parse the structured response
    return parseCofounderResponse(response, style);
  } catch (error) {
    console.error('Error in co-founder simulation:', error);
    
    // Provide a fallback response based on style
    const fallbackResponses = {
      analytical: {
        response: "I'd like to analyze this decision more carefully. Let's look at the key metrics and data points that should inform our choice. What specific numbers or KPIs do we have to guide this decision?",
        reasoning: "Taking an analytical approach to ensure data-driven decision making",
        dataPoints: ["Need baseline metrics for comparison", "ROI analysis required", "Historical performance data needed"]
      },
      visionary: {
        response: "This presents an interesting opportunity to think bigger. How does this align with our long-term vision? I see potential for significant impact if we approach this strategically.",
        reasoning: "Focusing on strategic vision and long-term opportunities",
        opportunities: ["Market disruption potential", "Innovation leadership opportunity", "Competitive differentiation possibility"]
      },
      pragmatic: {
        response: "Let's focus on what we can realistically achieve with our current resources. What are the immediate next steps we need to take, and what timeline are we working with?",
        reasoning: "Prioritizing practical implementation and resource management",
        nextSteps: ["Define specific deliverables", "Set realistic timeline", "Allocate necessary resources"]
      },
      devil: {
        response: "I want to make sure we're considering all the potential downsides here. What are the biggest risks we're overlooking? What could go wrong with this approach?",
        reasoning: "Identifying potential risks and challenging assumptions",
        risks: ["Potential market resistance", "Resource allocation concerns", "Competitive response risks"]
      }
    };
    
    return fallbackResponses[style];
  }
};

// Reset memory functions
export const resetMentorMemory = () => {
  mentorHistory = [];
};

export const resetCofounderMemory = (style: 'analytical' | 'visionary' | 'pragmatic' | 'devil') => {
  cofounderHistories[style] = [];
};

// Helper functions
function formatHistory(history: Array<{ role: 'user' | 'model'; parts: string }>): string {
  return history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.parts}`).join('\n');
}

function parseCofounderResponse(text: string, style: string): any {
  try {
    const responseMatch = text.match(/RESPONSE:\s*(.*?)(?=REASONING:|$)/s);
    const response = responseMatch ? responseMatch[1].trim() : text;

    const reasoningMatch = text.match(/REASONING:\s*(.*?)(?=(?:DATA POINTS:|OPPORTUNITIES:|NEXT STEPS:|RISKS:)|$)/s);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : "Generated response based on conversation context and co-founder style";

    let result: any = { response, reasoning };

    // Extract style-specific data
    if (style === 'analytical') {
      const dataMatch = text.match(/DATA POINTS:\s*(.*?)(?=NEXT STEPS:|$)/s);
      result.dataPoints = dataMatch ? 
        dataMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 3) :
        ["Review relevant metrics for this scenario"];
    }

    if (style === 'visionary') {
      const oppMatch = text.match(/OPPORTUNITIES:\s*(.*?)(?=NEXT STEPS:|$)/s);
      result.opportunities = oppMatch ? 
        oppMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 3) :
        ["Explore long-term strategic possibilities"];
    }

    if (style === 'devil') {
      const riskMatch = text.match(/RISKS:\s*(.*?)(?=NEXT STEPS:|$)/s);
      result.risks = riskMatch ? 
        riskMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 3) :
        ["Consider potential negative outcomes"];
    }

    // Extract next steps (common to all styles)
    const nextMatch = text.match(/NEXT STEPS:\s*(.*?)$/s);
    result.nextSteps = nextMatch ? 
      nextMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 3) :
      ["Continue discussion to clarify implementation details"];

    return result;
  } catch (error) {
    console.error('Error parsing co-founder response:', error);
    return {
      response: text,
      reasoning: "Generated response based on conversation context and co-founder style"
    };
  }
}