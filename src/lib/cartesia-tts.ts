// src/lib/cartesia-tts.ts
const CARTESIA_API_KEY = 'sk_car_M5d6t2Gs61L3aioCPmnQt6';
const CARTESIA_API_URL = 'https://api.cartesia.ai/tts/bytes';
const CARTESIA_VERSION = '2024-06-30'; // Updated to the correct version

interface CartesiaVoice {
  id: string;
  name: string;
  description: string;
  language: string;
  accent: string;
  age: string;
  gender: string;
}

// Updated with actual working Cartesia voice IDs
export const CARTESIA_VOICES: CartesiaVoice[] = [
  {
    id: '694f9389-aac1-45b6-b726-9d9369183238',
    name: 'Default Voice',
    description: 'Default Cartesia voice',
    language: 'en',
    accent: 'american',
    age: 'middle-aged',
    gender: 'neutral'
  },
  {
    id: 'b7d50908-b17c-442d-ad8d-810c63997ed9',
    name: 'Sarah',
    description: 'Young, excited female voice',
    language: 'en',
    accent: 'american',
    age: 'young',
    gender: 'female'
  },
  {
    id: 'a0e99841-438c-4a64-b679-ae501e7d6091',
    name: 'Mark',
    description: 'Middle-aged professional male voice',
    language: 'en',
    accent: 'american',
    age: 'middle-aged',
    gender: 'male'
  }
];

interface TTSOptions {
  voiceId?: string;
  outputFormat?: 'mp3' | 'wav';
}

export class CartesiaTTS {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = CARTESIA_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = CARTESIA_API_URL;
  }

  /**
   * Convert text to speech using Cartesia API
   * @param text - The text to convert to speech
   * @param options - TTS options including voice, format, etc.
   * @returns Promise<Blob> - Audio blob that can be played
   */
  async textToSpeech(text: string, options: TTSOptions = {}): Promise<Blob> {
    const {
      voiceId = CARTESIA_VOICES[0].id,
      outputFormat = 'mp3'
    } = options;

    try {
      console.log('Making TTS request to Cartesia...');
      console.log('Text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      console.log('Voice ID:', voiceId);

      // Fix the request body to match Cartesia API expectations
      const requestBody = {
        model_id: 'sonic-english', // Fixed: use correct model
        transcript: text,
        voice: {
          mode: 'id',
          id: voiceId
        },
        output_format: {
          container: outputFormat,
          encoding: outputFormat === 'mp3' ? 'mp3' : 'pcm_f32le',
          sample_rate: 44100
        }
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Cartesia-Version': CARTESIA_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cartesia API error response:', errorText);
        throw new Error(`Cartesia API error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const audioBlob = await response.blob();
      console.log('Audio blob received:', audioBlob.size, 'bytes', audioBlob.type);
      
      if (audioBlob.size === 0) {
        throw new Error('Received empty audio blob from Cartesia');
      }
      
      return audioBlob;
    } catch (error) {
      console.error('Error with Cartesia TTS:', error);
      throw error;
    }
  }

  /**
   * Get list of available voices
   */
  getAvailableVoices(): CartesiaVoice[] {
    return CARTESIA_VOICES;
  }

  /**
   * Create an audio URL from text that can be used with HTML audio elements
   * @param text - Text to convert
   * @param options - TTS options
   * @returns Promise<string> - Object URL that can be used as audio src
   */
  async createAudioUrl(text: string, options: TTSOptions = {}): Promise<string> {
    const audioBlob = await this.textToSpeech(text, options);
    return URL.createObjectURL(audioBlob);
  }

  /**
   * Test if audio can play - useful for checking permissions
   */
  async testAudio(): Promise<boolean> {
    try {
      console.log('Testing audio capability...');
      const testText = "Audio test successful. Text-to-speech is working.";
      const audioUrl = await this.createAudioUrl(testText);
      const audio = new Audio(audioUrl);
      audio.volume = 0.5; // Medium volume for test
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.log('Audio test timeout');
          URL.revokeObjectURL(audioUrl);
          resolve(false);
        }, 10000); // Increased timeout

        audio.oncanplaythrough = () => {
          clearTimeout(timeout);
          console.log('Audio can play through');
          audio.play()
            .then(() => {
              console.log('Audio test play successful');
              // Let it play for a moment then stop
              setTimeout(() => {
                audio.pause();
                URL.revokeObjectURL(audioUrl);
                resolve(true);
              }, 1500);
            })
            .catch((error) => {
              console.error('Audio test play failed:', error);
              URL.revokeObjectURL(audioUrl);
              resolve(false);
            });
        };
        
        audio.onerror = (error) => {
          console.error('Audio test load error:', error);
          clearTimeout(timeout);
          URL.revokeObjectURL(audioUrl);
          resolve(false);
        };
        
        // Important: load the audio
        console.log('Loading audio for test...');
        audio.load();
      });
    } catch (error) {
      console.error('Audio test failed:', error);
      return false;
    }
  }

  /**
   * Play text as speech directly
   * @param text - Text to speak
   * @param options - TTS options
   * @returns Promise<void>
   */
  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    const audioUrl = await this.createAudioUrl(text, options);
    const audio = new Audio(audioUrl);
    
    // Set audio properties
    audio.volume = 1.0;
    audio.preload = 'metadata';
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      audio.oncanplaythrough = () => {
        audio.play().catch(reject);
      };
      
      // Load the audio
      audio.load();
    });
  }
}

// Export a default instance
export const cartesiaTTS = new CartesiaTTS();