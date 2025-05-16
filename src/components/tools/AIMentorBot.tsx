import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Send, Loader2, RotateCcw, Volume2, VolumeX, Settings2 } from 'lucide-react';
import { mentorChat, resetMentorMemory } from '../../lib/genai';
import { cartesiaTTS, CARTESIA_VOICES } from '../../lib/cartesia-tts';

type AIMentorBotProps = {
  onBack: () => void;
};

// Helper function to parse markdown and clean text for TTS
const parseMarkdown = (text: string): { html: string; cleanText: string } => {
  // Convert **bold** to <strong>bold</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>italic</em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert line breaks to <br>
  html = html.replace(/\n/g, '<br>');
  
  // Create clean text for TTS (remove all markdown and clean up)
  let cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove ** bold markers
    .replace(/\*(.*?)\*/g, '$1')     // Remove * italic markers
    .replace(/#{1,6}\s/g, '')        // Remove # headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links, keep text
    .replace(/`([^`]+)`/g, '$1')     // Remove backticks
    .replace(/\n{2,}/g, '. ')        // Replace multiple newlines with period
    .replace(/\n/g, ' ')             // Replace single newlines with space
    .trim();
  
  return { html, cleanText };
};

// Component to render parsed markdown
const MarkdownMessage: React.FC<{ content: string }> = ({ content }) => {
  const { html } = parseMarkdown(content);
  return (
    <div 
      className="whitespace-pre-line"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const AIMentorBot: React.FC<AIMentorBotProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTTSProcessing, setIsTTSProcessing] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState(CARTESIA_VOICES[0].id);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [audioCanPlay, setAudioCanPlay] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI Mentor powered by Google Gemini and enhanced with Cartesia\'s natural voice synthesis. I\'m here to help you learn, grow, and solve problems with structured guidance and personalized insights. What would you like to explore today?' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 1.0;
    setDebugInfo('Audio system initialized');
  }, []);

  // Test audio capability when TTS is first enabled
  useEffect(() => {
    if (isTTSEnabled && !audioCanPlay) {
      setDebugInfo('Click "Test Audio" to enable voice');
    }
  }, [isTTSEnabled, audioCanPlay]);

  const testAudioCapability = async () => {
    setDebugInfo('Testing audio...');
    try {
      const canPlay = await cartesiaTTS.testAudio();
      setAudioCanPlay(canPlay);
      setDebugInfo(canPlay ? 'Audio test successful!' : 'Audio test failed');
      
      if (!canPlay) {
        setError('Audio test failed. Check browser audio settings.');
      } else {
        setError(null);
      }
    } catch (error) {
      setAudioCanPlay(false);
      setDebugInfo('Audio test error');
      setError(`Audio test failed: ${error}`);
      console.error('Audio capability test failed:', error);
    }
  };

  // Optimized TTS function with faster processing
  const speakText = async (text: string) => {
    if (!isTTSEnabled || isSpeaking || !audioCanPlay || isTTSProcessing) {
      if (!audioCanPlay && isTTSEnabled) {
        setDebugInfo('Audio not enabled - click Test Audio first');
      }
      return;
    }
    
    try {
      setIsTTSProcessing(true);
      setDebugInfo('Generating speech...');
      
      // Clean the text for TTS (remove markdown formatting)
      const { cleanText } = parseMarkdown(text);
      
      // Use MP3 for faster processing and smaller file size
      const audioUrl = await cartesiaTTS.createAudioUrl(cleanText, {
        voiceId: selectedVoice,
        outputFormat: 'mp3'
      });
      
      setIsTTSProcessing(false);
      
      if (audioRef.current) {
        // Clean up previous audio
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        
        setIsSpeaking(true);
        audioRef.current.src = audioUrl;
        audioRef.current.volume = 1.0;
        
        audioRef.current.onloadstart = () => {
          setDebugInfo('Loading audio...');
        };
        
        audioRef.current.oncanplaythrough = () => {
          setDebugInfo('Audio ready, starting playback...');
          audioRef.current?.play().catch(error => {
            console.error('Play error:', error);
            setIsSpeaking(false);
            setDebugInfo('Play blocked - need user interaction');
            setError('Audio blocked by browser. Click Test Audio to enable.');
          });
        };
        
        audioRef.current.onplay = () => {
          setDebugInfo('Audio playing...');
        };
        
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          setDebugInfo('Playback complete');
          URL.revokeObjectURL(audioUrl);
        };
        
        audioRef.current.onerror = (e) => {
          setIsSpeaking(false);
          setIsTTSProcessing(false);
          setDebugInfo('Playback error');
          setError('Audio playback failed. Try the test button again.');
          URL.revokeObjectURL(audioUrl);
          console.error('Audio playback error:', e);
        };
        
        // Preload the audio immediately
        audioRef.current.preload = 'auto';
        audioRef.current.load();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsSpeaking(false);
      setIsTTSProcessing(false);
      setDebugInfo('TTS generation failed');
      setError(`Text-to-speech failed: ${error}`);
    }
  };

  const handleTestAudio = async () => {
    await testAudioCapability();
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setError(null);
    setDebugInfo('Recording...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    setDebugInfo('Processing speech...');
    
    // Simulate speech recognition
    setTimeout(() => {
      setInputText('How can I improve my problem-solving skills using systematic approaches?');
      setIsProcessing(false);
      setDebugInfo('Speech processed');
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
    setDebugInfo('Getting AI response...');

    try {
      const responseContent = await mentorChat(userMessage);
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);
      setDebugInfo('Response received');
      setIsProcessing(false);
      
      // Start TTS immediately after receiving response (no delay)
      if (isTTSEnabled && audioCanPlay) {
        // Small delay to ensure the message is rendered first
        setTimeout(() => {
          speakText(responseContent);
        }, 100);
      }
    } catch (error) {
      console.error('Error getting mentor response:', error);
      setError('Sorry, I encountered an error. Please try again.');
      setDebugInfo('AI response error');
      setIsProcessing(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.' 
      }]);
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
    setIsSpeaking(false);
    setIsTTSProcessing(false);
    setDebugInfo('Conversation reset');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setIsTTSProcessing(false);
    setDebugInfo('Speech stopped');
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    setShowVoiceSettings(false);
    setDebugInfo(`Voice changed to ${CARTESIA_VOICES.find(v => v.id === voiceId)?.name}`);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedVoiceInfo = CARTESIA_VOICES.find(v => v.id === selectedVoice);

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
            <p className="text-gray-600 dark:text-gray-300">Powered by Google Gemini + Cartesia Voice</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Test Audio Button - Most Important */}
          <button
            onClick={handleTestAudio}
            className="flex items-center px-3 py-2 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-semibold"
            aria-label="Test audio"
          >
            <Volume2 size={16} className="mr-2" />
            Test Audio
          </button>

          {/* Debug Status */}
          {debugInfo && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded max-w-xs truncate">
              {debugInfo}
            </div>
          )}

          {/* Voice Settings */}
          <div className="relative">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Voice settings"
            >
              <Settings2 size={16} className="mr-2" />
              {selectedVoiceInfo?.name || 'Voice'}
            </button>
            
            {showVoiceSettings && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Voice Settings</h3>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {CARTESIA_VOICES.map(voice => (
                    <button
                      key={voice.id}
                      onClick={() => handleVoiceChange(voice.id)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        selectedVoice === voice.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {voice.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {voice.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TTS Toggle */}
          <button
            onClick={() => {
              setIsTTSEnabled(!isTTSEnabled);
              if (isSpeaking) {
                stopSpeaking();
              }
            }}
            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
              isTTSEnabled 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
            aria-label={isTTSEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {isTTSEnabled ? <Volume2 size={16} className="mr-2" /> : <VolumeX size={16} className="mr-2" />}
            Voice {isTTSEnabled ? 'On' : 'Off'}
          </button>

          {/* Stop Speaking Button */}
          {(isSpeaking || isTTSProcessing) && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              aria-label="Stop speaking"
            >
              {isTTSProcessing ? 'Processing...' : 'Stop'}
            </button>
          )}

          {/* Reset Button */}
          <button
            onClick={handleResetConversation}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Reset conversation"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} />
      
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
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-line">{message.content}</p>
                  ) : (
                    <MarkdownMessage content={message.content} />
                  )}
                  {message.role === 'assistant' && isTTSEnabled && audioCanPlay && (
                    <button
                      onClick={() => speakText(message.content)}
                      disabled={isSpeaking || isTTSProcessing}
                      className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center"
                    >
                      <Volume2 size={12} className="mr-1" />
                      {isTTSProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : 'Replay'}
                    </button>
                  )}
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
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
            <div>Enhanced with Cartesia's natural voice synthesis and LangChain for better conversation memory</div>
            {!audioCanPlay && isTTSEnabled && (
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                🔊 Click "Test Audio" to enable voice synthesis
              </div>
            )}
            {audioCanPlay && isTTSEnabled && (
              <div className="text-green-600 dark:text-green-400">
                ✅ Voice synthesis ready
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};