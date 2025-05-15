import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Send, Loader2, RotateCcw } from 'lucide-react';
import { mentorChat, resetMentorMemory } from '../../lib/genai';

type AIMentorBotProps = {
  onBack: () => void;
};

export const AIMentorBot: React.FC<AIMentorBotProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI Mentor powered by Google Gemini and LangChain. I\'m here to help you learn, grow, and solve problems with structured guidance and personalized insights. What would you like to explore today?' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    // Simulated recording - in a real implementation, this would use Web Speech API
    setIsRecording(true);
    setError(null);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate speech recognition - in production, you'd use Web Speech API or send to speech service
    setTimeout(() => {
      setInputText('How can I improve my problem-solving skills using systematic approaches?');
      setIsProcessing(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isProcessing) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputText('');
    setIsProcessing(true);
    setError(null);

    try {
      // Call the LangChain-powered Gemini API
      const responseContent = await mentorChat(userMessage);
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
      
      // Simulate text-to-speech - in production, you'd use Web Speech API or a TTS service
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Failed to play audio:', error);
        });
      }
    } catch (error) {
      console.error('Error getting mentor response:', error);
      setError('Sorry, I encountered an error. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetConversation = () => {
    resetMentorMemory();
    setMessages([
      { 
        role: 'assistant', 
        content: 'Conversation reset! I\'m ready to help you with fresh context. What would you like to learn or discuss today?' 
      }
    ]);
    setError(null);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Mentor Bot</h2>
            <p className="text-gray-600 dark:text-gray-300">Powered by Google Gemini + LangChain</p>
          </div>
        </div>
        
        <button
          onClick={handleResetConversation}
          className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset conversation"
        >
          <RotateCcw size={16} className="mr-2" />
          Reset Chat
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} src="https://audio-samples.github.io/samples/mp3/blizzard_biased/sample-1.mp3" />
      
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
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2 text-indigo-500" />
                  <span className="text-gray-600 dark:text-gray-300">Mentor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isProcessing}
              className={`p-2 rounded-full ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              } hover:opacity-80 transition-all`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing || isRecording}
              placeholder="Ask me about learning strategies, problem-solving, technology, business, or personal growth..."
              className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors"
              aria-label="Send message"
            >
              {isProcessing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Enhanced with LangChain for better conversation memory and structured responses
          </div>
        </div>
      </div>
    </div>
  );
};