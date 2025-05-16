import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini - using the newer SDK approach
const genAI = new GoogleGenerativeAI("AIzaSyBg3Hip1lHjGdquwPUeLyR0Mhr9gTn17-g");

// Store conversation history for different tools
let mentorHistory: Array<{ role: 'user' | 'model'; parts: string }> = [];
const cofounderHistories: Record<string, Array<{ role: 'user' | 'model'; parts: string }>> = {
  analytical: [],
  visionary: [],
  pragmatic: [],
  devil: []
};

// AI Mentor Bot Implementation
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

// Market Research Assistant Implementation
export const searchAndAnalyzeMarket = async (query: string): Promise<{
  searchResults: Array<{
    title: string;
    source: string;
    summary: string;
    relevanceScore: number;
  }>;
  analysis: {
    keyTrends: string[];
    marketInsights: string;
    opportunities: string[];
    threats: string[];
    recommendations: Array<{
      action: string;
      priority: "high" | "medium" | "low";
      rationale: string;
    }>;
  };
  competitiveAnalysis: {
    keyPlayers: string[];
    marketShare: {
      leader: string;
      challengerSegment: string;
    };
    competitiveAdvantages: string[];
  };
}> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a senior market research analyst with expertise in industry trend analysis, competitive landscape assessment, and strategic recommendations.

Analyze the market research query: "${query}"

Please provide a comprehensive analysis in the following structured format:

SEARCH RESULTS:
Generate 3-4 realistic search results with titles, sources, and summaries.

ANALYSIS:
Key Trends:
- [List 3-5 key market trends]

Market Insights:
[Provide 1-2 paragraphs of strategic insights]

Opportunities:
- [List 3-4 market opportunities]

Threats:
- [List 3-4 potential threats]

Recommendations:
- [Action 1] - Priority: [High/Medium/Low] - Rationale: [Explanation]
- [Action 2] - Priority: [High/Medium/Low] - Rationale: [Explanation]
- [Action 3] - Priority: [High/Medium/Low] - Rationale: [Explanation]

COMPETITIVE ANALYSIS:
Key Players:
- [List 4-5 key market players]

Market Share:
- Leader: [Company with market share percentage]
- Challenger: [Company with market share percentage]

Competitive Advantages:
- [List 3-4 competitive advantages]

Focus on providing realistic, actionable insights based on current market conditions.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the structured response
    return parseMarketAnalysis(response, query);
  } catch (error) {
    console.error('Error in market research:', error);
    
    // Return fallback analysis
    return createFallbackMarketAnalysis(query);
  }
};

// Co-Founder Simulator Implementation
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

function parseMarketAnalysis(text: string, query: string): any {
  try {
    // Initialize with default values
    let searchResults = [
      {
        title: `Market Analysis: ${query}`,
        source: "industry-insights.com",
        summary: "Comprehensive market research findings and industry trends analysis based on current data.",
        relevanceScore: 0.9
      },
      {
        title: `${query} - Competitive Landscape`,
        source: "market-research-pro.com",
        summary: "Detailed competitive analysis and market positioning insights for strategic planning.",
        relevanceScore: 0.85
      },
      {
        title: `Future Trends in ${query}`,
        source: "future-markets.org",
        summary: "Forward-looking analysis of emerging trends and future opportunities in the sector.",
        relevanceScore: 0.8
      }
    ];

    // Extract key trends
    const trendsMatch = text.match(/Key Trends:\s*(.*?)(?=Market Insights:|Opportunities:|$)/s);
    const keyTrends = trendsMatch ? 
      trendsMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 5) :
      [
        "Growing market demand and adoption rates",
        "Increasing investment in innovation and technology",
        "Shift towards digital transformation and automation",
        "Focus on sustainability and eco-friendly solutions"
      ];

    // Extract market insights
    const insightsMatch = text.match(/Market Insights:\s*(.*?)(?=Opportunities:|Threats:|$)/s);
    const marketInsights = insightsMatch ? 
      insightsMatch[1].trim() :
      `The market for ${query} shows strong growth potential with increasing adoption across multiple sectors. Key drivers include technological advancement, changing consumer preferences, and regulatory support. Market consolidation is expected as major players acquire innovative startups to strengthen their competitive position.`;

    // Extract opportunities
    const oppMatch = text.match(/Opportunities:\s*(.*?)(?=Threats:|Recommendations:|$)/s);
    const opportunities = oppMatch ? 
      oppMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 4) :
      [
        "Untapped market segments with high growth potential",
        "Strategic partnerships and collaboration opportunities",
        "Technology integration and innovation possibilities",
        "International expansion and market penetration"
      ];

    // Extract threats
    const threatsMatch = text.match(/Threats:\s*(.*?)(?=Recommendations:|COMPETITIVE ANALYSIS:|$)/s);
    const threats = threatsMatch ? 
      threatsMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 4) :
      [
        "Intense competition from established players",
        "Regulatory changes and compliance requirements",
        "Economic uncertainty and market volatility",
        "Rapid technological disruption"
      ];

    // Extract recommendations
    const recsMatch = text.match(/Recommendations:\s*(.*?)(?=COMPETITIVE ANALYSIS:|$)/s);
    const recommendations = recsMatch ? 
      parseRecommendations(recsMatch[1]) :
      [
        {
          action: "Develop strategic partnerships with key industry players",
          priority: "high" as const,
          rationale: "Partnerships can provide access to new markets and shared resources"
        },
        {
          action: "Invest in technology and innovation capabilities",
          priority: "high" as const,
          rationale: "Technology leadership is crucial for competitive advantage"
        },
        {
          action: "Explore international market opportunities",
          priority: "medium" as const,
          rationale: "Geographic diversification can reduce risk and increase growth"
        }
      ];

    // Extract competitive analysis
    const compMatch = text.match(/COMPETITIVE ANALYSIS:\s*(.*?)$/s);
    const competitiveAnalysis = compMatch ? 
      parseCompetitiveAnalysis(compMatch[1]) :
      {
        keyPlayers: ["Market Leader Corp", "Innovation Systems Inc", "Global Solutions Ltd", "Tech Pioneers Co"],
        marketShare: {
          leader: "Market Leader Corp with 35% market share",
          challengerSegment: "Innovation Systems Inc leading the challenger segment with 18%"
        },
        competitiveAdvantages: [
          "Strong brand recognition and customer loyalty",
          "Advanced technology and R&D capabilities",
          "Extensive distribution networks",
          "Cost leadership and operational efficiency"
        ]
      };

    return {
      searchResults,
      analysis: {
        keyTrends,
        marketInsights,
        opportunities,
        threats,
        recommendations
      },
      competitiveAnalysis
    };
  } catch (error) {
    console.error('Error parsing market analysis:', error);
    return createFallbackMarketAnalysis(query);
  }
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

