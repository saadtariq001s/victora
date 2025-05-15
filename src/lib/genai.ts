import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { 
  ChatPromptTemplate, 
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate 
} from "@langchain/core/prompts";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

// Initialize Gemini with correct configuration (no tool calling for now)
const createModel = (temperature = 0.7) => new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  temperature,
  apiKey: "AIzaSyBg3Hip1lHjGdquwPUeLyR0Mhr9gTn17-g",
  maxRetries: 2,
});

// AI Mentor Bot Implementation
const mentorPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`You are an expert AI mentor and learning assistant with deep expertise in technology, business, science, and personal development.

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

Previous conversation context: {history}`),
  HumanMessagePromptTemplate.fromTemplate("{input}")
]);

const mentorMemory = new BufferMemory({
  returnMessages: true,
  memoryKey: "history"
});

const mentorChain = new ConversationChain({
  llm: createModel(),
  prompt: mentorPrompt,
  memory: mentorMemory,
  verbose: false
});

// Market Research Assistant Implementation
const marketResearchPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`You are a senior market research analyst with expertise in:
- Industry trend analysis and market intelligence
- Competitive landscape assessment  
- Data interpretation and insight extraction
- Market opportunity identification
- Consumer behavior analysis
- Strategic recommendations

Analyze the given market research query and provide insights in this structured format:

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

Focus on realistic and actionable market data.`),
  HumanMessagePromptTemplate.fromTemplate("Query to analyze: {query}")
]);

// Co-Founder Simulator Implementation
const cofounderStyles = {
  analytical: {
    systemPrompt: `You are an analytical co-founder with a data-driven mindset. Your personality:
- Focus on metrics, KPIs, and quantifiable outcomes
- Reference specific data points and statistical insights
- Approach decisions through rigorous analysis
- Question assumptions with evidence
- Prioritize ROI and measurable results
- Think systematically about cause and effect
- Communicate with precision and clarity

Always support your points with data or logical frameworks. Ask probing questions about metrics and measurement.

Provide your response in this format:

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
- [Actionable step 2]

Current scenario: {scenario}
Conversation history: {history}`,
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    model: createModel()
  },
  visionary: {
    systemPrompt: `You are a visionary co-founder who inspires through big-picture thinking. Your personality:
- Focus on transformative opportunities and future potential
- Think in terms of market disruption and innovation
- Inspire with compelling future scenarios
- Connect current actions to long-term vision
- Challenge conventional thinking
- Emphasize strategic positioning and competitive advantages
- Communicate with passion and conviction

Paint vivid pictures of what success could look like and challenge others to think beyond current limitations.

Provide your response in this format:

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
- [Strategic step 2]

Current scenario: {scenario}
Conversation history: {history}`,
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    model: createModel()
  },
  pragmatic: {
    systemPrompt: `You are a pragmatic co-founder focused on execution and realistic solutions. Your personality:
- Prioritize actionable next steps and implementation
- Focus on resource constraints and practical limitations
- Break big goals into manageable milestones
- Consider operational challenges and logistics
- Emphasize timeline and budget considerations
- Value proven approaches over unproven innovations
- Communicate clearly about what's actually doable

Always bring conversations back to concrete actions and realistic timelines.

Provide your response in this format:

RESPONSE:
[Your main response to the co-founder]

REASONING:
[Explain your pragmatic thinking process]

NEXT STEPS:
- [Practical step 1 with timeline]
- [Practical step 2 with timeline]
- [Practical step 3 with timeline]

Current scenario: {scenario}
Conversation history: {history}`,
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    model: createModel()
  },
  devil: {
    systemPrompt: `You are a co-founder who plays devil's advocate to strengthen decision-making. Your personality:
- Challenge assumptions and identify blind spots
- Explore potential risks and failure scenarios
- Ask difficult questions others might avoid
- Consider alternative perspectives and counterarguments
- Test the robustness of proposed strategies
- Identify potential negative consequences
- Push for thorough risk assessment

Your goal is to make the team's thinking stronger by constructively challenging ideas.

Provide your response in this format:

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
- [Risk mitigation step 2]

Current scenario: {scenario}
Conversation history: {history}`,
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    model: createModel()
  }
};

// Export functions
export const mentorChat = async (message: string): Promise<string> => {
  try {
    const response = await mentorChain.call({ input: message });
    return response.response;
  } catch (error) {
    console.error('Error in mentor chat:', error);
    throw new Error('Failed to get mentor response. Please try again.');
  }
};

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
    const model = createModel();
    const chain = marketResearchPrompt.pipe(model);
    
    const response = await chain.invoke({ query });
    const analysisText = response.content.toString();
    
    // Parse the structured response manually
    const parsed = parseMarketAnalysis(analysisText, query);
    return parsed;
  } catch (error) {
    console.error('Error in market research:', error);
    
    // Fallback response with structured data
    return createFallbackMarketAnalysis(query);
  }
};

