// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';
import { motion } from 'framer-motion';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Client-side filtering for off-topic queries
  const isOffTopic = (message) => {
    const forbiddenKeywords = [
      'politics', 'election', 'government',
      'celebrity', 'sports', 'movies', 'weather'
    ];
    return forbiddenKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    if (isOffTopic(input)) {
      alert("⚠️ Please ask only about your personal finances and tasks.");
      return;
    }
    
    const userMessage = { sender: 'USER', message: input };
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      const botMessage = { sender: 'BOT', message: data.reply };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'BOT', message: "We encountered an error. Please try again later." };
      setChatHistory(prev => [...prev, errorMessage]);
    }
    
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-12 bg-gray-50 rounded-2xl shadow-lg border border-gray-300 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 px-8 py-6">
        <h2 className="text-3xl font-bold text-white">Arth Assistant</h2>
        <p className="mt-2 text-sm text-gray-200">
          Your expert guide for personal finance & task management
        </p>
      </div>
      
      {/* Chat Area */}
      <div className="h-[30rem] overflow-y-auto p-8 space-y-4 bg-white">
        {chatHistory.length === 0 && (
          <motion.div
            className="text-center text-gray-500 italic text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ask about budgeting, expense tracking, or your to-do list...
          </motion.div>
        )}
        {chatHistory.map((msg, index) => (
          <motion.div
            key={index}
            className={`w-full flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, type: 'spring', stiffness: 100 }}
          >
            <div className={`max-w-md p-4 rounded-xl shadow-md 
              ${msg.sender === 'USER'
                ? 'bg-blue-600 text-white rounded-bl-none'
                : 'bg-gray-200 text-gray-800 rounded-tr-none'}`}>
              {msg.message}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center p-6 bg-gray-100 border-t border-gray-300">
        <input
          type="text"
          className="flex-grow px-5 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          placeholder="Type your query... (e.g., budgeting, expenses, tasks)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-full flex items-center transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