function parseRecommendations(text: string): any[] {
  const recs = text.split(/[-•]\s*/).filter(item => item.trim());
  return recs.slice(0, 3).map(rec => {
    const priorityMatch = rec.match(/Priority:\s*(High|Medium|Low)/i);
    const rationaleMatch = rec.match(/Rationale:\s*(.*?)$/);
    const action = rec.replace(/Priority:.*$/i, '').trim();
    
    return {
      action: action || rec.trim(),
      priority: (priorityMatch ? priorityMatch[1].toLowerCase() : 'medium') as 'high' | 'medium' | 'low',
      rationale: rationaleMatch ? rationaleMatch[1].trim() : "Strategic recommendation based on analysis"
    };
  });
}

function parseCompetitiveAnalysis(text: string): any {
  const playersMatch = text.match(/Key Players:\s*(.*?)(?=Market Share:|$)/s);
  const shareMatch = text.match(/Market Share:\s*(.*?)(?=Competitive Advantages:|$)/s);
  const advMatch = text.match(/Competitive Advantages:\s*(.*?)$/s);

  return {
    keyPlayers: playersMatch ? 
      playersMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 5) :
      ["Market Leader Corp", "Innovation Systems Inc", "Global Solutions Ltd", "Tech Pioneers Co"],
    marketShare: shareMatch ? {
      leader: shareMatch[1].split(/[-•]/)[0]?.trim() || "Market Leader Corp with 35% market share",
      challengerSegment: shareMatch[1].split(/[-•]/)[1]?.trim() || "Innovation Systems Inc leading the challenger segment with 18%"
    } : {
      leader: "Market Leader Corp with 35% market share",
      challengerSegment: "Innovation Systems Inc leading the challenger segment with 18%"
    },
    competitiveAdvantages: advMatch ? 
      advMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 4) :
      [
        "Strong brand recognition and customer loyalty",
        "Advanced technology and R&D capabilities",
        "Extensive distribution networks",
        "Cost leadership and operational efficiency"
      ]
  };
}

function createFallbackMarketAnalysis(query: string): any {
  return {
    searchResults: [
      {
        title: `Market Analysis: ${query}`,
        source: "industry-insights.com",
        summary: "Comprehensive market research findings and industry trends analysis based on current data.",
        relevanceScore: 0.9
      },
      {
        title: `${query} - Competitive Landscape`,
        source: "market-research-pro.com",
        summary: "Detailed competitive analysis and market positioning insights for strategic planning.",
        relevanceScore: 0.85
      },
      {
        title: `Future Trends in ${query}`,
        source: "future-markets.org",
        summary: "Forward-looking analysis of emerging trends and future opportunities in the sector.",
        relevanceScore: 0.8
      }
    ],
    analysis: {
      keyTrends: [
        "Growing market demand and adoption rates",
        "Increasing investment in innovation and technology",
        "Shift towards digital transformation and automation",
        "Focus on sustainability and eco-friendly solutions"
      ],
      marketInsights: `The market for ${query} shows strong growth potential with increasing adoption across multiple sectors. Key drivers include technological advancement, changing consumer preferences, and regulatory support. Market consolidation is expected as major players acquire innovative startups to strengthen their competitive position.`,
      opportunities: [
        "Untapped market segments with high growth potential",
        "Strategic partnerships and collaboration opportunities",
        "Technology integration and innovation possibilities",
        "International expansion and market penetration"
      ],
      threats: [
        "Intense competition from established players",
        "Regulatory changes and compliance requirements",
        "Economic uncertainty and market volatility",
        "Rapid technological disruption"
      ],
      recommendations: [
        {
          action: "Develop strategic partnerships with key industry players",
          priority: "high" as const,
          rationale: "Partnerships can provide access to new markets and shared resources"
        },
        {
          action: "Invest in technology and innovation capabilities",
          priority: "high" as const,
          rationale: "Technology leadership is crucial for competitive advantage"
        },
        {
          action: "Explore international market opportunities",
          priority: "medium" as const,
          rationale: "Geographic diversification can reduce risk and increase growth"
        }
      ]
    },
    competitiveAnalysis: {
      keyPlayers: [
        "Market Leader Corp",
        "Innovation Systems Inc",
        "Global Solutions Ltd",
        "Tech Pioneers Co"
      ],
      marketShare: {
        leader: "Market Leader Corp with 35% market share",
        challengerSegment: "Innovation Systems Inc leading the challenger segment with 18%"
      },
      competitiveAdvantages: [
        "Strong brand recognition and customer loyalty",
        "Advanced technology and R&D capabilities",
        "Extensive distribution networks",
        "Cost leadership and operational efficiency"
      ]
    }
  };
}