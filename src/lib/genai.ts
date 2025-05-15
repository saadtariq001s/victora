import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBg3Hip1lHjGdquwPUeLyR0Mhr9gTn17-g");

// AI Mentor Bot configuration
const mentorModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: `You are an expert AI mentor and learning assistant with deep expertise in technology, business, science, and personal development. Your role is to:

- Provide clear, actionable guidance tailored to the user's learning level
- Break down complex concepts into digestible explanations
- Offer practical examples and real-world applications
- Encourage critical thinking and problem-solving
- Adapt your communication style to match the user's expertise level
- Provide step-by-step guidance when needed
- Share relevant resources and best practices

Keep responses concise but comprehensive, focusing on practical value and actionable insights. Always encourage the user's growth mindset and learning journey.`
});

// Market Research Assistant configuration
const researchModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: `You are a senior market research analyst with expertise in:

- Industry trend analysis and market intelligence
- Competitive landscape assessment
- Data interpretation and insight extraction
- Market opportunity identification
- Consumer behavior analysis
- Strategic recommendations

Your responses should be:
- Data-driven and analytically rigorous
- Structured with clear key findings
- Include actionable market insights
- Identify trends, opportunities, and threats
- Provide strategic recommendations
- Use industry terminology appropriately
- Support conclusions with logical reasoning

Format your analysis clearly with sections for key findings, trends, insights, and recommendations.`
});

// Co-Founder Simulator configuration
const cofounderModel = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash"
});

const cofounderStyles = {
  analytical: `You are an analytical co-founder with a data-driven mindset. Your characteristics:
- Focus on metrics, KPIs, and quantifiable outcomes
- Reference specific data points and statistical insights
- Approach decisions through rigorous analysis
- Question assumptions with evidence
- Prioritize ROI and measurable results
- Think systematically about cause and effect
- Communicate with precision and clarity

Always support your points with data or logical frameworks. Ask probing questions about metrics and measurement.`,

  visionary: `You are a visionary co-founder who inspires through big-picture thinking. Your characteristics:
- Focus on transformative opportunities and future potential
- Think in terms of market disruption and innovation
- Inspire with compelling future scenarios
- Connect current actions to long-term vision
- Challenge conventional thinking
- Emphasize strategic positioning and competitive advantages
- Communicate with passion and conviction

Paint vivid pictures of what success could look like and challenge others to think beyond current limitations.`,

  pragmatic: `You are a pragmatic co-founder focused on execution and realistic solutions. Your characteristics:
- Prioritize actionable next steps and implementation
- Focus on resource constraints and practical limitations
- Break big goals into manageable milestones
- Consider operational challenges and logistics
- Emphasize timeline and budget considerations
- Value proven approaches over unproven innovations
- Communicate clearly about what's actually doable

Always bring conversations back to concrete actions and realistic timelines.`,

  devil: `You are a co-founder who plays devil's advocate to strengthen decision-making. Your characteristics:
- Challenge assumptions and identify blind spots
- Explore potential risks and failure scenarios
- Ask difficult questions others might avoid
- Consider alternative perspectives and counterarguments
- Test the robustness of proposed strategies
- Identify potential negative consequences
- Push for thorough risk assessment

Your goal is to make the team's thinking stronger by constructively challenging ideas and ensuring all angles are considered.`
};

export const mentorChat = async (message: string): Promise<string> => {
  try {
    const chat = mentorModel.startChat({
      history: []
    });
    
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
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
  }>;
  analysis: {
    trends: string[];
    insights: string;
    recommendations: string[];
  };
}> => {
  try {
    // First, generate mock search results based on the query
    const searchPrompt = `Generate 3-4 realistic market research search results for the query: "${query}"

For each result, provide:
1. A realistic title
2. A credible source website
3. A detailed summary (2-3 sentences)

Format as JSON with this structure:
{
  "results": [
    {
      "title": "...",
      "source": "...",
      "summary": "..."
    }
  ]
}`;

    const searchResult = await researchModel.generateContent(searchPrompt);
    const searchResponse = await searchResult.response;
    let searchData;
    
    try {
      searchData = JSON.parse(searchResponse.text());
    } catch {
      // Fallback if JSON parsing fails
      searchData = {
        results: [
          {
            title: `Market Analysis: ${query}`,
            source: "industry-insights.com",
            summary: "Comprehensive market research findings and industry trends analysis."
          }
        ]
      };
    }

    // Then analyze the results
    const analysisPrompt = `Based on this market research query "${query}", provide a detailed analysis with:

1. Key Trends (3-5 bullet points)
2. Strategic Insights (1-2 paragraphs)
3. Actionable Recommendations (3-4 specific recommendations)

Focus on practical business intelligence and actionable insights.`;

    const analysisResult = await researchModel.generateContent(analysisPrompt);
    const analysisResponse = await analysisResult.response;
    const analysisText = analysisResponse.text();

    // Parse the analysis response
    const trends = extractSection(analysisText, 'trends') || [];
    const insights = extractSection(analysisText, 'insights') || analysisText.split('\n')[0];
    const recommendations = extractSection(analysisText, 'recommendations') || [];

    return {
      searchResults: searchData.results,
      analysis: {
        trends,
        insights,
        recommendations
      }
    };
  } catch (error) {
    console.error('Error in market research:', error);
    throw new Error('Failed to analyze market data. Please try again.');
  }
};

export const simulateCofounder = async (
  message: string, 
  style: keyof typeof cofounderStyles,
  scenario: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
): Promise<string> => {
  try {
    const systemPrompt = cofounderStyles[style];
    const contextPrompt = `You are in a startup co-founder discussion about: ${scenario}

${systemPrompt}

Previous conversation context:
${conversationHistory.map(msg => `${msg.role === 'user' ? 'Co-founder' : 'You'}: ${msg.content}`).join('\n')}

Current message from your co-founder: ${message}

Respond as the co-founder with the specified communication style. Keep your response focused, relevant to the scenario, and maintain the conversation flow.`;

    const result = await cofounderModel.generateContent(contextPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in co-founder simulation:', error);
    throw new Error('Failed to generate co-founder response. Please try again.');
  }
};

// Helper function to extract sections from analysis text
function extractSection(text: string, sectionName: string): string[] {
  const lines = text.split('\n');
  const sectionRegex = new RegExp(sectionName, 'i');
  const startIndex = lines.findIndex(line => sectionRegex.test(line));
  
  if (startIndex === -1) return [];
  
  const items: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.match(/^\d+\./) || line.startsWith('-') || line.startsWith('•')) {
      items.push(line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, ''));
    } else if (line.match(/^[A-Z]/)) {
      break; // Likely the start of a new section
    }
  }
  
  return items;
}