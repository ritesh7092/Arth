import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendHorizonal, Bot, User, Sparkles, TrendingUp, CheckCircle, AlertCircle, Loader2, Zap } from 'lucide-react';
import baseUrl from '../api/api'; // Import baseUrl for API calls

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState({ remaining: 10, resetTime: null });
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      sender: 'BOT',
      message: "👋 Welcome to Arth Assistant! I'm here to help you master your finances and tasks. Ask me anything about:\n\n💰 Creating expense/income records\n📊 Financial summaries and insights\n✅ Task management and tracking\n📈 Productivity optimization\n\nWhat would you like to explore today?",
      timestamp: new Date(),
      type: 'welcome'
    };
    setChatHistory([welcomeMessage]);
  }, []);

  // Get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Enhanced input validation
  const validateInput = (message) => {
    if (!message.trim()) {
      return { valid: false, error: "Please enter a message" };
    }
    
    if (message.length > 500) {
      return { valid: false, error: "Message too long. Please keep it under 500 characters." };
    }

    const forbiddenPatterns = [
      /^(hi|hello|hey)$/i,
      /(politics|election|government|celebrity|sports|weather)/i
    ];

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(message)) {
        return { 
          valid: false, 
          error: "Let's focus on your finances and tasks! Ask me about budgeting, expenses, income tracking, or task management." 
        };
      }
    }

    return { valid: true };
  };

  // API call with proper error handling using baseUrl
  const callChatbotAPI = async (message) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Please log in to continue using Arth Assistant');
    }

    try {
      const response = await baseUrl.post('/api/chatbot/query', 
        { query: message },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if response is successful
      if (response.status === 200 && response.data) {
        if (response.data.success) {
          return response.data.message;
        } else {
          throw new Error(response.data.message || 'Failed to process your request');
        }
      } else {
        throw new Error('Unexpected response format');
      }

    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        switch (status) {
          case 401:
            throw new Error('Session expired. Please log in again.');
          case 429:
            const resetTime = new Date(Date.now() + 60000); // Assume 1 minute reset
            setRateLimitInfo({ remaining: 0, resetTime });
            throw new Error('Rate limit exceeded. Please wait a moment before sending another message.');
          case 403:
            throw new Error('Access denied. Please check your permissions.');
          case 404:
            throw new Error('Chatbot service not found. Please contact support.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(errorData?.message || `Server error: ${status}`);
        }
      } else if (error.request) {
        // Network error
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Other errors
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  };

  // Simulate typing effect
  const simulateTyping = (message, callback) => {
    setIsTyping(true);
    
    // Simulate typing delay based on message length
    const typingDelay = Math.min(message.length * 50, 2000);
    
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, typingDelay);
  };

  // Enhanced message sending
  const sendMessage = useCallback(async () => {
    if (isLoading) return;

    const validation = validateInput(input);
    if (!validation.valid) {
      setError(validation.error);
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Check rate limit
    if (rateLimitInfo.remaining <= 0 && rateLimitInfo.resetTime > new Date()) {
      setError('Rate limit exceeded. Please wait before sending another message.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const userMessage = {
      sender: 'USER',
      message: input.trim(),
      timestamp: new Date(),
      type: 'query'
    };

    setChatHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const botResponse = await callChatbotAPI(userMessage.message);
      
      // Update rate limit info (decrease remaining)
      setRateLimitInfo(prev => ({
        ...prev,
        remaining: Math.max(0, prev.remaining - 1)
      }));

      // Simulate typing before showing response
      simulateTyping(botResponse, () => {
        const botMessage = {
          sender: 'BOT',
          message: botResponse,
          timestamp: new Date(),
          type: 'response'
        };
        setChatHistory(prev => [...prev, botMessage]);
      });

    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMessage = {
        sender: 'BOT',
        message: error.message || "I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        type: 'error'
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, rateLimitInfo]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { text: "Show my expenses this month", icon: TrendingUp },
    { text: "Create new expense record", icon: Sparkles },
    { text: "Show pending tasks", icon: CheckCircle },
    { text: "Add new task", icon: Zap }
  ];

  const handleQuickAction = (actionText) => {
    setInput(actionText);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
      
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 px-8 py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Arth Assistant</h2>
              <p className="text-indigo-200 text-sm">AI-Powered Financial Intelligence</p>
            </div>
          </div>
          
          <div className="text-white/90 text-sm">
            <p className="font-medium mb-2">Revolutionize Your Productivity</p>
            <p className="text-xs text-white/70">
              The ultimate ecosystem for Financial Intelligence, Task Mastery & AI-Powered Insights
            </p>
          </div>

          {/* Rate limit indicator */}
          <div className="flex items-center gap-2 mt-4 text-xs text-white/70">
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < rateLimitInfo.remaining ? 'bg-green-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <span>{rateLimitInfo.remaining}/10 queries remaining</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 my-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="h-[32rem] overflow-y-auto p-6 space-y-6 bg-white/60 backdrop-blur-sm">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`max-w-lg p-4 rounded-2xl shadow-lg border ${
              msg.sender === 'USER'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-300 rounded-br-md'
                : msg.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200 rounded-tl-md'
                : msg.type === 'welcome'
                ? 'bg-gradient-to-r from-green-50 to-blue-50 text-slate-800 border-green-200 rounded-tl-md'
                : 'bg-white text-slate-800 border-slate-200 rounded-tl-md'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'USER' ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {msg.sender === 'USER' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className={`w-4 h-4 ${msg.type === 'error' ? 'text-red-500' : 'text-indigo-600'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.message}
                  </div>
                  <div className={`text-xs mt-2 opacity-70 ${
                    msg.sender === 'USER' ? 'text-white/70' : 'text-slate-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="max-w-lg p-4 rounded-2xl shadow-lg border bg-white text-slate-800 border-slate-200 rounded-tl-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      {chatHistory.length <= 1 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-3 font-medium">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.text)}
                className="flex items-center gap-2 p-3 text-sm bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 text-left"
              >
                <action.icon className="w-4 h-4 text-indigo-600" />
                <span className="text-slate-700">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      <div className="flex items-center p-6 bg-gradient-to-r from-slate-100 to-blue-100 border-t border-slate-200">
        <div className="flex-grow relative">
          <textarea
            className="w-full px-6 py-4 pr-12 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-500"
            placeholder="Ask about your finances, create records, manage tasks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            style={{ minHeight: '52px', maxHeight: '120px' }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400">
            {input.length}/500
          </div>
        </div>
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="ml-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-6 py-4 rounded-2xl flex items-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendHorizonal className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isLoading ? 'Processing...' : 'Send'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;


