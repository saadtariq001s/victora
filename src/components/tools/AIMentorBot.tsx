import React, { useState, useRef } from 'react';
import { ArrowLeft, Mic, MicOff, Send, Loader2 } from 'lucide-react';

type AIMentorBotProps = {
  onBack: () => void;
};

export const AIMentorBot: React.FC<AIMentorBotProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI Mentor. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
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
    // Simulated recording - would connect to Whisper API in a real implementation
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing with the Whisper API
    setTimeout(() => {
      setInputText('How do I structure a machine learning project?');
      setIsProcessing(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || isProcessing) return;
    
    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputText('');
    setIsProcessing(true);

    // Simulated AI response - would connect to GPT-4 API in a real implementation
    setTimeout(() => {
      const responseContent = `For structuring a machine learning project, I recommend following these key steps:

1. Define your problem and objectives clearly
2. Collect and prepare your data (cleaning, normalization)
3. Perform exploratory data analysis
4. Select appropriate models and features
5. Train your models and tune hyperparameters
6. Evaluate model performance with appropriate metrics
7. Deploy and monitor your model in production

Would you like me to elaborate on any specific step?`;

      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
      setIsProcessing(false);
      
      // Simulate text-to-speech with Coqui TTS
      // In a real implementation, this would call the /speak endpoint
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Failed to play audio:', error);
        });
      }
    }, 2000);
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Mentor Bot</h2>
          <p className="text-gray-600 dark:text-gray-300">Voice-interactive learning assistant</p>
        </div>
      </div>

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
              placeholder="Type your message or use voice input..."
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
        </div>
      </div>
    </div>
  );
};