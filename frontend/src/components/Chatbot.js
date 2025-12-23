import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader } from 'lucide-react';
import axios from 'axios';
import '../styles/Chatbot.css';

const CHAT_API_URL = process.env.REACT_APP_CHAT_API_URL || 'http://localhost:5000/api/chat';

function Chatbot({ tasks, onAddTask, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hi! 👋 I\'m TaskFlow Assistant powered by GPT-4. I can help you create tasks, answer questions, and provide productivity tips. Try saying "Help me organize my day" or "Add a task to buy groceries"',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Process user input and generate bot response
  const processChatInput = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Add task pattern
    if (lowerMessage.includes('add') || lowerMessage.includes('create')) {
      const taskMatch = userMessage.match(/(?:add|create|make)(?:\s+a)?\s+(?:task|todo)?\s*(?:to\s+)?(.+)/i);
      if (taskMatch) {
        const taskTitle = taskMatch[1].trim();
        return {
          response: `✅ I'll add "${taskTitle}" to your tasks. Creating it now...`,
          action: 'addTask',
          taskTitle: taskTitle
        };
      }
    }

    // Show tasks pattern
    if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('all tasks')) {
      const taskList = tasks.length > 0 
        ? `📋 You have ${tasks.length} task(s):\n${tasks.map((t, i) => `${i + 1}. ${t.title} ${t.completed ? '✅' : '⏳'}`).join('\n')}`
        : '📭 You have no tasks yet. Want me to help you create one?';
      
      return {
        response: taskList,
        action: null
      };
    }

    // Completed tasks pattern
    if (lowerMessage.includes('completed') || lowerMessage.includes('done')) {
      const completed = tasks.filter(t => t.completed);
      const response = completed.length > 0
        ? `✅ You have ${completed.length} completed task(s):\n${completed.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}`
        : '🎉 No completed tasks yet. Keep working!';
      
      return {
        response: response,
        action: null
      };
    }

    // Pending tasks pattern
    if (lowerMessage.includes('pending') || lowerMessage.includes('remaining') || lowerMessage.includes('todo')) {
      const pending = tasks.filter(t => !t.completed);
      const response = pending.length > 0
        ? `⏳ You have ${pending.length} pending task(s):\n${pending.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}`
        : '🎉 All caught up! No pending tasks.';
      
      return {
        response: response,
        action: null
      };
    }

    // Help pattern
    if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
      return {
        response: `🤖 Here's what I can help you with:\n\n📝 "Add a task to [task name]" - Create a new task\n👀 "Show my tasks" - List all tasks\n✅ "Show completed tasks" - View finished tasks\n⏳ "Show pending tasks" - View remaining tasks\n📊 "How many tasks" - Get task statistics\n\nJust chat naturally and I'll help!`,
        action: null
      };
    }

    // Statistics pattern
    if (lowerMessage.includes('how many') || lowerMessage.includes('statistics') || lowerMessage.includes('stats')) {
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const pending = total - completed;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        response: `📊 Task Statistics:\n\n📋 Total Tasks: ${total}\n✅ Completed: ${completed}\n⏳ Pending: ${pending}\n📈 Progress: ${percentage}%`,
        action: null
      };
    }

    // Default response
    return {
      response: '🤔 I didn\'t quite understand that. Try:\n• "Add a task to buy groceries"\n• "Show my tasks"\n• "Show completed tasks"\n• "Help" for more options',
      action: null
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = input;
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text: userMessage, 
      sender: 'user' 
    }]);
    setInput('');
    setLoading(true);

    try {
      // Call OpenAI API via backend
      const response = await axios.post(CHAT_API_URL + '/chat', {
        message: userMessage,
        tasks: tasks
      });

      const result = response.data;
      
      // Add bot response
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: result.response,
        sender: 'bot'
      }]);

      // Execute action if needed
      if (result.action === 'addTask' && result.taskTitle) {
        // Small delay for better UX
        setTimeout(() => {
          onAddTask({
            title: result.taskTitle,
            description: '',
            completed: false,
            createdAt: new Date().toISOString()
          });
          
          setMessages(prev => [...prev, {
            id: Date.now() + 2,
            text: `✨ Task "${result.taskTitle}" has been added to your list!`,
            sender: 'bot'
          }]);
        }, 500);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.error || 
                          'Sorry, I encountered an error. Please try again.';
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `❌ ${errorMessage}`,
        sender: 'bot'
      }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Bubble Button */} (GPT-4)
      {!isOpen && (
        <button 
          className="chat-bubble-btn"
          onClick={() => setIsOpen(true)}
          title="Open TaskFlow Assistant"
        >
          <MessageCircle size={28} />
          <span className="pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <h3>✨ TaskFlow Assistant</h3>
              <p>AI-powered task helper</p>
            </div>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender}`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content">
                  <Loader size={16} className="spinner" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything... e.g., 'Add task to buy groceries'"
              disabled={loading}
              className="chat-input"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="send-btn"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