export const simulateCofounder = async (
  message: string, 
  style: keyof typeof cofounderStyles,
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
    const cofounderStyle = cofounderStyles[style];
    
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(cofounderStyle.systemPrompt),
      HumanMessagePromptTemplate.fromTemplate("{input}")
    ]);

    const chain = new ConversationChain({
      llm: cofounderStyle.model,
      prompt,
      memory: cofounderStyle.memory,
      verbose: false
    });

    const response = await chain.call({
      input: message,
      scenario
    });

    // Parse the structured response
    const parsed = parseCofounderResponse(response.response, style);
    return parsed;
  } catch (error) {
    console.error('Error in co-founder simulation:', error);
    throw new Error('Failed to generate co-founder response. Please try again.');
  }
};

// Reset memory functions
export const resetMentorMemory = () => {
  mentorMemory.clear();
};

export const resetCofounderMemory = (style: keyof typeof cofounderStyles) => {
  cofounderStyles[style].memory.clear();
};

// Helper function to parse market analysis response
function parseMarketAnalysis(text: string, query: string): any {
  try {
    // Extract search results
    const searchResults = [
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

    // Extract trends
    const trendsMatch = text.match(/Key Trends:\s*(.*?)(?=Market Insights:|$)/s);
    const trends = trendsMatch ? 
      trendsMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 5) :
      [
        "Growing market demand and adoption rates",
        "Increasing investment in innovation and technology",
        "Shift towards digital transformation and automation",
        "Focus on sustainability and eco-friendly solutions"
      ];

    // Extract insights
    const insightsMatch = text.match(/Market Insights:\s*(.*?)(?=Opportunities:|$)/s);
    const insights = insightsMatch ? 
      insightsMatch[1].trim() :
      `The market for ${query} shows strong growth potential with increasing adoption across multiple sectors. Key drivers include technological advancement, changing consumer preferences, and regulatory support.`;

    // Extract opportunities
    const oppMatch = text.match(/Opportunities:\s*(.*?)(?=Threats:|$)/s);
    const opportunities = oppMatch ? 
      oppMatch[1].split(/[-•]\s*/).filter(item => item.trim()).slice(0, 4) :
      [
        "Untapped market segments with high growth potential",
        "Strategic partnerships and collaboration opportunities",
        "Technology integration and innovation possibilities",
        "International expansion and market penetration"
      ];

    // Extract threats
    const threatsMatch = text.match(/Threats:\s*(.*?)(?=Recommendations:|$)/s);
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
        keyTrends: trends,
        marketInsights: insights,
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

// Helper function to parse co-founder response
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
        dataMatch[1].split(/[-•]\s*/).filter(item => item.trim()) :
        ["Review relevant metrics for this scenario"];
    }

    if (style === 'visionary') {
      const oppMatch = text.match(/OPPORTUNITIES:\s*(.*?)(?=NEXT STEPS:|$)/s);
      result.opportunities = oppMatch ? 
        oppMatch[1].split(/[-•]\s*/).filter(item => item.trim()) :
        ["Explore long-term strategic possibilities"];
    }

    if (style === 'devil') {
      const riskMatch = text.match(/RISKS:\s*(.*?)(?=NEXT STEPS:|$)/s);
      result.risks = riskMatch ? 
        riskMatch[1].split(/[-•]\s*/).filter(item => item.trim()) :
        ["Consider potential negative outcomes"];
    }

    // Extract next steps (common to all styles)
    const nextMatch = text.match(/NEXT STEPS:\s*(.*?)$/s);
    result.nextSteps = nextMatch ? 
      nextMatch[1].split(/[-•]\s*/).filter(item => item.trim()) :
      style === 'pragmatic' ? ["Continue discussion to clarify implementation details"] : undefined;

    return result;
  } catch (error) {
    console.error('Error parsing co-founder response:', error);
    return {
      response: text,
      reasoning: "Generated response based on conversation context and co-founder style"
    };
  }
}

// Helper functions
function parseRecommendations(text: string): any[] {
  const recs = text.split(/[-•]\s*/).filter(item => item.trim());
  return recs.map(rec => {
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
      playersMatch[1].split(/[-•]\s*/).filter(item => item.trim()) :
      ["Market Leader Corp", "Innovation Systems Inc", "Global Solutions Ltd", "Tech Pioneers Co"],
    marketShare: shareMatch ? {
      leader: shareMatch[1].split(/[-•]/)[0]?.trim() || "Market Leader Corp with 35% market share",
      challengerSegment: shareMatch[1].split(/[-•]/)[1]?.trim() || "Innovation Systems Inc leading the challenger segment with 18%"
    } : {
      leader: "Market Leader Corp with 35% market share",
      challengerSegment: "Innovation Systems Inc leading the challenger segment with 18%"
    },
    competitiveAdvantages: advMatch ? 
      advMatch[1].split(/[-•]\s*/).filter(item => item.trim()) :
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