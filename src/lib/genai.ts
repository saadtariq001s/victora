import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBg3Hip1lHjGdquwPUeLyR0Mhr9gTn17-g");

// AI Mentor Bot configuration
const mentorModel = genAI.getGenerativeModel({ model: "gemini-pro" });
const mentorPrompt = `You are an expert AI mentor with deep knowledge in technology, business, and personal development. 
Your role is to guide, teach, and help users grow professionally.
Be concise, practical, and focus on actionable insights.`;

// Market Research Assistant configuration
const researchModel = genAI.getGenerativeModel({ model: "gemini-pro" });
const researchPrompt = `You are a market research expert specializing in data analysis and trend identification.
Focus on extracting key insights, identifying patterns, and providing actionable market intelligence.
Be analytical and data-driven in your responses.`;

// Co-Founder Simulator configuration
const cofounderModel = genAI.getGenerativeModel({ model: "gemini-pro" });
const cofounderStyles = {
  analytical: `You are an analytical co-founder who focuses on data, metrics, and evidence-based decision making.
  Communicate with precision and always reference specific numbers or data points.`,
  
  visionary: `You are a visionary co-founder who thinks big and inspires others.
  Focus on future possibilities and transformative opportunities.`,
  
  pragmatic: `You are a pragmatic co-founder who focuses on practical implementation and realistic goals.
  Prioritize feasible solutions and concrete next steps.`,
  
  devil: `You are a co-founder who plays devil's advocate to strengthen decision making.
  Challenge assumptions constructively and identify potential risks.`
};

export const mentorChat = async (message: string) => {
  try {
    const result = await mentorModel.generateContent([mentorPrompt, message]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in mentor chat:', error);
    throw error;
  }
};

export const analyzeMarketData = async (query: string, data?: string) => {
  try {
    const prompt = data 
      ? `Analyze this market data: ${data}\n\nFocus on: ${query}`
      : `Research and analyze: ${query}`;
      
    const result = await researchModel.generateContent([researchPrompt, prompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in market analysis:', error);
    throw error;
  }
};

export const simulateCofounder = async (
  message: string, 
  style: keyof typeof cofounderStyles,
  scenario: string
) => {
  try {
    const stylePrompt = cofounderStyles[style];
    const contextPrompt = `Current scenario: ${scenario}\n\nUser message: ${message}`;
    
    const result = await cofounderModel.generateContent([stylePrompt, contextPrompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in co-founder simulation:', error);
    throw error;
  }
};