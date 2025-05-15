import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

type Scenario = {
  id: string;
  title: string;
  description: string;
};

type CommunicationStyle = {
  id: string;
  name: string;
  description: string;
};

type Message = {
  role: 'user' | 'cofounder';
  content: string;
};

type CoFounderSimulatorProps = {
  onBack: () => void;
};

export const CoFounderSimulator: React.FC<CoFounderSimulatorProps> = ({ onBack }) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scenarios: Scenario[] = [
    {
      id: 'fundraising',
      title: 'Fundraising Strategy',
      description: 'Discuss your startup\'s fundraising approach and investor pitch'
    },
    {
      id: 'product',
      title: 'Product Development',
      description: 'Debate product roadmap priorities and feature development'
    },
    {
      id: 'pivot',
      title: 'Considering a Pivot',
      description: 'Evaluate whether to change your business model based on market feedback'
    },
    {
      id: 'hiring',
      title: 'Hiring Decision',
      description: 'Discuss potential candidates for a key leadership position'
    }
  ];

  const communicationStyles: CommunicationStyle[] = [
    {
      id: 'analytical',
      name: 'Analytical',
      description: 'Data-driven, logical, focused on metrics and evidence'
    },
    {
      id: 'visionary',
      name: 'Visionary',
      description: 'Big-picture thinker, inspirational, future-oriented'
    },
    {
      id: 'pragmatic',
      name: 'Pragmatic',
      description: 'Practical, solution-oriented, focuses on implementation'
    },
    {
      id: 'devil',
      name: 'Devil\'s Advocate',
      description: 'Challenges assumptions, identifies potential issues'
    }
  ];

  useEffect(() => {
    if (selectedScenario && selectedStyle && !isConfigured) {
      setIsConfigured(true);
      
      // Initialize conversation with a greeting based on selected scenario
      const initialMessage = getInitialMessage();
      setMessages([{ role: 'cofounder', content: initialMessage }]);
    }
  }, [selectedScenario, selectedStyle, isConfigured]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getInitialMessage = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario);
    const style = communicationStyles.find(s => s.id === selectedStyle);
    
    if (!scenario || !style) return '';
    
    switch (scenario.id) {
      case 'fundraising':
        return `Let's talk about our fundraising strategy. We need to decide how much to raise and what kind of investors to target. As someone with an ${style.name.toLowerCase()} approach, I think we should consider the market conditions carefully. What are your thoughts?`;
      case 'product':
        return `I've been reviewing our product roadmap. We need to prioritize which features to build next. From my ${style.name.toLowerCase()} perspective, I have some concerns about our current direction. What features do you think we should focus on?`;
      case 'pivot':
        return `The market feedback we're getting suggests we might need to pivot our business model. As your ${style.name.toLowerCase()} co-founder, I think we should evaluate our options carefully. How do you feel about changing our direction?`;
      case 'hiring':
        return `We need to make a decision about the VP of Engineering role. We have two strong candidates with different backgrounds. Taking a ${style.name.toLowerCase()} approach, I'm thinking about both long-term fit and immediate needs. What qualities are you looking for in this hire?`;
      default:
        return `Let's discuss our startup's strategy. As your ${style.name.toLowerCase()} co-founder, I'm excited to work through these challenges together. What's on your mind today?`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isProcessing || !isConfigured) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputText('');
    setIsProcessing(true);

    // Simulated AI response - would connect to GPT-4 API in a real implementation
    setTimeout(() => {
      const style = communicationStyles.find(s => s.id === selectedStyle);
      const scenario = scenarios.find(s => s.id === selectedScenario);
      
      // Generate a response based on the selected style and scenario
      let responseContent = '';
      
      if (style?.id === 'analytical') {
        responseContent = `Looking at this objectively, I see several data points we should consider. Our unit economics show ${scenario?.id === 'fundraising' ? 'we have a 14-month runway at current burn rate' : scenario?.id === 'product' ? 'feature X has the highest engagement metrics' : scenario?.id === 'pivot' ? 'our conversion rate has dropped 22% in the last quarter' : 'candidate A has 40% more relevant experience'}. 

Based on my analysis, I recommend we ${scenario?.id === 'fundraising' ? 'target strategic investors who can provide industry connections' : scenario?.id === 'product' ? 'prioritize features with proven user demand' : scenario?.id === 'pivot' ? 'test a new positioning before fully pivoting' : 'choose the candidate with more technical leadership experience'}. 

What specific metrics are most important to you in making this decision?`;
      } else if (style?.id === 'visionary') {
        responseContent = `I see tremendous potential in where we could take this. Imagine if we ${scenario?.id === 'fundraising' ? 'secured funding that allowed us to expand into three new markets simultaneously' : scenario?.id === 'product' ? 'built something truly revolutionary that changes how people think about this space' : scenario?.id === 'pivot' ? 'completely reimagined our business model around our core strengths' : 'brought in someone who could transform our engineering culture'}.

The big opportunity here is to ${scenario?.id === 'fundraising' ? 'position ourselves as the category leader' : scenario?.id === 'product' ? 'create a product that inspires genuine excitement' : scenario?.id === 'pivot' ? 'find a more scalable model with better unit economics' : 'build a world-class engineering team that attracts top talent'}.

What's your vision for how this could play out in the best-case scenario?`;
      } else if (style?.id === 'pragmatic') {
        responseContent = `Let's focus on what's practical here. We need to be realistic about ${scenario?.id === 'fundraising' ? 'our valuation expectations in the current market' : scenario?.id === 'product' ? 'what we can actually deliver with our current team' : scenario?.id === 'pivot' ? 'how much runway we have to experiment with new directions' : 'the immediate skills gap we need to fill'}.

I suggest we ${scenario?.id === 'fundraising' ? 'prepare for a longer fundraising process than we initially planned' : scenario?.id === 'product' ? 'break down the roadmap into smaller, achievable milestones' : scenario?.id === 'pivot' ? 'run a small-scale test of the new model before fully committing' : 'prioritize candidates who can start immediately and deliver results'}.

What concrete steps do you think we should take in the next 30 days?`;
      } else {
        responseContent = `I want to challenge our thinking here. Have we considered that ${scenario?.id === 'fundraising' ? 'raising too much money could actually harm our discipline and focus' : scenario?.id === 'product' ? 'users might not actually want the features we think they need' : scenario?.id === 'pivot' ? 'our current model might still work if we addressed the core issues' : 'neither candidate might be right for our current stage'}.

We should question our assumptions about ${scenario?.id === 'fundraising' ? 'needing venture capital at all' : scenario?.id === 'product' ? 'what\'s driving our product decisions' : scenario?.id === 'pivot' ? 'whether our core assumptions about the market are correct' : 'what type of leadership we really need at this stage'}.

What potential downsides do you see that we might be overlooking?`;
      }

      setMessages(prev => [...prev, { role: 'cofounder', content: responseContent }]);
      setIsProcessing(false);
    }, 2000);
  };

  // Render configuration form if not configured yet
  if (!isConfigured) {
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Co-Founder Simulator</h2>
            <p className="text-gray-600 dark:text-gray-300">Conversational AI for startup scenarios</p>
          </div>
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Configure Your Co-Founder</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  1. Select a Scenario
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedScenario === scenario.id 
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <h5 className={`font-medium mb-1 ${
                        selectedScenario === scenario.id 
                          ? 'text-amber-700 dark:text-amber-400' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {scenario.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {scenario.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  2. Choose Communication Style
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {communicationStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedStyle === style.id 
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <h5 className={`font-medium mb-1 ${
                        selectedStyle === style.id 
                          ? 'text-amber-700 dark:text-amber-400' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {style.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {style.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (selectedScenario && selectedStyle) {
                      setIsConfigured(true);
                    }
                  }}
                  disabled={!selectedScenario || !selectedStyle}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Co-Founder Simulator</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {scenarios.find(s => s.id === selectedScenario)?.title} · 
            {communicationStyles.find(s => s.id === selectedStyle)?.name} Style
          </p>
        </div>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
              placeholder="Type your message to your co-founder..."
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
              aria-label="Send message"
            >
              {isProcessing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};