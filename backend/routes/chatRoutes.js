const express = require('express');
const axios = require('axios');
const router = express.Router();

// Simple fallback pattern matching for when OpenAI fails
function fallbackResponse(message, tasks = []) {
  const lowerMessage = message.toLowerCase();
  
  // Add task pattern
  if (lowerMessage.includes('add') || lowerMessage.includes('create')) {
    const taskMatch = message.match(/(?:add|create|make)(?:\s+a)?\s+(?:task|todo)?\s*(?:to\s+)?(.+)/i);
    if (taskMatch) {
      const taskTitle = taskMatch[1].trim();
      // If task title is too short or generic, ask for more details
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

  // Help pattern (check early)
  if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
    return {
      response: `🤖 Here's what I can help you with:\n\n📝 "Add a task to [task name]" - Create a new task\n👀 "Show my tasks" - List all tasks\n✅ "Show completed tasks" - View finished tasks\n⏳ "Show pending tasks" - View remaining tasks\n📊 "How many tasks" - Get task statistics\n\nJust chat naturally and I'll help!`,
      action: null
    };
  }

  // Delete/remove pattern
  if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
    return {
      response: `🗑️ To delete a task:\n1. Find the task in your list\n2. Click the trash icon next to it\n3. Confirm deletion\n\nOr say "show my tasks" to see all tasks!`,
      action: null
    };
  }

  // Completed tasks pattern (check before generic "show")
  if (lowerMessage.includes('completed') || lowerMessage.includes('done tasks')) {
    const completed = tasks ? tasks.filter(t => t.completed) : [];
    const response = completed.length > 0
      ? `✅ You have ${completed.length} completed task(s):\n${completed.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}`
      : '🎉 No completed tasks yet. Keep working!';
    
    return {
      response: response,
      action: null
    };
  }

  // Pending tasks pattern (check before generic "show")
  if (lowerMessage.includes('pending') || lowerMessage.includes('remaining') || lowerMessage.includes('todo tasks')) {
    const pending = tasks ? tasks.filter(t => !t.completed) : [];
    const response = pending.length > 0
      ? `⏳ You have ${pending.length} pending task(s):\n${pending.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}`
      : '🎉 All caught up! No pending tasks.';
    
    return {
      response: response,
      action: null
    };
  }

  // Show/List tasks pattern (generic, check after specific patterns)
  if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('all tasks')) {
    const taskList = tasks && tasks.length > 0 
      ? `📋 You have ${tasks.length} task(s):\n${tasks.map((t, i) => `${i + 1}. ${t.title} ${t.completed ? '✅' : '⏳'}`).join('\n')}`
      : '📭 You have no tasks yet. Want me to help you create one?';
    
    return {
      response: taskList,
      action: null
    };
  }

  // Statistics pattern
  if (lowerMessage.includes('how many') || lowerMessage.includes('statistics') || lowerMessage.includes('stats') || lowerMessage.includes('progress')) {
    const total = tasks ? tasks.length : 0;
    const completed = tasks ? tasks.filter(t => t.completed).length : 0;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      response: `📊 Task Statistics:\n\n📋 Total Tasks: ${total}\n✅ Completed: ${completed}\n⏳ Pending: ${pending}\n📈 Progress: ${percentage}%`,
      action: null
    };
  }

  // Default helpful response
  return {
    response: `I understood: "${message}"\n\nTry asking me to:\n📝 Add a task\n👀 List tasks\n✅ Show completed\n⏳ Show pending\n📊 Get statistics\n\nOr type "help" for more options!`,
    action: null
  };
}

// OpenAI Chat Endpoint
router.post('/', async (req, res) => {
  try {
    const { message, tasks } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('Chat request received:', { message, tasksCount: tasks?.length || 0 });

    // If no API key or it looks like a placeholder, use fallback
    if (!apiKey || apiKey.includes('test') || apiKey === 'sk-proj-test-key-here') {
      console.log('No valid API key, using fallback response');
      const fallback = fallbackResponse(message, tasks);
      return res.json(fallback);
    }

    // Prepare task context for the AI
    const taskContext = tasks?.length > 0
      ? `Current tasks: ${tasks.map(t => `${t.title} (${t.completed ? 'completed' : 'pending'})`).join(', ')}`
      : 'User has no tasks yet';

    const systemPrompt = `You are TaskFlow Assistant, a helpful AI assistant for a task management app. 
You help users manage their tasks, create new ones, and provide productivity advice.
${taskContext}

When users ask to add tasks, respond with:
{"action": "addTask", "taskTitle": "task name here"}

Be concise, friendly, and use relevant emojis. Provide task management advice when helpful.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      const aiMessage = response.data.choices[0].message.content;

      // Check if AI wants to add a task
      let action = null;
      let taskTitle = null;

      if (aiMessage.includes('{"action": "addTask"')) {
        try {
          const actionMatch = aiMessage.match(/\{"action":\s*"addTask",\s*"taskTitle":\s*"([^"]+)"\}/);
          if (actionMatch) {
            action = 'addTask';
            taskTitle = actionMatch[1];
          }
        } catch (e) {
          console.log('Could not parse action from AI response');
        }
      }

      // Extract clean message (remove JSON action if present)
      const cleanMessage = aiMessage
        .replace(/\{"action":\s*"addTask",\s*"taskTitle":\s*"[^"]+"\}/, '')
        .trim();

      return res.json({
        response: cleanMessage || aiMessage,
        action,
        taskTitle
      });
    } catch (openaiError) {
      console.log('OpenAI API failed, using fallback:', openaiError.message);
      // If OpenAI fails, use fallback
      const fallback = fallbackResponse(message, tasks);
      return res.json(fallback);
    }
  } catch (error) {
    console.error('Chat endpoint error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process chat',
      details: error.message
    });
  }
});

module.exports = router;

