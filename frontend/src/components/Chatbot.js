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
      text: 'Hi! 👋 I\'m TaskFlow Assistant. I can help you create tasks, answer questions, and provide productivity tips. Try saying "Add a task" or "Show my tasks"',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskCreationStep, setTaskCreationStep] = useState(null); // null, 'name', 'date', 'time'
  const [tempTask, setTempTask] = useState({ title: '', date: '', time: '' });
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
        // If task title is too short, ask for more details
        if (taskTitle.length < 3 || taskTitle === 'task' || taskTitle === 'todo') {
          return {
            response: `📝 Sure! I'd love to help you add a task. What would you like to call it?`,
            action: 'askTaskName',
            needsDetails: true
          };
        }
        return {
          response: `📝 Got it! I'll add "${taskTitle}" to your tasks.\n\nWould you like to set a due date? (e.g., "tomorrow", "next Monday", or just say "no")`,
          action: 'askTaskDate',
          needsDetails: true,
          taskTitle: taskTitle
        };
      } else {
        // User said "add task" or "create task" but no details
        return {
          response: `📝 Sure! I'd love to help you add a task. What would you like to call it?`,
          action: 'askTaskName',
          needsDetails: true
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

    // Completed tasks pattern (check before generic show)
    if (lowerMessage.includes('completed') || lowerMessage.includes('done tasks')) {
      const completed = tasks.filter(t => t.completed);
      const response = completed.length > 0
        ? `✅ You have ${completed.length} completed task(s):\n${completed.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}`
        : '🎉 No completed tasks yet. Keep working!';
      
      return {
        response: response,
        action: null
      };
    }

    // Pending tasks pattern (check before generic show)
    if (lowerMessage.includes('pending') || lowerMessage.includes('remaining') || lowerMessage.includes('todo tasks')) {
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
      // Handle task creation flow
      if (taskCreationStep === 'name') {
        // User provided task name
        setTempTask(prev => ({ ...prev, title: userMessage }));
        setTaskCreationStep('date');
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: `📅 When should this be done? (e.g., "tomorrow", "next Monday", "2026-01-05", or just say "no due date")`,
          sender: 'bot'
        }]);
        setLoading(false);
        return;
      }

      if (taskCreationStep === 'date') {
        // User provided date
        const dateInput = userMessage.toLowerCase();
        if (dateInput !== 'no' && dateInput !== 'no due date' && dateInput !== 'none') {
          setTempTask(prev => ({ ...prev, date: userMessage }));
          setTaskCreationStep('time');
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: `⏰ What time? (e.g., "9:00 AM", "14:30", or just say "no specific time")`,
            sender: 'bot'
          }]);
        } else {
          setTempTask(prev => ({ ...prev, date: '' }));
          setTaskCreationStep('time');
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: `⏰ What time? (e.g., "9:00 AM", "14:30", or just say "no specific time")`,
            sender: 'bot'
          }]);
        }
        setLoading(false);
        return;
      }

      if (taskCreationStep === 'time') {
        // User provided time - now create the task
        const timeInput = userMessage.toLowerCase();
        if (timeInput !== 'no' && timeInput !== 'no time' && timeInput !== 'none') {
          setTempTask(prev => ({ ...prev, time: userMessage }));
        }
        
        // Create the task with all details
        const finalTask = {
          title: tempTask.title,
          description: `${tempTask.date ? `📅 Date: ${tempTask.date}\n` : ''}${tempTask.time ? `⏰ Time: ${tempTask.time}` : ''}`.trim(),
          completed: false,
          createdAt: new Date().toISOString()
        };
        
        onAddTask(finalTask);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: `✨ Task "${tempTask.title}" has been added!${tempTask.date ? ` 📅 ${tempTask.date}` : ''}${tempTask.time ? ` ⏰ ${tempTask.time}` : ''}`,
          sender: 'bot'
        }]);
        
        // Reset task creation state
        setTaskCreationStep(null);
        setTempTask({ title: '', date: '', time: '' });
        setLoading(false);
        return;
      }

      // Normal chat flow
      try {
        const response = await axios.post(CHAT_API_URL, {
          message: userMessage,
          tasks: tasks,
          userId: userId
        }, {
          timeout: 10000
        });

        const { response: aiResponse, action, taskTitle, needsDetails } = response.data;

        // Add bot response
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: aiResponse,
          sender: 'bot'
        }]);

        // Execute action if needed
        if (needsDetails && (action === 'askTaskName' || action === 'askTaskDate')) {
          // Start multi-step task creation
          setTaskCreationStep('name');
          if (taskTitle) {
            setTempTask({ title: taskTitle, date: '', time: '' });
            setTaskCreationStep('date');
          }
        } else if (action === 'addTask' && taskTitle) {
          // Quick add (one-step)
          setTimeout(() => {
            onAddTask({
              title: taskTitle,
              description: '',
              completed: false,
              createdAt: new Date().toISOString()
            });
            
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              text: `✨ Task "${taskTitle}" has been added!`,
              sender: 'bot'
            }]);
          }, 500);
        }
      } catch (apiError) {
        // Fallback to local pattern matching if API fails
        console.log('AI API unavailable, using local pattern matching');
        
        const result = processChatInput(userMessage);
        
        // Add bot response
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: result.response,
          sender: 'bot'
        }]);

        // Handle actions
        if (result.needsDetails && (result.action === 'askTaskName' || result.action === 'askTaskDate')) {
          setTaskCreationStep('name');
          if (result.taskTitle) {
            setTempTask({ title: result.taskTitle, date: '', time: '' });
            setTaskCreationStep('date');
          }
        } else if (result.action === 'addTask' && result.taskTitle) {
          setTimeout(() => {
            onAddTask({
              title: result.taskTitle,
              description: '',
              completed: false,
              createdAt: new Date().toISOString()
            });
            
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              text: `✨ Task "${result.taskTitle}" has been added!`,
              sender: 'bot'
            }]);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '❌ Sorry, I encountered an error. Please try again.',
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
